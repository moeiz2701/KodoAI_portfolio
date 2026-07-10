import Hero from "@/components/sections/Hero";
import Quotation from "@/components/sections/Quotation";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";
import FAQ from "@/components/sections/FAQ";

export default function Home() {
  return (
    <>
      <Hero />
      <Quotation />
      <ProcessTimeline />
      <Projects />
      <Services />
      <FAQ />
    </>
  );
}
