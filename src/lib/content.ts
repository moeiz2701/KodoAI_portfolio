// -----------------------------------------------------------------------------
// SINGLE SOURCE OF TRUTH FOR ALL COPY.
// Rule (IMPLEMENTATION.md §2 / §12): zero hardcoded strings in components.
// When copy is upgraded later, this is the only file that changes.
// -----------------------------------------------------------------------------

export type NavLink = { label: string; href: string };
export type Social = { label: string; href: string };

export type ProcessPhase = {
  n: string;
  title: string;
  body: string;
  chips: string[];
};

export type Project = {
  n: string;
  title: string;
  desc: string;
  metric: { value: string; unit: string; label: string };
  videoId: string; // Cloudinary public id (wired in Phase 5)
  posterSec: number;
};

export type Service = { title: string; desc: string };
export type QA = { q: string; a: string };

// -- Site-wide -----------------------------------------------------------------

export const site = {
  name: "kodoAI",
  wordmark: { light: "KODO", accent: "AI" },
  tagline: "IF IT'S MANUAL AND MEASURABLE, IT CAN BE AUTOMATED",
  sub: "Custom AI agent systems for agencies that turn repetitive work into revenue.",
  email: "hello@kodoai.dev",
  location: ["Based in Islamabad, Pakistan.", "Working worldwide."],
  cta: { label: "START A PROJECT", href: "#footer" },
};

export const nav: NavLink[] = [
  { label: "ABOUT", href: "#quotation" },
  { label: "WORK", href: "#projects" },
  { label: "PROCESS", href: "#process" },
  { label: "SERVICES", href: "#services" },
];

export const socials: Social[] = [
  { label: "LINKEDIN", href: "#" },
  { label: "INSTAGRAM", href: "#" },
  { label: "X/TWITTER", href: "#" },
  { label: "YOUTUBE", href: "#" },
];

// -- 01 Hero -------------------------------------------------------------------

export const hero = {
  eyebrow: "// FULL STACK AI AUTOMATION",
  headline: "IF IT'S MANUAL AND MEASURABLE, IT CAN BE AUTOMATED.",
  sub: "Custom AI agent systems for agencies that turn repetitive work into revenue.",
};

// -- 02 Quotation --------------------------------------------------------------

export const quotation = {
  eyebrow: "// OUR THESIS",
  text: "EVERY HOUR YOUR TEAM SPENDS ON REPETITIVE WORK IS AN HOUR A MACHINE SHOULD HAVE TAKEN. WE FIND THOSE HOURS, AND WE GIVE THEM BACK.",
  highlights: ["REPETITIVE WORK", "GIVE THEM BACK"],
  attribution: "KODOAI · AUTOMATION AGENCY",
};

// -- 03 Process Timeline -------------------------------------------------------

export const processEyebrow = "// PROCESS — HOW WE WORK";

export const process: ProcessPhase[] = [
  {
    n: "01",
    title: "WE RESEARCH",
    body: "We embed in your operation and map every workflow. Where time leaks, where errors repeat, where humans do robot work. Nothing gets automated until it's understood.",
    chips: ["WORKFLOW MAPPING", "TIME AUDIT", "BOTTLENECK REPORT"],
  },
  {
    n: "02",
    title: "WE CALCULATE",
    body: "Every candidate process gets a number: hours saved, error rate removed, payback period. You see the ROI before we write a line of code.",
    chips: ["ROI MODEL", "HOURS SAVED", "PAYBACK PERIOD"],
  },
  {
    n: "03",
    title: "WE AUTOMATE",
    body: "We build, test, and deploy custom AI agent systems into your stack. Human approval gates where they matter, full autonomy where they don't.",
    chips: ["AGENT BUILD", "STACK DEPLOY", "APPROVAL GATES"],
  },
  {
    n: "04",
    title: "WE MONITOR",
    body: "Dashboards, alerts, and monthly optimization. Automation isn't a launch, it's an asset we keep compounding.",
    chips: ["LIVE DASHBOARDS", "ALERTS", "MONTHLY TUNING"],
  },
];

// -- 04 Projects ---------------------------------------------------------------

export const projectsEyebrow = "SUCCESS STORIES";

export const projects: Project[] = [
  {
    n: "01",
    title: "LEAD INTAKE ENGINE",
    desc: "End-to-end lead qualification agents for a US marketing agency: scoring, enrichment, CRM sync, instant routing.",
    metric: { value: "120+", unit: "HRS", label: "saved monthly" },
    videoId: "kodoai/lead-engine",
    posterSec: 2,
  },
  {
    n: "02",
    title: "AI VOICE RECEPTION",
    desc: "24/7 voice agents handling booking, rescheduling and FAQs for service businesses. Zero missed calls.",
    metric: { value: "3.2×", unit: "MORE", label: "bookings captured" },
    videoId: "kodoai/voice-reception",
    posterSec: 2,
  },
  {
    n: "03",
    title: "REPORTING AUTOPILOT",
    desc: "Client reporting that writes itself: data pulls, insight generation, branded PDF delivery every Monday 9am.",
    metric: { value: "40H → 15M", unit: "", label: "per cycle" },
    videoId: "kodoai/reporting-autopilot",
    posterSec: 2,
  },
  {
    n: "04",
    title: "PROPOSAL FACTORY",
    desc: "Research-to-proposal pipeline: competitor scans, pricing models, ready-to-send decks from a single brief.",
    metric: { value: "6×", unit: "FASTER", label: "turnaround" },
    videoId: "kodoai/proposal-factory",
    posterSec: 2,
  },
];

// -- 05 Services ---------------------------------------------------------------

export const servicesEyebrow = "WHAT WE CAN HELP WITH";

export const services: Service[] = [
  { title: "AI AGENT SYSTEMS", desc: "Multi-agent pipelines that think, decide, and execute" },
  { title: "WORKFLOW AUTOMATION", desc: "Manual ops turned into self-running systems" },
  { title: "AI VOICE AGENTS", desc: "Calls answered, booked, and logged 24/7" },
  { title: "DATA PIPELINES & REPORTING", desc: "From raw data to decision-ready reports" },
  { title: "CUSTOM INTEGRATIONS", desc: "Your stack, finally talking to itself" },
  { title: "AUTOMATION STRATEGY", desc: "Roadmaps ranked by ROI, not hype" },
];

// -- 06 Q&A --------------------------------------------------------------------

export const faqEyebrow = "// FAQ";
export const faqIntro = "Everything clients ask before starting.";

export const faq: QA[] = [
  {
    q: "What can actually be automated?",
    a: "If it's manual and measurable, it's a candidate: lead handling, reporting, scheduling, data entry, follow-ups, research, quoting. We audit first and only automate where ROI is provable.",
  },
  {
    q: "How long does a project take?",
    a: "Discovery in week one. Most systems ship in 2 to 6 weeks depending on integrations. You see working demos, not slide decks.",
  },
  {
    q: "Will this replace my team?",
    a: "It replaces their busywork. Your people move to work that needs judgment; the agents handle the rest, with human approval gates wherever you want them.",
  },
  {
    q: "What does it cost?",
    a: "Every proposal comes with a calculated payback period. If we can't show the system paying for itself, we'll tell you not to build it.",
  },
  {
    q: "What tools do you work with?",
    a: "Your existing stack first: CRMs, calendars, email, Slack/WhatsApp, sheets, databases. We build custom AI agents on top rather than forcing new software on your team.",
  },
  {
    q: "What happens after launch?",
    a: "Monitoring, dashboards, and monthly optimization. Automations are assets; we keep them compounding.",
  },
];

// -- 07 Footer -----------------------------------------------------------------

export const footer = {
  navHeading: "NAVIGATION",
  nav: [
    { label: "ABOUT", href: "#quotation" },
    { label: "WORK", href: "#projects" },
    { label: "PROCESS", href: "#process" },
    { label: "SERVICES", href: "#services" },
    { label: "CONTACT", href: "#footer" },
  ] as NavLink[],
  detailsHeading: "STUDIO DETAILS",
  socialsHeading: "SOCIALS",
  ctaEyebrow: "// START A PROJECT",
  ctaLabel: "LET'S AUTOMATE",
  copyright: "© 2026 KODOAI",
  tagline: "// IF IT'S MANUAL AND MEASURABLE, IT CAN BE AUTOMATED",
  backToTop: "BACK TO TOP",
};
