// -----------------------------------------------------------------------------
// PROJECTS / HIGHLIGHTS
// Distilled from previous_projects/*.md into client-facing copy. Pictures were
// copied into public/projects; demo clips are the Cloudinary mp4s listed in
// previous_projects/links.txt. This file is the single source for the section.
// -----------------------------------------------------------------------------

export type Project = {
  n: string;
  slug: string;
  title: string;
  description: string;
  stack: string[];
  image: string; // path under /public
  video: string; // Cloudinary mp4
  caseStudy: string; // slug under /case-study (see src/lib/caseStudies.ts)
};

export const projectsHeading = "OUR HIGHLIGHTS";

export const projects: Project[] = [
  {
    n: "01",
    slug: "ads-agent",
    title: "Google Ads Agent",
    description:
      "A multi-client Google Ads co-pilot for agencies: competitor research, on-brand Search and Display creative at volume, campaign assembly, and human-approved publishing. Budgets and launches stay under deterministic human control, never the model's.",
    stack: ["NEXT.JS", "LANGCHAIN", "GEMINI", "GOOGLE ADS API", "SATORI", "SUPABASE"],
    image: "/projects/ads_agent.png",
    video: "https://res.cloudinary.com/df4tjjqmc/video/upload/v1784059348/ads_agent_py5drv.mp4",
    caseStudy: "ai-google-ads-automation",
  },
  {
    n: "02",
    slug: "pre-call-brief",
    title: "Pre-Call Brief Generator",
    description:
      "Point it at a prospect and it scrapes their site, performance, and SEO, detects their tech stack, then an LLM synthesizes a branded PDF brief delivered by email. Every sales call starts fully researched instead of cold.",
    stack: ["FASTAPI", "CELERY", "PLAYWRIGHT", "GEMINI", "WEASYPRINT", "RESEND"],
    image: "/projects/pre_call_brief.jpg",
    video:
      "https://res.cloudinary.com/df4tjjqmc/video/upload/v1784058232/pre_call_brief_e2qnvn.mp4",
    caseStudy: "automated-pre-call-brief-generator",
  },
  {
    n: "03",
    slug: "call-agent",
    title: "AI Voice Receptionist",
    description:
      "After-hours intake for an agency's clients, built here for U.S. med spas: a 24/7 voice agent that answers every call, books and reschedules appointments, handles FAQs, and texts confirmations. Twilio into Vapi (Deepgram, Claude, ElevenLabs) into a Fastify backend, with a live dashboard that streams each call as it happens.",
    stack: ["VAPI", "TWILIO", "CLAUDE", "ELEVENLABS", "FASTIFY", "POSTGRES"],
    image: "/projects/call_agent.jpg",
    video: "https://res.cloudinary.com/df4tjjqmc/video/upload/v1784058624/call_agent_ef3eaa.mp4",
    caseStudy: "ai-voice-receptionist",
  },
  {
    n: "04",
    slug: "legal-ops",
    title: "Legal Operations Platform",
    description:
      "An operations platform for a law firm that automates the paperwork around every client. A guest fills one intake form, pays, and the system auto-creates their account, files the case, and issues a reference number with no staff touching it. Consultations gate behind payment then auto-book, and a row-level security layer keeps clients, attorneys, and staff to exactly what they should see.",
    stack: ["NEST.JS", "SUPABASE", "POSTGRES", "LEMON SQUEEZY", "CAL.COM", "NEXT.JS"],
    // TODO: client-supplied poster + demo clip pending; using branded placeholder for now.
    image: "/projects/arco.jpg",
    video: "",
    caseStudy: "law-firm-operations-automation",
  },
  {
    n: "05",
    slug: "quant-platform",
    title: "Quant Trading Platform",
    description:
      "A full-stack quant platform that lets a non-coder automate trading the way a prop desk does. Strategies are built as a visual node graph, a genetic algorithm auto-tunes their parameters against walk-forward validation, ML models score every bar, and an AI agent researches and edits the graph on request. A risk engine sizes positions and auto-exits on breach, while real-money execution stays deliberately behind human control.",
    stack: ["NEXT.JS", "EXPRESS", "POSTGRES", "REDIS", "PYTHON", "XGBOOST"],
    // TODO: client-supplied poster + demo clip pending; using branded placeholder for now.
    image: "/projects/trading.jpg",
    video: "",
    caseStudy: "no-code-trading-automation",
  },
];
