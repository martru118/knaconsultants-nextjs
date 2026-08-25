/*  Components list
  Hero section https://tailark.com/blocks/mist/hero-section
  Hero button https://magicui.design/docs/components/rainbow-button
  Our Services section https://ui.tripled.work/components/services-grid-block
  About Us section https://prebuiltui.com/components/about
  Dashboard layout https://efferd.com/blocks/app-shell
*/

import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ServicesBlock } from "@/components/ServicesBlock";
import { Footer } from "@/components/Footer";

export default function Home() {
  return <main className="overflow-x-hidden">
    <Navbar />
    <HeroSection />
    <ServicesBlock />
    <Footer />
  </main>
}
