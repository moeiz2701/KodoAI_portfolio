// -----------------------------------------------------------------------------
// CASE STUDIES
// One long-form page per Highlights project (src/lib/projects.ts). Structure and
// copy are distilled from the source case studies; the presentation is rebuilt on
// kodoAI's tokens (CaseStudyView.tsx). Slugs match the /case-study/<slug> route
// and each project's `caseStudy` field.
// -----------------------------------------------------------------------------

export type CSMeta = { label: string; value: string };
export type CSCard = { num: string; title: string; description: string; tags: string[] };
export type CSMetric = { title: string; description: string; metric: string; metricLabel: string };
export type CSOutcome = { value: string; label: string; sublabel: string };

// A multi-line display heading: `lead` lines render in ink, the `tail` line in
// accent (tailAccent) or muted (ghost).
export type CSHeading = { lead: string[]; tail: string; tailAccent: boolean };

export type CSCardGroup = {
  eyebrow: string;
  heading: CSHeading;
  intro: string;
  cards: CSCard[];
};

export type CaseStudy = {
  slug: string;
  project: string; // matching project slug in projects.ts
  ambient: string; // giant ghost background word
  title: string; // hero headline, line 1
  titleSub: string; // hero headline, line 2 (ghosted)
  lead: string;
  meta: CSMeta[];
  rating: boolean; // show the five-star UPWORK badge
  techStack: string[];

  problem: {
    heading: CSHeading;
    body: string[];
    quote: string;
  };

  built: CSCardGroup; // grid of feature / pipeline cards
  how: {
    eyebrow: string;
    heading: CSHeading;
    intro: string;
    rows: CSCard[]; // list rows
  };
  roi?: {
    eyebrow: string;
    heading: CSHeading;
    intro: string;
    cards: CSMetric[];
  };
  outcomes: {
    eyebrow: string;
    metrics: CSOutcome[];
    checklist?: string[];
  };
  cta: {
    heading: CSHeading;
    body: string;
    label: string;
  };
};

const CTA_BODY =
  "We scope everything in detail before payment is taken. You work directly with a senior engineer, not a project manager relaying messages to an offshore team.";

export const caseStudies: CaseStudy[] = [
  // ── AI Voice Receptionist ───────────────────────────────────────────────────
  {
    slug: "ai-voice-receptionist",
    project: "call-agent",
    ambient: "MAYA AI",
    title: "AI VOICE RECEPTIONIST",
    titleSub: "FOR MED SPAS",
    lead: "Maya is a production-grade voice AI receptionist built specifically for med spas. She answers every inbound call within 3 rings, handles the full booking conversation, creates appointments, and sends SMS confirmations.",
    meta: [
      { label: "Vertical", value: "Med Spas / Aesthetics" },
      { label: "By", value: "Soban Ahmad, KodoAI" },
    ],
    rating: true,
    techStack: [
      "Twilio", "Vapi", "Deepgram Nova-3", "Claude Sonnet 4", "Cartesia Sonic-2",
      "Fastify", "Supabase", "PostgreSQL", "Next.js",
    ],
    problem: {
      heading: { lead: ["EVERY", "MISSED CALL"], tail: "IS LOST REVENUE.", tailAccent: true },
      body: [
        "Med spas operate in a high-intent, appointment-driven market where the phone call is the sale. A prospective client searching \"Botox near me\" or \"lip filler consultation\" is ready to book, if someone answers.",
        "Front desks are busiest during treatment hours, the same hours when calls peak. The phone rings, goes to voicemail, and a $750 lip filler appointment walks to a competitor who picked up. Voicemail callback rates in med spas average 12-18%. The caller already found someone else.",
      ],
      quote:
        "They needed a receptionist that is available 24/7, never calls in sick, and seamlessly books appointments against their real schedule.",
    },
    built: {
      eyebrow: "// WHAT WAS BUILT",
      heading: { lead: ["24/7 AI AGENT."], tail: "LIVE BOOKING.", tailAccent: false },
      intro:
        "Maya answers calls naturally, handles pricing inquiries dynamically, checks availability via real-time API integrations, and performs actual database transactions to confirm appointments.",
      cards: [
        {
          num: "01",
          title: "Identifies the Caller",
          description:
            "Greets returning clients by name, remembers preferred providers, flags VIP status, and notes sensitivities seamlessly.",
          tags: ["Personalization", "CRM Sync"],
        },
        {
          num: "02",
          title: "Service Inquiries",
          description:
            "Navigates 13 service categories with real pricing ranges and units, steering non-standard medical questions to free consultations.",
          tags: ["Dynamic Pricing", "Medical Deflection"],
        },
        {
          num: "03",
          title: "Real-Time Availability",
          description:
            "Queries actual provider schedules across Mon-Sat hours with 15-minute slot granularity, respecting provider-service qualifications.",
          tags: ["Smart Scheduling", "Provider Logic"],
        },
      ],
    },
    how: {
      eyebrow: "// HOW IT WORKS",
      heading: { lead: ["ENGINEERING"], tail: "DECISIONS.", tailAccent: false },
      intro:
        "The platform orchestrates Twilio for PSTN, Vapi for AI voice management, and a Fastify backend connecting to Supabase for PMS integration and real-time dashboard updates.",
      rows: [
        {
          num: "01",
          title: "Transaction-Safe Booking",
          description:
            "Database transactions prevent double-booking when two callers request the same slot simultaneously. Captures essential details instantly.",
          tags: ["Concurrency Control", "Frictionless Capture"],
        },
        {
          num: "02",
          title: "Real-Time Owner Dashboard",
          description:
            "Live conversation streaming directly to a dashboard. Watch ROI metrics update, track conversions, and monitor every call transcript in real-time.",
          tags: ["Live Webhooks", "SSE Updates"],
        },
        {
          num: "03",
          title: "Instant SMS Confirmation",
          description:
            "Sends an SMS confirmation via Twilio within 10 seconds of booking, before the call even ends, driving down no-show rates.",
          tags: ["Twilio SMS", "Instant Delivery"],
        },
        {
          num: "04",
          title: "Graceful Degradation",
          description:
            "If SMS fails, booking succeeds. If recording upload fails, data logs. Built to prioritize the core booking action above all else.",
          tags: ["Fault Tolerance", "Reliability"],
        },
      ],
    },
    roi: {
      eyebrow: "// THE ROI",
      heading: { lead: ["WHY IT"], tail: "MATTERS.", tailAccent: true },
      intro:
        "At an average booking value of $450, missing 25% of 50 monthly calls leads to thousands in lost revenue. Maya changes the fundamental math of a med spa's front desk.",
      cards: [
        {
          title: "After-Hours Coverage",
          description:
            "Available 24/7 including evenings, weekends, and holidays, peak inquiry times when no one is at the desk.",
          metric: "24/7",
          metricLabel: "Always on, zero missed calls",
        },
        {
          title: "Concurrent Call Handling",
          description:
            "A human receptionist handles one call at a time. Maya handles an infinite number of simultaneous calls without putting anyone on hold.",
          metric: "100%",
          metricLabel: "Handling capacity",
        },
        {
          title: "Instant Conversion",
          description:
            "Voicemail callback conversion is 12-18%. Maya books the client while they are still highly motivated to schedule.",
          metric: "40-50%",
          metricLabel: "Live conversion rate",
        },
      ],
    },
    outcomes: {
      eyebrow: "// OUTCOMES",
      metrics: [
        { value: "100%", label: "Calls Answered", sublabel: "Zero missed opportunities" },
        { value: "40-50%", label: "Live Conversion", sublabel: "Compared to 12-18% on voicemail" },
        { value: "3-4", label: "Break-Even", sublabel: "Bookings needed to cover cost" },
        { value: "3 Days", label: "To Launch", sublabel: "From setup to first call" },
      ],
    },
    cta: {
      heading: { lead: ["WANT RESULTS"], tail: "LIKE THIS?", tailAccent: true },
      body: CTA_BODY,
      label: "BOOK A 15-MIN CALL",
    },
  },

  // ── Pre-Call Brief Generator ────────────────────────────────────────────────
  {
    slug: "automated-pre-call-brief-generator",
    project: "pre-call-brief",
    ambient: "PRE-CALL",
    title: "PRE-CALL BRIEF",
    titleSub: "GENERATOR",
    lead: "An AI-powered prospect intelligence pipeline that automates pre-call research for marketing agency sales teams.",
    meta: [
      { label: "Domain", value: "Sales Enablement & AI" },
      { label: "By", value: "Soban Ahmad, KodoAI" },
    ],
    rating: false,
    techStack: [
      "Python 3.12", "FastAPI", "Next.js 14", "Tailwind CSS", "shadcn/ui", "Framer Motion",
      "Google Gemini API", "Playwright", "Celery", "Redis", "PostgreSQL", "Supabase", "Docker", "Railway",
    ],
    problem: {
      heading: { lead: ["LOST", "IN"], tail: "RESEARCH.", tailAccent: true },
      body: [
        "Before an inbound discovery call, marketing agency sales reps typically spend 20-40 minutes manually researching a prospect. They dig through the company's website, LinkedIn profile, and active ads to understand their positioning. In reality, this research often gets skipped due to time constraints, resulting in generic discovery calls and lost deals.",
        "The primary technical challenge was building a highly reliable asynchronous pipeline capable of scraping unstructured data from disparate sources, making sense of it without AI hallucinations, and delivering the final brief, all within a 60-180 second window. Furthermore, the initial version was architected to be completely free-tier optimized for sales demos, requiring graceful degradation when facing rate limits.",
      ],
      quote:
        "Given just a prospect's website URL, the system orchestrates a complex data collection and AI analysis pipeline to deliver a structured, actionable intelligence brief straight to the sales rep's inbox.",
    },
    built: {
      eyebrow: "// PIPELINE FLOW",
      heading: { lead: ["SIX STAGES."], tail: "ONE MINUTE.", tailAccent: false },
      intro:
        "The backend is driven by Python, FastAPI, and Celery, executing an asynchronous workflow to gather, analyze, and synthesize prospect data.",
      cards: [
        {
          num: "01",
          title: "Intake",
          description:
            "A sleek Next.js frontend (or CRM webhook) submits the prospect URL. A background job is immediately enqueued via Redis.",
          tags: ["Next.js", "Webhook", "Redis Queue"],
        },
        {
          num: "02",
          title: "Parallel Data Collection",
          description:
            "Seven tasks run concurrently: scraping website & LinkedIn via Playwright, querying Meta Ad Library, Google PageSpeed Insights, and detecting tech stack via custom regex.",
          tags: ["Playwright", "Meta Graph API", "Asyncio"],
        },
        {
          num: "03",
          title: "Structured AI Analysis",
          description:
            "Raw unstructured data is passed to Google Gemini 2.5 Flash, which extracts a structured company profile and analyzes their marketing posture.",
          tags: ["Gemini 2.5 Flash", "Data Extraction"],
        },
        {
          num: "04",
          title: "AI Synthesis & Delivery",
          description:
            "Gemini 2.5 Pro writes the final brief (openers, pricing anchors, red flags). It is rendered into a branded PDF via WeasyPrint, uploaded to Supabase, and emailed via Resend.",
          tags: ["Gemini 2.5 Pro", "WeasyPrint", "Resend"],
        },
      ],
    },
    how: {
      eyebrow: "// KEY FEATURES",
      heading: { lead: ["ENGINEERING"], tail: "DECISIONS.", tailAccent: false },
      intro:
        "Building a reliable data collection pipeline that won't fail when third-party services block scraping attempts requires defensive engineering.",
      rows: [
        {
          num: "01",
          title: "Graceful Degradation",
          description:
            "The async collection steps (asyncio.gather with return_exceptions=True) ensure that if LinkedIn blocks a scraping attempt, the pipeline continues smoothly and honestly reports the data gap in the final brief.",
          tags: ["Asyncio", "Fault Tolerance", "Data Gaps Handling"],
        },
        {
          num: "02",
          title: "Real-Time UI Tracker",
          description:
            "The Next.js frontend polls the backend using TanStack Query to display a live, step-by-step progress tracker as the AI pipeline works, ensuring users aren't left staring at a static loading spinner.",
          tags: ["TanStack Query", "Live Polling", "UX"],
        },
        {
          num: "03",
          title: "Scalable Architecture",
          description:
            "The free-tier data providers (like DIY regex scanning and Playwright) are abstracted behind unified client interfaces, making it trivial to swap them out for enterprise APIs without touching the core orchestration logic.",
          tags: ["Abstracted Interfaces", "Modular Architecture"],
        },
      ],
    },
    outcomes: {
      eyebrow: "// THE IMPACT",
      metrics: [
        { value: "25", label: "Hours Saved", sublabel: "Per month for senior staff" },
        { value: "60s", label: "Delivery Time", sublabel: "From URL to finished PDF brief" },
        { value: "100%", label: "Prep Consistency", sublabel: "Every call thoroughly researched" },
        { value: "0", label: "Hallucinations", sublabel: "Strictly grounded on retrieved data" },
      ],
      checklist: [
        "Automated the most tedious phase of the sales process, allowing teams to focus on selling rather than researching",
        "Sales teams walk into every discovery call fully prepared with deep context and tailored talking points",
        "Guaranteed 100% preparation consistency across all reps, driving higher close rates",
      ],
    },
    cta: {
      heading: { lead: ["WANT TO BUILD"], tail: "AI PIPELINES?", tailAccent: true },
      body: CTA_BODY,
      label: "BOOK A 15-MIN CALL",
    },
  },

  // ── AI Google Ads Automation ────────────────────────────────────────────────
  {
    slug: "ai-google-ads-automation",
    project: "ads-agent",
    ambient: "ADS CO-PILOT",
    title: "AI GOOGLE ADS",
    titleSub: "AUTOMATION",
    lead: "An automated research-to-launch system that distills competitive intelligence into policy-safe, highly optimized Google Ads campaigns, saving agencies up to 95% of setup time.",
    meta: [
      { label: "Vertical", value: "Marketing Agencies" },
      { label: "By", value: "Soban Ahmad, KodoAI" },
    ],
    rating: true,
    techStack: [
      "LangChain", "Python", "Node.js", "Next.js", "Supabase", "PostgreSQL",
      "Google Ads API", "SerpApi", "Gemini", "Satori", "Resvg",
    ],
    problem: {
      heading: { lead: ["MANUAL", "SETUP"], tail: "DOESN'T SCALE.", tailAccent: true },
      body: [
        "Marketing agencies running Google Ads for multiple clients face an operational bottleneck that has nothing to do with strategy, it's the hours of repetitive labor before a single ad serves.",
        "For every new client campaign, an account manager spends 13 to 25 hours on competitive research, ad copywriting, display creative production, campaign assembly, and policy review.",
      ],
      quote:
        "Agencies either limit their client count, hire junior staff who make policy mistakes risking account suspensions, or cut corners on research producing generic ads.",
    },
    built: {
      eyebrow: "// WHAT WAS BUILT",
      heading: { lead: ["RESEARCH-TO-LAUNCH"], tail: "CO-PILOT.", tailAccent: false },
      intro:
        "This system automates the entire front half of Google Ads management while keeping humans in control of strategy, budgets, and the publish button.",
      cards: [
        {
          num: "01",
          title: "Competitive Analysis",
          description:
            "Scrapes and analyzes 100+ competitor ads, ranking angles by longevity to find proven strategies and gap opportunities.",
          tags: ["SerpApi", "Longevity Ranking", "Gap Analysis"],
        },
        {
          num: "02",
          title: "Variant Generation",
          description:
            "Generates gap-first Search RSA headlines and descriptions, strictly adhering to character limits and insight-derived strategies.",
          tags: ["Deterministic Padding", "Insight Mapping"],
        },
        {
          num: "03",
          title: "Display Creative Generation",
          description:
            "Uses structured render-specs to generate Display ads automatically into 7 standard sizes without the LLM ever writing layout HTML/CSS.",
          tags: ["Satori", "Resvg", "Dynamic Scaling"],
        },
      ],
    },
    how: {
      eyebrow: "// SAFETY & ARCHITECTURE",
      heading: { lead: ["NON-NEGOTIABLE"], tail: "CONSTRAINTS.", tailAccent: false },
      intro:
        "The system relies on a LangChain Python service and a Next.js dashboard, communicating to a Supabase Postgres database. Safety is designed into the core architecture.",
      rows: [
        {
          num: "01",
          title: "Deterministic Budgeting",
          description:
            "The LLM never sets or modifies budgets. Budget values flow deterministically from the client profile and are hard-capped at every layer.",
          tags: ["Hard Capping", "Strict Execution"],
        },
        {
          num: "02",
          title: "Two-Layer Quality Gate",
          description:
            "A deterministic policy scan checks for banned superlatives and terms. The LLM rubric critiques clarity, CTA strength, and differentiation.",
          tags: ["Compliance Gate", "Double Verification"],
        },
        {
          num: "03",
          title: "Automated Campaign Assembly",
          description:
            "Assembles ad groups, keyword distributions, and bid strategies automatically based on insights without human assembly time.",
          tags: ["Smart Defaults", "Token Distribution"],
        },
        {
          num: "04",
          title: "Explicit Human Launch",
          description:
            "The system never publishes on its own. Every campaign creation requires an explicit human review and approval action via a modal.",
          tags: ["Human in the Loop", "Configure by Exception"],
        },
      ],
    },
    roi: {
      eyebrow: "// THE ROI",
      heading: { lead: ["AGENCY-LEVEL"], tail: "IMPACT.", tailAccent: true },
      intro:
        "The system doesn't just save time, it changes the agency's unit economics. Adding clients 7-25 is pure margin without a new hire needed.",
      cards: [
        {
          title: "95% Less Labor",
          description:
            "Campaign setup drops from 13-25 hours per client down to 30-60 minutes, consisting mostly of quick human review.",
          metric: "95%",
          metricLabel: "Time saved per campaign",
        },
        {
          title: "Exponential Capacity",
          description:
            "Account managers can scale from 5-8 clients up to 25-40 without sacrificing ad quality, unlocking pure margin.",
          metric: "3-5x",
          metricLabel: "Increase in client capacity",
        },
        {
          title: "Insight-Driven Ads",
          description:
            "Unlike generic AI copywriting tools, every ad variant is grounded in competitive intelligence and longevity data.",
          metric: "100+",
          metricLabel: "Competitor ads analyzed",
        },
      ],
    },
    outcomes: {
      eyebrow: "// OUTCOMES",
      metrics: [
        { value: "0.5 hr", label: "Setup Time", sublabel: "Down from 13-25 hours" },
        { value: "3-5x", label: "AM Capacity", sublabel: "More clients per manager" },
        { value: "7", label: "Ad Sizes", sublabel: "Auto-rendered Display images" },
        { value: "0", label: "Policy Errors", sublabel: "Zero non-compliant ads pushed" },
      ],
    },
    cta: {
      heading: { lead: ["WANT RESULTS"], tail: "LIKE THIS?", tailAccent: true },
      body: CTA_BODY,
      label: "BOOK A 15-MIN CALL",
    },
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
