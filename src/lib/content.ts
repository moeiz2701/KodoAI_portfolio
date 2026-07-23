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
  sub: "Custom AI agents and internal software that take the repetitive work off your team, in any industry.",
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
  sub: "Custom AI agents and internal software for any business: operations, sales, support, finance, marketing.",
};

// -- 02 Quotation --------------------------------------------------------------

export const quotation = {
  eyebrow: "// OUR THESIS",
  text: "EVERY PROCESS YOUR TEAM STILL RUNS BY HAND IS PAID FOR TWICE: ONCE IN HOURS, AGAIN IN THE WORK IT CROWDS OUT. WE FIND THE MOST EXPENSIVE ONE, AND WE REMOVE IT.",
  // Phrases must include their trailing punctuation: splitWords matches them as
  // literal substrings, so a stray ":" would break off into its own word.
  highlights: ["PAID FOR TWICE:", "REMOVE IT."],
  attribution: "KODOAI · AUTOMATION AGENCY",
};

// -- 03 Process Timeline -------------------------------------------------------

export const processEyebrow = "// PROCESS · HOW WE WORK";

export const process: ProcessPhase[] = [
  {
    n: "01",
    title: "WE AUDIT",
    body: "It starts with a teardown of one workflow: the quote that takes three days, the report rebuilt every Monday, the inbox nobody owns, the ad account nobody has time to watch. We sit with the people who actually run it and map every step, handoff, and wait. No pitch, just proof.",
    chips: ["WORKFLOW MAP", "TIME AUDIT", "HANDOFF TEARDOWN"],
  },
  {
    n: "02",
    title: "WE QUANTIFY",
    body: "Every step gets a number: hours burned per month, what the delay costs in lost deals or churn, what a fix is worth, and how fast it pays for itself. You see the ROI before we write a line of code, and sometimes the honest answer is that the process just needs deleting.",
    chips: ["ROI MODEL", "COST OF DELAY", "PAYBACK PERIOD"],
  },
  {
    n: "03",
    title: "WE BUILD",
    body: "We build into your stack, not around it: your CRM, your database, your spreadsheets, your tools, your branding. Agents where judgement is needed, plain deterministic code where it is not. Human approval gates on anything that touches money or customers, full autonomy on the rest.",
    chips: ["CUSTOM AGENTS", "STACK INTEGRATION", "APPROVAL GATES"],
  },
  {
    n: "04",
    title: "WE RUN",
    body: "Automation is only worth what it does on its worst day, so we monitor it. Failures alert instead of silently dropping work, edge cases come back as fixes, and monthly tuning keeps the system compounding as your process changes.",
    chips: ["24/7 MONITORING", "FAILURE ALERTS", "MONTHLY TUNING"],
  },
];

// -- 04 Projects → see src/lib/projects.ts (analyzed from previous_projects/) ---

// -- 05 Services ---------------------------------------------------------------

export const servicesEyebrow = "WHAT WE CAN HELP WITH";

export const services: Service[] = [
  {
    title: "WORKFLOW AUTOMATION",
    desc: "The multi-step process that eats your week, running end to end without a human relay",
  },
  {
    title: "INTERNAL TOOLS",
    desc: "The dashboard, portal, or admin panel your team keeps faking in a spreadsheet",
  },
  {
    title: "DOCUMENT & DATA AGENTS",
    desc: "Invoices, contracts, forms, and PDFs read, checked, and filed into your systems",
  },
  {
    title: "VOICE & INTAKE AGENTS",
    desc: "Calls, forms, and after-hours enquiries answered, qualified, and booked 24/7",
  },
  {
    title: "SALES & RESEARCH AGENTS",
    desc: "Prospects researched, briefs written, and follow-up drafted before the call",
  },
  {
    title: "AD-OPS & GROWTH AGENTS",
    desc: "Creative generated, tested, and optimized across Meta, Google, and TikTok",
  },
  {
    title: "SYSTEM INTEGRATIONS",
    desc: "The tools that do not talk to each other, wired together and kept in sync",
  },
  {
    title: "MONITORING & REPORTING",
    desc: "Numbers pulled, checked, and delivered on schedule, with alerts when they move",
  },
];

// -- 06 Q&A --------------------------------------------------------------------

export const faqEyebrow = "// FAQ";
export const faqIntro = "Everything clients ask before starting.";

export const faq: QA[] = [
  {
    q: "What kind of work do you actually automate?",
    a: "Anything manual and measurable, in any industry. Quoting, onboarding, intake, reporting, document processing, data entry between systems that don't talk, support and phone coverage, research and prep, ad operations. If it follows rules, repeats, and someone can describe it, it can usually be built.",
  },
  {
    q: "How do we get started?",
    a: "With an audit of one workflow. We sit with the people who run it, map every step and handoff, and put hours and costs against it. If it's worth building, we scope from there: audit, build, then retain. If it isn't, we'll say so.",
  },
  {
    q: "Is this just AI wrappers, or real software?",
    a: "Real software. We use models where judgement is genuinely needed (reading messy documents, drafting, classifying, holding a conversation) and plain deterministic code everywhere else, because it's cheaper, faster, and doesn't hallucinate. Most builds are mostly ordinary engineering with agents at the edges.",
  },
  {
    q: "Will an agent do something it shouldn't?",
    a: "Nothing that touches money, customers, or production data moves without a human approval gate wherever you want one, and the system degrades gracefully instead of guessing. Failures raise alerts rather than silently dropping work. The safety layer is the point, not an afterthought.",
  },
  {
    q: "How is this different from an off-the-shelf tool or Zapier?",
    a: "Products make you adapt to their idea of your process, and break at the edge cases that make your business yours. We build into your exact workflow, stack, and branding, own the edge cases, and pass every API or third-party cost through at zero markup.",
  },
  {
    q: "What does it cost?",
    a: "Single-system builds run a few thousand dollars one-time; ongoing monitoring is a monthly retainer, and every API or third-party cost passes through at zero markup. Every proposal comes with a payback period. If we can't show the system paying for itself, we'll tell you not to build it.",
  },
  {
    q: "How long does a build take, and what happens after?",
    a: "The audit is same-week; most builds ship in 2 to 6 weeks (a full platform like AR&CO took 12). After launch it's monitoring, alerts, and monthly tuning: the automation is an asset we keep compounding.",
  },
  {
    q: "We're not an agency. Does that matter?",
    a: "No. Agencies were where we started and they're still a big part of the work, but the method is industry-agnostic: find the most expensive manual process, quantify it, remove it. Clinics, e-commerce, professional services, and software teams all have the same problem in different clothes.",
  },
];

// -- 06b Final CTA -------------------------------------------------------------

export const finalCta = {
  eyebrow: "// READY WHEN YOU ARE",
  lead: "IN A BUSINESS, MANUAL WORK ISN'T SLOW.",
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
