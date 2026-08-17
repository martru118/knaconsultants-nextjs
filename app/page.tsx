/*  Components list
  Hero section https://tailwindflex.com/@ariaw/hero-with-background-image
  Hero button https://magicui.design/docs/components/rainbow-button
  Our services cards https://kokonutui.com/docs/cards/card
  Our services section https://ui.tripled.work/components/our-services-section
  Testimonials https://tailark.com/dusk/testimonials
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
