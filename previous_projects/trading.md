CryptoWebApp — Master Application Overview

Purpose of this document. This is the single canonical, high-context reference for the entire CryptoWebApp platform. It is written so that a reader (human or AI assistant) can understand what the product is, what every major feature does, how each feature is implemented and how it works at runtime, what is production-ready vs. stubbed, where the optimization and revenue opportunities are, and how the product compares to existing market solutions. Use it to reason about improvements, advancements, launch readiness, and business success.

Companion docs: CLAUDE.md (file-level codebase map) · MODULE_OVERVIEW.md (concise module portfolio) · CRYPTOMIND_IMPLEMENTATION.md · STRATEGY_BUILDER_V2_IMPLEMENTATION.md · COIN_FEED_IMPLEMENTATION.md · GROUPS_IMPLEMENTATION.md.

Last updated: 2026-05-23.

1. Executive Summary

CryptoWebApp (product-facing name: CryptoMind) is a full-stack crypto trading platform that brings institutional-grade quantitative tooling to retail traders. It combines five capabilities that are normally sold as separate products:

A visual, no-code algorithmic strategy builder (drag-and-drop node graph, like building a flowchart).
A machine-learning trading-signal pipeline (ensemble models scoring entry/exit probability per bar).
A GenAI market-analysis assistant ("CryptoMind AI") that reasons over live data + ML + RAG.
A smart-portfolio & risk engine (Black-Litterman, CVaR, regime-aware allocation, auto-exit).
A social/community layer (group chat, public strategy marketplace, copy trading, per-coin feeds).

The platform is wrapped in a real-time market dashboard with live candlestick charts, 132 technical indicators, a wallet/portfolio view, paper-trading demo accounts, and JWT/OAuth authentication.

One-line positioning: "The quant desk for retail traders." Everything a small prop shop builds in-house — signals, backtesting, optimization, risk, execution, and a research assistant — packaged into one web app a non-coder can operate.

What stage is it at?

A feature-complete, demo-grade platform. Most modules are fully implemented end-to-end (frontend → Express API → Postgres/Redis → Python ML). A small number of paths are deliberately stubbed for safety (notably real-money execution — only demo/paper trades execute today). See §11 Launch Readiness for the honest module-by-module status.

2. Product Vision & Target Users
Segment	Pain today	What CryptoWebApp gives them
Retail "active" traders	Use TradingView for charts + a spreadsheet + Telegram signals; nothing is integrated; can't backtest without coding	Charts + indicators + backtest + automation + AI analysis in one place
Aspiring algo traders (non-coders)	Want to automate strategies but can't write Python; 3Commas/Pine Script too limited or too technical	Visual node-graph builder with GA optimization and walk-forward validation
Strategy creators / influencers	Monetize signals manually via Telegram/Discord, no verifiable track record	Public marketplace with verified backtest stats, ratings, and copy-trading subscriptions
Passive/portfolio investors	Manual rebalancing, no risk discipline, no regime awareness	Smart-portfolio optimizer + risk engine + auto-exit/circuit-breaker
Learners	Crypto trading is opaque; want to understand setups	CryptoMind AI explains setups in plain language with confluence reasoning

Core wedge: the visual strategy builder + ML signals + AI assistant trio. No single mainstream competitor offers all three in an integrated, no-code package (see §13 Competitive Landscape).

3. The Twelve Feature Pillars

Each pillar below follows the same structure: What it is → How it's implemented → How it works at runtime → Status & business value.

3.1 Visual Strategy Builder

What. A ReactFlow drag-and-drop canvas where users compose trading strategies as node graphs — indicator blocks, condition blocks, entry/exit logic, and risk rules wired together. No code required.

How it's implemented.

Frontend: components/strategy-builder/ — Canvas.tsx (ReactFlow editor), Sidebar.tsx (block palette), CustomNode.tsx (node renderer), PropertiesPanel.tsx (node config), ValidationPanel.tsx, BacktestModal.tsx, GAOptimizeModal.tsx, AIChatPanel.tsx, AutomationPanel.tsx.
Block schema: lib/strategy-builder/blockDefinitions.ts defines every node type and its config schema. Types in types/strategy-builder.ts.
Backend: strategy.service.ts (CRUD) + strategy.repository.ts (Postgres strategies table).
Graph delta system (graphDeltaApplier.ts on both client and server): the AI assistant edits the graph by emitting structured JSON patch operations (add/remove/update node or edge) rather than rewriting the entire graph state — this keeps AI edits safe, diffable, and reversible.

How it works at runtime. User drags blocks → wires them → configures parameters in the properties panel → client-side validator (lib/strategy-builder/validator.ts) checks the graph → instant in-canvas backtest preview (backtestEngine.ts) → save persists to Postgres → optionally optimize (GA) or deploy to live automation.

Status & value. Production-grade UI. This is the flagship differentiator — the thing no mainstream retail competitor does well in a true no-code visual form.

3.2 ML Trading Pipeline (Signal Generation)

What. A 4-stage supervised-learning pipeline that produces per-bar entry/exit probability scores for BTCUSDT and ETHUSDT (1h), built on event detection + gradient-boosted ensembles.

How it's implemented — see ML/ and the memory index:

Stage	Module	What it does
1 — Raw data	ML/Dataset/output/*_features.csv	Pre-computed OHLCV feature matrices
2 — Event feature selection	eventBasedFeatureSelection/event_pipeline.py	RobustScaler → 5-fold CV (F-stat → mutual info → importance) → 25 features per event
3 — Event model training	train_event_models.py	8 binary classifiers (breakout, liquidity_sweep, reversal, volatility_expansion, trend_continuation, volume_spike, false_breakout, momentum_spike); sigmoid calibration
4 — Entry/exit ensemble	model_trainer.py / main.py	XGBoost + LightGBM + CatBoost, AUC-weighted soft-vote; lag features (t-1/t-2/t-3) for RSI, MACD, volume ratio, ATR
132 TypeScript indicator files in indicators/ double as feature extractors (*FeatureExtractor.ts) — the same indicator code powers both chart overlays and ML features, guaranteeing train/serve parity for the TS-computed features.
Inference: ML/inference/run_inference.py, spawned as a Python child process by backend/.../aiModelExecutor.service.ts; results cached per session in Redis.

How it works at runtime. A request for a coin's signals spawns Python → loads event models → computes 8 event probabilities → feeds them (plus engineered + lag features) into the entry/exit ensemble → returns calibrated probabilities → cached in Redis → surfaced in MLSignals.tsx and CryptoMind AI.

Status & value. Implemented and documented; trained for BTC/ETH 1h. Known calibration/leakage gotchas are fixed (see §12). Value: this is the quantitative credibility of the platform — it's what separates "another charting app" from "a signal engine."

3.3 CryptoMind AI (GenAI Reasoning Agent)

What. A conversational market-analysis agent at /market/[id]/chat that synthesizes live data into structured trade setups — the "research analyst in your pocket."

How it's implemented. See CRYPTOMIND_IMPLEMENTATION.md. Five GenAI techniques: prompt engineering (analyst persona + 5-step CoT), chain-of-thought reasoning, tool use / agentic dispatch (decides when to call ML + RAG), RAG (FAISS vector store of historical BTC setups), and structured JSON output rendered as UI cards. LLM via Groq llama-3.3-70b (note: the backend also ships the Anthropic SDK — see §5).

How it works at runtime — two-path design:

Slow path (2–5 min, first analyze): fetch 200 live Binance candles → Python agent runs indicator engine + ML inference (8 event probs) + FAISS top-3 retrieval → LLM produces structured analysis card → all outputs cached in Redis (2-hr TTL).
Fast path (~1–3 s, follow-ups): subsequent chat turns read the Redis cache and skip the Python spawn entirely.

Status & value. Implemented. Strong demo/marketing surface and a genuine retention hook — turns a data dashboard into an explainable advisor. The session-caching design is the key cost/latency optimization.

3.4 Genetic Algorithm Optimizer

What. Automated evolutionary search over a strategy graph's parameters to find high-fitness configs.

How it's implemented. DEAP-backed engine in ML/StrategyAI/ga/ — chromosome.py, deap_setup.py, engine.py, fitness.py, operators.py (custom crossover/mutation), risk_constraints.py, walk_forward.py. Async via Celery (tasks/ga_tasks.py); runs stored in ga_runs table. Surfaced via GAOptimizeModal and /api/ga.

How it works. User picks parameters to optimize → GA evolves a population, each individual scored by walk-forward fitness (out-of-sample, anti-overfit) with risk constraints baked into the fitness function (invalid risk profiles are penalized, not silently dropped) → best chromosome written back to the strategy graph.

Status & value. Implemented. Differentiator vs. simple "parameter sweep" tools — this is real evolutionary optimization with overfitting guards.

3.5 Backtesting & Validation Engine

What. Walk-forward backtesting with combinatorially-purged cross-validation (CPCV) and a full performance metric suite.

How it's implemented. Server: backtest.service.ts (walk-forward), strategyValidation.service.ts (CPCV + risk validation), strategyPerformance.service.ts (metrics), persisted to backtest_results. Client: lib/strategy-builder/backtestEngine.ts for instant in-canvas preview. Results in BacktestResultsModal.

How it works. Historical OHLCV → walk-forward splits → CPCV prevents look-ahead leakage → metrics (Sharpe, Sortino, max drawdown, win rate, profit factor, avg trade duration) → persisted and rendered.

Status & value. Implemented. CPCV is institutional-grade — most retail tools only do naive in-sample backtests, which is exactly how retail algos blow up. This is a credibility moat.

3.6 Smart Portfolio & Risk Engine

What. Quantitative portfolio construction + real-time risk management.

How it's implemented. Smart_portfolio/:

Optimizer (portfolio_optimizer/): black_litterman.py, cvar_optimizer.py, regime-aware regime_detector.py, optimize.py.
Risk engine (risk_engine/, 18+ modules): position_sizer.py, assess_trade.py, auto_exit.py, circuit_breaker.py, correlation.py, risk_constraints.py, risk_guardrails.py, scheduler.py, plus infra (redis_client.py, db.py, data_fetcher.py).
ML signals feed weights via ml_signal/ml_signal_generator.py.
Frontend: components/wallet/SmartPortfolio.tsx; backend portfolio.service.ts.

How it works. Regime detector classifies market state → optimizer (Black-Litterman blends market equilibrium with views; CVaR controls tail risk) produces target weights → risk engine sizes positions, monitors correlation/exposure, and fires auto-exit / circuit-breaker on breaches.

Status & value. Implemented as a Python engine. Black-Litterman + CVaR + regime awareness is genuinely advanced for a retail product; this is the "robo-advisor, but transparent and quant" angle.

3.7 Technical Indicator Library (132 files)

What. 132 TypeScript indicators across 10 categories, computing over raw OHLCV.

How it's implemented. indicators/ organized by category (Breakout, Displacement, FVG, Footprint, Liquidity, Order Blocks, Patterns, Swing Structure, Trendlines, Technical). Powers chart overlays via components/chart/IndicatorEngine.ts and ML features via *FeatureExtractor.ts.

Status & value. Implemented. The Smart-Money-Concepts depth (order blocks, FVG, liquidity sweeps, CHoCH/BOS) is a strong draw for the SMC trader niche — far beyond the EMA/RSI most apps stop at.

3.8 Community Hub (Chat · Marketplace · Copy Trading · Leaderboard)

What. The social/network-effects layer.

How it's implemented. Backend communityStrategy.service.ts, chat.service.ts, copyTrading.service.ts; repositories + community_schema.sql (tables: chat_rooms, chat_messages, strategy_community_stats, strategy_ratings, copy_trading_subscriptions). Real-time via Socket.IO /chat namespace (socket/chat.ts) and copyTradingEvents.ts EventEmitter → Socket.IO fan-out. Frontend: components/community/, components/leaderboard/StrategyLeaderboard.tsx.

How it works.

Chat: join rooms, threaded replies, emoji reactions stored as { "👍": [userId,...] } JSONB (idempotent toggle), soft-delete + flagging.
Marketplace/Leaderboard: anonymous browse via optionalAuth (logged-in users get their own user_rating per row); filter by risk, sort by performance/rating/followers; 5-star ratings with aggregates kept in sync by both a service transaction and a DB trigger.
Copy trading: subscribe to a leader; allocation cap enforced in service pre-flight and a Postgres trigger (safety net); trades mirror via the event bus.

Status & value. Implemented — except real-wallet copy execution is stubbed: getAvailableBalance() returns 0 for non-demo accounts, so only demo copy trades execute today. Value: this is the network-effect / retention / virality engine and a marketplace monetization path.

3.9 Coin Feed (per-coin social feed)

What. Twitter-style per-coin post feed for live sentiment.

How it's implemented. coin_feed_schema.sql; one feed per coin_symbol; authenticated post, anonymous read; upvote/downvote with toggle + direction-switch; score as a generated Postgres column; Socket.IO room feed:{SYMBOL} real-time fan-out; cursor pagination (page size 20); 24-hour auto-expiry cleanup. See COIN_FEED_IMPLEMENTATION.md. Recent commit 66462c9 implemented post creation, voting, deletion.

Status & value. Implemented (recent). Lightweight engagement loop tied to each market page.

3.10 Market Overview & Coin Analysis

What. Real-time market dashboard + per-coin tabbed analysis.

How it's implemented. components/market/ (CoinTable.tsx, TradingPanel.tsx, CoinPriceInfo.tsx, AdvancedFilters.tsx); per-coin route /market/[id] with tabs Chart · Analysis · Chat · News · Orders · Strategies. Live prices via Binance WebSocket hooks (useRealtimePrice, useSharedWebSocket, useRealtimeCandles). Charts via Lightweight-Charts (coinChart.tsx) with 8 indicator settings panels.

Status & value. Implemented. The home base that makes the platform feel like a real exchange-grade terminal.

3.11 Wallet & Portfolio Dashboard

What. Live portfolio view: balances, positions, equity curve, analytics.

How it's implemented. components/wallet/ (PortfolioCharts.tsx, BalanceHistoryChart.tsx, PortfolioAnalytics.tsx, PositionsPanel.tsx, SmartPortfolio.tsx); APIs under /api/wallet/*; backend portfolio.service.ts. Demo wallet at /wallet/demo.

Status & value. Implemented. Metrics: Sharpe, drawdown, win rate, exposure.

3.12 Authentication, Accounts & Demo Trading

What. JWT auth with email verification, Google OAuth, tiered access, and isolated paper-trading.

How it's implemented. Backend auth.service.ts (JWT + bcrypt), interfaces/middleware/auth.ts, tierAuth.ts (role/tier gating), interfaces/utils/jwt.ts; email codes via nodemailer + verificationCode entity. Frontend lib/authService.ts, lib/googleAuth.ts, contexts/AuthContext.tsx, components/auth/. Demo accounts (demoAccount.service.ts) provide simulated balances fully isolated from live wallets.

Status & value. Implemented. Tier gating is the paywall hook for monetization; demo accounts are the risk-free onboarding funnel.

4. System Architecture & Data Flow
Browser (Next.js 15 / React 19)
  ├─ live prices ──────────────► Binance WebSocket (direct)
  └─► app/api/* (thin proxy / SSR)
        └─► Express.js API (:3001)        [Controller → Service → Repository → DB/External]
              ├─► PostgreSQL              (persistent state: users, strategies, orders, community…)
              ├─► Redis / Upstash         (cache + pub/sub + AI session cache)
              ├─► Python ML
              │     ├─ child_process: ML/inference/run_inference.py  (signal scoring)
              │     ├─ child_process: CryptoMind agent (indicators + ML + FAISS RAG + LLM)
              │     └─ Celery queue: ML/StrategyAI/  (GA + LLM strategy generation)
              ├─► Socket.IO               (/chat namespace, coin feed rooms, copy-trade fan-out)
              └─► WebSocket (ws)          (live automation state → browser)
Frontend root: app/ (Next.js App Router). Next.js runs on :3000, Express on :3001.
Backend layering is strict: Controller → Service → Repository → DB/External. 20+ services, 15+ repositories, 18 route groups.
Container: backend/Dockerfile ships Node 20 + Python 3.11 so ML inference runs in-process via child_process; Python deps in backend/ml-inference-requirements.txt.
5. Technology Stack
Layer	Tech
Frontend	Next.js 15.3, React 19, TypeScript 5.8, Tailwind 3.4, Framer Motion, GSAP, Lenis, ReactFlow 11, Lightweight-Charts 5, Recharts 3, Chart.js, lucide/react-icons
Auth	JWT (jsonwebtoken), bcrypt/bcryptjs, NextAuth, Google OAuth, iron sessions; Coinbase CDP SDK + OnchainKit present
Backend	Express 5, TypeScript, Socket.IO 4, ws 8, pg (PostgreSQL), redis, nodemailer, cors
AI/LLM	Anthropic SDK (@anthropic-ai/sdk in backend) + Groq llama-3.3-70b (CryptoMind agent); FAISS for RAG
ML	Python 3.11, XGBoost, LightGBM, CatBoost, scikit-learn, DEAP, pandas, NumPy, scipy, Celery, joblib
Data store	PostgreSQL (primary, ~59KB schema), Redis/Upstash (crucial-roughy-60435.upstash.io)
Market data	Binance REST + WebSocket (binance-api-node)
Testing	Jest (jsdom) — __tests__/ covers auth, indicators, strategy builder, wallet, analytics, order validation

Note / cleanup flag: package.json lists mongoose (frontend) and the backend lists placeholder packages anthropic/anthropic-ai alongside the real @anthropic-ai/sdk. The system of record is PostgreSQL via pg; Mongo/Mongoose is not the primary store. Worth pruning before launch (see §14 Optimization).

6. ML Pipeline Deep Dive (and why the design choices matter)

The pipeline's credibility rests on three hard-won fixes (all in CLAUDE.md gotchas and memory):

Sigmoid (not isotonic) calibration for event models — isotonic collapsed imbalanced probabilities to ~0. This is the difference between usable and useless event probabilities.
Leakage filter with protected_prefixes = ('event_prob_', 'event_binary_', 'bars_since_', 'confluence_') in feature_engineering.py:_remove_leaky_features — protects legitimate engineered features from being stripped while still removing look-ahead leakage.
NaN handling before inference (X = X.fillna(X.median())) — prevents silent inference failures.

Train/serve parity: TS indicators are the single source of truth for many features (used in both chart and ML), reducing the classic train/serve skew that kills production ML.

Scope today: trained for BTCUSDT & ETHUSDT at 1h. Expanding symbols/timeframes is the obvious next ML investment (see roadmap).

7. Data Model & Persistence
PostgreSQL is the system of record. Full schema in backend/sql/complete_setup.sql (~59KB), plus domain SQL: ga_rl_setup.sql, market_snapshots.sql, community_schema.sql, coin_feed_schema.sql.
Domain entities (backend/domain/): user, wallet, order, position, demoAccount, transaction, chartSettings, verificationCode.
Notable DB-level integrity (triggers, not just app code):
trg_strategy_ratings_sync_stats — keeps rating aggregates correct even on direct writes.
trg_copy_trading_check_allocation — hard cap on copy-trade allocation as a safety net.
Generated score column on coin-feed posts (upvotes − downvotes).
Redis/Upstash: AI session cache (2-hr TTL), price/feed caches, pub/sub for real-time.

Design principle worth preserving: critical invariants (rating sums, allocation caps) are enforced in both the service layer and the database. This defense-in-depth is exactly right for anything touching money/reputation.

8. Real-Time Infrastructure
Channel	Tech	Use
Live prices/candles	Binance WebSocket (client-direct)	Chart + ticker; useSharedWebSocket multiplexes one connection
Community chat	Socket.IO /chat namespace	rooms, replies, reactions, typing
Coin feed	Socket.IO room feed:{SYMBOL}	live post fan-out
Copy trading	Node EventEmitter → Socket.IO	mirror-trade notifications
Live automation	ws server	strategy execution state → browser
9. Security & Auth Posture

In place: JWT verification middleware, bcrypt hashing, email verification, Google OAuth, tier/role gating (tierAuth.ts), optionalAuth for public-but-personalized reads, DB-trigger invariants, soft-delete

flagging + content moderation in chat.

Pre-launch must-review (see §11 & §15):

next.config.ts ignores ESLint and TypeScript build errors — fine for velocity, dangerous for a money app at launch; turn on in CI at minimum.
Secrets live in .env.local (Upstash URL is documented) — ensure no secrets are committed and rotate any that were.
Real-money execution is stubbed today; before enabling live trading, a full security + compliance review (key custody, withdrawal controls, rate limiting, audit logging) is mandatory.
Rate limiting / abuse controls on public endpoints (feed, chat, marketplace) should be verified.
10. Repository Layout (orientation)
app/                  Next.js project root (the working directory)
├─ app/               App Router pages + /api proxy routes
├─ components/        Feature-organized React components
├─ lib/               Frontend services + strategy-builder utilities
├─ hooks/             Real-time price/candle hooks
├─ indicators/        132 TS indicators + feature extractors
├─ backend/           Express API (domain / application / infrastructure / interfaces)
│  └─ sql/            PostgreSQL schema + domain SQL
├─ ML/                Python: StrategyAI (GA+LLM), models (train+prod), inference, Dataset
├─ Smart_portfolio/   Python: optimizer + 18-module risk engine
├─ __tests__/         Jest suite
└─ docs/              This file + implementation/design docs

Full file-level map: CLAUDE.md.

11. Launch Readiness — Maturity Matrix
Module	Status	Notes / blocker to "production-for-money"
Auth & accounts	🟢 Ready	Standard JWT/OAuth; verify rate limiting
Demo / paper trading	🟢 Ready	Isolated simulated balances
Market dashboard & charts	🟢 Ready	Live Binance data
Indicator library	🟢 Ready	132 indicators
Visual strategy builder	🟢 Ready	Flagship; UX polish only
Backtesting + CPCV	🟢 Ready	Institutional-grade validation
GA optimizer	🟢 Ready	Celery async
CryptoMind AI	🟢 Ready	Cost/latency managed via Redis cache
ML signal pipeline	🟡 Partial	Only BTC/ETH 1h trained; needs more symbols/TFs + monitoring
Smart portfolio / risk	🟡 Partial	Engine exists; verify wiring to live UI + data freshness
Community (chat/marketplace/leaderboard)	🟢 Ready	Real-time + moderation in place
Copy trading	🟠 Stubbed for real money	getAvailableBalance() returns 0 for non-demo; only demo executes
Live (real-money) order execution	🔴 Not enabled	Deliberate; needs custody, compliance, security review
Build hygiene	🟠 Risky	TS/ESLint errors ignored at build (next.config.ts)

Legend: 🟢 ready · 🟡 partial · 🟠 stub/risk · 🔴 not enabled.

Bottom line for launch: The platform can launch today as a paper-trading + research + social product (no custody risk, full feature showcase). Real-money trading is a separate, heavier milestone gated on compliance and security work.

12. Known Decisions & Gotchas

(Authoritative copy in CLAUDE.md and project memory.)

Event-model calibration = sigmoid (isotonic collapses imbalanced probs to ~0).
EventModelLoader default path is relative (./trained_models/event_models); notebooks monkey-patch to absolute.
Leakage filter protected prefixes (see §6).
NaN fill before inference with column medians.
Next.js build ignores TS/ESLint errors.
Ports: Next 3000, Express 3001.
Ensemble: XGBoost + LightGBM + CatBoost, AUC-weighted soft-vote.
Community optional auth injects per-row user_rating for logged-in users.
Chat reactions stored as user-ID arrays (idempotent), returned as counts.
Copy-trading real-wallet stub returns 0 balance for non-demo accounts.
Allocation cap & rating aggregates enforced in service and DB trigger.
13. Competitive Landscape
Competitor	What they do well	Where CryptoWebApp wins
TradingView	Best-in-class charts, Pine Script, huge community	No-code visual builder (vs. Pine code); integrated ML signals + AI analyst; portfolio/risk engine; backtest with CPCV
3Commas / Cryptohopper	Bots, DCA/grid, exchange connectivity	True visual graph builder, GA optimization, walk-forward/CPCV validation, AI research agent — not just preset bot templates
Composer / Capitalise.ai	No-code/NL strategy automation	Deeper quant stack (event ML, Black-Litterman, CVaR, regime), SMC indicator depth, social marketplace
eToro / Bitget copy trading	Mass-market copy trading, liquidity	Copy trading plus the tools to build/verify the strategies being copied; transparent backtest stats
Coinbase / Binance (native)	Custody, liquidity, trust	Strategy intelligence layer they lack; could sit on top of exchanges rather than compete on custody
Telegram/Discord signal groups	Cheap, social, fast	Verifiable track records, integrated execution, no opaque "trust me" signals

Defensible edges (the moat candidates):

Integration — the only place that has visual builder + ML signals + AI analyst + risk engine + social, all wired together.
Validation rigor — CPCV + walk-forward + GA with overfitting guards is genuinely rare in retail.
Network effects — marketplace + copy trading + feeds compound: more creators → more strategies → more copiers → more data.

Honest weaknesses: no custody/liquidity of its own (dependency on exchanges), ML coverage is thin (BTC/ETH 1h), and the brand has zero trust/track-record yet. Trust is the hardest thing to bootstrap in crypto.

14. Optimization Opportunities

Performance / cost

CryptoMind already caches ML+RAG in Redis (2-hr TTL) — extend the same pattern to signal inference and backtests; precompute popular coins on a schedule rather than on-demand.
Python child_process spawning is heavy under load — consider a persistent Python worker / service (FastAPI or a Celery worker pool) instead of cold-spawning per request.
useSharedWebSocket already multiplexes Binance — audit for connection leaks at scale.

Code/build hygiene

Turn on TS/ESLint in CI (keep ignored only for emergency deploys).
Prune dead deps (mongoose, placeholder anthropic/anthropic-ai); pick one LLM provider story (Groq vs Anthropic) and document it.

ML

Expand symbol/timeframe coverage; add model monitoring (drift, calibration over time, live PnL of signals) — without this, signal quality silently rots.
Add a feedback loop: log realized outcomes vs. predicted probabilities to retrain.

Product

Make the strategy builder's instant backtest the "aha" moment in onboarding.
Verify Smart Portfolio is wired to live data and surfaced prominently — it's underexposed relative to its value.
15. Risk Register
Risk	Severity	Mitigation
Enabling real-money trading without compliance/custody review	🔴 Critical	Keep stubbed; treat live trading as a separate gated milestone with security review
Build ignores TS/ESLint errors → shipping broken code	🟠 High	Enforce in CI before launch
ML signals decay (no monitoring) → users lose money trusting stale models	🟠 High	Add drift/calibration monitoring + realized-outcome logging
Marketplace/leaderboard gamed by fake/overfit strategies	🟠 High	Require CPCV-verified out-of-sample stats; flag in-sample-only entries
Secrets in .env.local / committed config	🟠 High	Audit git history; rotate; use a secrets manager
Single market-data dependency (Binance)	🟡 Medium	Add fallback provider; cache last-good
Regulatory exposure (signals = financial advice?)	🟡 Medium	Clear disclaimers; "educational/paper" framing until licensed
LLM cost/latency spikes	🟡 Medium	Already cached; add budgets/limits
16. Monetization & Business Model Options
Freemium tiers (already wired via tierAuth.ts): free = paper trading + basic charts; Pro = AI analyst, GA optimization, CPCV backtests, more ML symbols; Elite = live automation + smart portfolio.
Marketplace take-rate: % of copy-trading subscription revenue between strategy creators and copiers.
Creator monetization: let verified strategy authors charge for access → platform takes a cut (two-sided marketplace flywheel).
Usage-metered AI: CryptoMind analyses as a metered/credit feature for heavy users.
B2B / white-label: the quant stack (backtest+GA+risk engine) licensed to smaller exchanges or fintech apps that lack it.

Recommended GTM sequencing: launch as free paper-trading + AI research + social to build trust and a track record → introduce Pro tier for power features → enable copy-trading marketplace revenue once a creator base exists → only then pursue real-money execution with the compliance lift it requires.

17. Suggested Roadmap (priority order)

Now (launch-blocking):

CI gate on TS/ESLint; dependency cleanup.
Secrets audit + rotation.
Disclaimers + "paper/educational" framing throughout.
ML monitoring scaffold (calibration + realized PnL logging).

Next (growth): 5. Expand ML symbol/timeframe coverage; persistent Python inference worker. 6. Marketplace verification (out-of-sample-only stats) to prevent overfit gaming. 7. Onboarding funnel that lands users in the strategy builder + first backtest fast. 8. Smart Portfolio surfacing + live-data wiring confirmation.

Later (moat / revenue): 9. Creator monetization + marketplace take-rate. 10. Real-money execution milestone (custody, compliance, security review, audit logging). 11. Mobile / PWA; more exchanges; data-provider redundancy.

18. Glossary
CPCV — Combinatorially Purged Cross-Validation; prevents look-ahead leakage in backtests.
Walk-forward — train on past window, test on the next; rolls forward to mimic live trading.
SMC — Smart Money Concepts (order blocks, FVG, liquidity sweeps, BOS/CHoCH).
FVG — Fair Value Gap; price imbalance zone.
BOS / CHoCH — Break of Structure / Change of Character (trend-structure signals).
Black-Litterman — portfolio model blending market equilibrium with investor views.
CVaR — Conditional Value at Risk; expected loss in the tail beyond VaR.
Regime — classified market state (e.g., trending/ranging/volatile) driving allocation.
RAG — Retrieval-Augmented Generation; injects retrieved context (here, historical setups via FAISS).
AUC-weighted soft-vote — ensemble averaging weighted by each model's validation AUC.
Graph delta — structured JSON patch ops the AI uses to edit a strategy graph safely.

This document is intended to stay current. When a module's status changes (e.g., real-money execution is enabled, or more ML symbols are trained), update §11 Launch Readiness and §12 Known Gotchas first — those are the sections most consulted for decisions.