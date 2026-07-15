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

export type Service = { title: string; desc: string };
export type QA = { q: string; a: string };

// -- Site-wide -----------------------------------------------------------------

export const site = {
  name: "kodoAI",
  wordmark: { light: "KODO", accent: "AI" },
  tagline: "IF IT'S MANUAL AND MEASURABLE, IT CAN BE AUTOMATED",
  sub: "Custom AI agent systems for agencies that turn repetitive work into revenue.",
  email: "hello@sobanahmad.dev",
  location: ["Working worldwide."],
  cta: { label: "START A PROJECT", href: "#footer" },
};

export const nav: NavLink[] = [
  { label: "ABOUT", href: "#quotation" },
  { label: "WORK", href: "#projects" },
  { label: "PROCESS", href: "#process" },
  { label: "SERVICES", href: "#services" },
];

export const socials: Social[] = [
  { label: "LINKEDIN", href: "https://www.linkedin.com/in/soban-ahmad-malik/" },
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
    title: "WE AUDIT",
    body: "It starts with a free ad-account teardown. Read access or a few screenshots of one client account, and we show you exactly where spend is leaking and which creative has fatigued. No pitch, just proof.",
    chips: ["ACCOUNT TEARDOWN", "LEAK REPORT", "FATIGUE SCAN"],
  },
  {
    n: "02",
    title: "WE QUANTIFY",
    body: "Every leak gets a number: hours lost to manual pacing, ROAS dragged down by tired creative, the payback period on fixing it. You see the ROI before we write a line of code.",
    chips: ["ROI MODEL", "HOURS SAVED", "PAYBACK PERIOD"],
  },
  {
    n: "03",
    title: "WE BUILD",
    body: "We build the agent into your exact stack and branding, wired to reporting, intake, and onboarding. Human approval gates on anything that moves budget, full autonomy on the rest.",
    chips: ["CUSTOM AGENT", "STACK INTEGRATION", "APPROVAL GATES"],
  },
  {
    n: "04",
    title: "WE RUN",
    body: "The agent watches every account 24/7, catching CPA spikes and creative fatigue before they cost the client and reallocating budget in real time. Monthly tuning keeps it compounding.",
    chips: ["24/7 MONITORING", "SPIKE ALERTS", "MONTHLY TUNING"],
  },
];

// -- 04 Projects → see src/lib/projects.ts (analyzed from previous_projects/) ---

// -- 05 Services ---------------------------------------------------------------

export const servicesEyebrow = "WHAT WE CAN HELP WITH";

export const services: Service[] = [
  { title: "AD-OPS AGENTS", desc: "Creative generated, tested, and optimized across Meta, Google, and TikTok" },
  { title: "CPA & FATIGUE MONITORING", desc: "Spikes and tired creative caught before they cost the client" },
  { title: "COMPETITOR AD INTELLIGENCE", desc: "Rival ad libraries watched for creative and spend shifts" },
  { title: "PRE-SALES RESEARCH AGENTS", desc: "Prospect URL in, a branded pre-call brief out in 90 seconds" },
  { title: "REPORTING & ONBOARDING", desc: "Cross-platform data and kickoff calls into client-ready briefs" },
  { title: "INTAKE & VOICE AGENTS", desc: "After-hours calls and forms answered, qualified, booked 24/7" },
];

// -- 06 Q&A --------------------------------------------------------------------

export const faqEyebrow = "// FAQ";
export const faqIntro = "Everything clients ask before starting.";

export const faq: QA[] = [
  {
    q: "What does the ad-ops agent actually do?",
    a: "It generates, A/B tests, and optimizes creative across Meta, Google, and TikTok, tracks CTR, CPR, and ROAS in real time, and catches CPA spikes and creative fatigue the moment they start. Anything that moves budget waits for your approval.",
  },
  {
    q: "How do we get started?",
    a: "With a free ad-account teardown. Give us read access or a few screenshots of one client account and we'll show you where spend is leaking and which creative has fatigued. If it's worth building, we scope from there: audit, build, then retain.",
  },
  {
    q: "Will an agent mismanage my ad spend?",
    a: "No budget moves without a human approval gate wherever you want one, and the system degrades gracefully instead of guessing. The safety layer is the point, not an afterthought.",
  },
  {
    q: "How is this different from Madgicx or Revealbot?",
    a: "Those are generic products you adapt to. We build a bespoke agent into your exact workflow, branding, and stack, wired to your reporting, intake, and onboarding, and pass every API cost through at zero markup.",
  },
  {
    q: "What does it cost?",
    a: "Single-agent builds run a few thousand dollars one-time; ongoing monitoring is a monthly retainer, and every API or third-party cost passes through at zero markup. Every proposal comes with a payback period. If we can't show the system paying for itself, we'll tell you not to build it.",
  },
  {
    q: "How long does a build take, and what happens after?",
    a: "The teardown is same-week; most agents ship in 2 to 6 weeks (a full platform like AR&CO took 12). After launch it's monitoring, alerts, and monthly tuning: the automation is an asset we keep compounding.",
  },
];

// -- 06b Final CTA -------------------------------------------------------------

export const finalCta = {
  eyebrow: "// READY WHEN YOU ARE",
  lead: "IN AN AD ACCOUNT, MANUAL WORK ISN'T SLOW.",
  accent: "IT'S MONEY LEAKING IN REAL TIME.",
  ctaLabel: "LET'S AUTOMATE",
};

// Cal.com booking (element-click popup). The CTA opens this event in a modal.
export const booking = {
  namespace: "30min",
  calLink: "soban-ahmad/30min",
};

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
  sites: [
    { label: "SOBANAHMAD.DEV", href: "https://sobanahmad.dev/" },
    { label: "ABDULMOEIZ.COM", href: "https://abdulmoeiz.com" },
  ] as NavLink[],
  socialsHeading: "SOCIALS",
  ctaEyebrow: "// START A PROJECT",
  ctaLabel: "LET'S AUTOMATE",
  copyright: "© 2026 KODOAI",
  tagline: "// IF IT'S MANUAL AND MEASURABLE, IT CAN BE AUTOMATED",
  backToTop: "BACK TO TOP",
};
