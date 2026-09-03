/*  Components list
  Hero section https://tailark.com/blocks/mist/hero-section
  Hero button https://magicui.design/docs/components/rainbow-button
  Our Services section https://ui.tripled.work/components/services-grid-block
  About Us section https://shadcn-ui-blocks.com/blocks/marketing/about-sections/two-column
  Dashboard layout https://shadcnspace.com/blocks/dashboard-ui/sidebars
*/

import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ServicesBlock } from "@/components/ServicesBlock";
import { Footer } from "@/components/Footer";
import { AboutUsBlock } from "@/components/AboutUsBlock";

export default function Home() {
  return <main className="overflow-x-hidden">
    <Navbar />
    <HeroSection />
    <ServicesBlock />
    <AboutUsBlock />
    <Footer />
  </main>
}
