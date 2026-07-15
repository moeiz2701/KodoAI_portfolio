import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CaseStudyView from "@/components/case-study/CaseStudyView";
import { caseStudies, getCaseStudy } from "@/lib/caseStudies";
import type { NavLink } from "@/lib/content";

// Same site Header, one nav item: HOME (→ "/"). Logo also returns home.
const HOME_NAV: NavLink[] = [{ label: "HOME", href: "/" }];

// Statically render one page per case study (the site is fully static).
export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  const title = `${cs.title} ${cs.titleSub} — kodoAI case study`;
  return {
    title,
    description: cs.lead,
    openGraph: { title, description: cs.lead, type: "article" },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  return (
    <>
      <Header links={HOME_NAV} logoHref="/" />
      <CaseStudyView cs={cs} />
      <Footer />
    </>
  );
}
