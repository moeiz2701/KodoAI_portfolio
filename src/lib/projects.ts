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
};

export const projectsHeading = "OUR HIGHLIGHTS";

export const projects: Project[] = [
  {
    n: "01",
    slug: "call-agent",
    title: "AI Voice Receptionist",
    description:
      "A 24/7 voice agent for U.S. med spas that answers every call, books and reschedules appointments, handles FAQs, and texts confirmations. Twilio into Vapi (Deepgram, Claude, ElevenLabs) into a Fastify backend, with a live dashboard that streams each call as it happens.",
    stack: ["VAPI", "TWILIO", "CLAUDE", "ELEVENLABS", "FASTIFY", "POSTGRES"],
    image: "/projects/call_agent.jpg",
    video: "https://res.cloudinary.com/df4tjjqmc/video/upload/v1784058624/call_agent_ef3eaa.mp4",
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
  },
  {
    n: "03",
    slug: "ads-agent",
    title: "Google Ads Agent",
    description:
      "A multi-client Google Ads co-pilot for agencies: competitor research, on-brand Search and Display creative at volume, campaign assembly, and human-approved publishing. Budgets and launches stay under deterministic human control, never the model's.",
    stack: ["NEXT.JS", "LANGCHAIN", "GEMINI", "GOOGLE ADS API", "SATORI", "SUPABASE"],
    image: "/projects/ads_agent.png",
    video: "https://res.cloudinary.com/df4tjjqmc/video/upload/v1784059348/ads_agent_py5drv.mp4",
  },
];
