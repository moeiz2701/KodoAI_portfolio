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
      {/* One seamless gradient surface for all mid-page sections; the hero and
          footer keep their own backgrounds. */}
      <div className="depth-band">
        <Quotation />
        <ProcessTimeline />
        <Projects />
        <Services />
        <FAQ />
      </div>
    </>
  );
}
