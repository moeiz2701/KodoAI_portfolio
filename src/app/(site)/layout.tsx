import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/**
 * Chrome for the single-page site: the fixed Header (with in-page anchor nav)
 * and the shared Footer. Case study routes live outside this group and bring
 * their own slim nav, so their pages don't inherit the anchor Header. Global
 * concerns (fonts, SmoothScroll, grain, Preloader) stay in the root layout.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
