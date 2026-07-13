# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies (uses uv)
uv sync

# Install Playwright browsers (required for scraping)
uv run playwright install chromium

# Start local Postgres + Redis
docker compose up -d

# Apply DB migrations
uv run alembic upgrade head

# Run dev server
uv run uvicorn src.main:app --reload

# Run Celery worker (separate terminal)
uv run celery -A src.tasks.celery_app.celery_app worker --loglevel=info

# Run tests
uv run pytest

# Run a single test file
uv run pytest tests/unit/test_foo.py -v

# Generate a new migration after changing models
uv run alembic revision --autogenerate -m "describe change"
```

## Architecture

### Request flow

1. `POST /briefs` (auth: `X-Api-Key` header) → creates a `Brief` DB row with `status=pending` → enqueues `tasks.generate_brief` Celery task → returns 202 with brief ID.
2. Celery worker picks up the task and calls `src/pipeline/orchestrator.py:run_pipeline(brief_id)`.
3. Pipeline runs 4 stages in sequence, updating the `Brief` row throughout.
4. `GET /briefs/{id}` polls status and returns results when complete.

### Pipeline stages (`src/pipeline/orchestrator.py`)

**Round 1 — parallel, no deps:**
- `scrape_website` (Playwright + trafilatura)
- `fetch_performance` (Google PageSpeed API)
- `scrape_linkedin` (Playwright on public page — only if `contact_linkedin_url` provided)

**Round 2 — parallel, depends on round 1 website data:**
- `detect_tech_stack` (synchronous regex scan — runs first)
- `analyze_seo_signals` (parses sitemap, robots.txt, schema markup, OG tags)
- `extract_company_info` (LLM Flash: extracts structured company data from scraped text)

**Analysis — sequential LLM steps:**
- `analyze_profile` → `CompanyProfile` (LLM Flash)
- `analyze_posture` → `MarketingAnalysis` (LLM Flash)

**Synthesis:**
- `synthesize_brief` → `Brief` (LLM Pro — highest quality model)

**Render & Deliver:**
- `render_brief_markdown` + `render_brief_html` (Jinja2 from `templates/`)
- `render_pdf`: WeasyPrint first, Playwright headless as fallback
- Upload PDF to Supabase Storage
- Send email via Resend

Every stage is wrapped in `_timed()` which logs a `pipeline_events` row on success or failure. All exceptions are caught and converted to data gaps — the pipeline never aborts early due to a single step failure.

### LLM client abstraction

`get_gemini_client()` in `src/clients/gemini_client.py` is the sole factory for LLM clients. If `GROQ_API_KEY` is set it returns a `GroqClient` instead of `GeminiClient` — both expose identical `.call_flash()` and `.call_pro()` methods. Pipeline steps always call `get_gemini_client()` and never instantiate LLM clients directly.

### Prompts

All LLM prompts live in `prompts/*.txt` as Python format-string templates (use `str.format(**kwargs)`). Steps load them at call time via `Path.read_text()`. There are three prompts: `extract_company_profile_v1.txt`, `analyze_marketing_posture_v1.txt`, `synthesize_brief_v1.txt`.

### Data flow / context object

`PipelineContext` (`src/pipeline/context.py`) is the single mutable accumulator passed through all pipeline steps. All fields are optional — any step can fail without breaking the rest. `ctx.data_gaps` is a list of string keys identifying which sources returned no usable data; it is included in the final brief so the reader knows what's missing.

### Database models (`src/db/models.py`)

Three tables: `clients`, `briefs`, `pipeline_events`. SQLAlchemy 2.0 with async (`asyncpg` driver). Sessions are managed via `get_db` dependency (FastAPI) or `get_session_factory` (Celery tasks, which run outside the request cycle).

### Pydantic models split

- `src/pipeline/models.py` — all data shapes: collection outputs (`WebsiteData`, `LinkedInData`, etc.), LLM outputs (`CompanyProfile`, `MarketingAnalysis`), and the final `Brief`.
- `src/api/schemas.py` — API-layer request/response schemas.
- `src/pipeline/context.py` — the runtime accumulator passed between steps.

### Config

`src/config.py` uses Pydantic Settings loaded from `.env`. `get_settings()` is `lru_cache`-wrapped — safe to call anywhere. `settings.is_production` gates Swagger UI, CORS, and Sentry.

### Error types (`src/clients/base.py`)

`ClientError` (base) → `RateLimitError`, `TemporaryError`, `AuthError`. All client wrappers map provider-specific errors to these. `AuthError` for unconfigured credentials (missing API key) is handled gracefully in the orchestrator — it skips the step/delivery rather than failing the pipeline.

## Key dev notes

- WeasyPrint requires GTK on Windows. Without it, PDF falls back to Playwright headless automatically — no code change needed.
- LinkedIn scraping from Playwright public pages is unreliable by design; treat `linkedin_data = None` as a normal outcome.
- The Celery worker must be running separately for the pipeline to execute. The FastAPI app only enqueues tasks.
- `docker compose up -d` is required before running the app or tests that touch the database.
