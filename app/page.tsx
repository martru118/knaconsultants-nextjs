/*  Components list
  Hero section https://tailwindflex.com/@ariaw/hero-with-background-image
  Hero button https://magicui.design/docs/components/rainbow-button
  Our services cards https://kokonutui.com/docs/cards/card
  Our services section https://ui.tripled.work/components/our-services-section
  Testimonials https://tailark.com/dusk/testimonials
*/

import { Navbar } from "@/components/Navbar";
import { HeroSection2 } from "@/components/HeroSection2";
import { ServicesBlock } from "@/components/ServicesBlock";
import { checkUser } from "@/lib/check-user";

export default async function Home() {
  await checkUser()

  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <HeroSection2 />
      <ServicesBlock />
    </main>
  );
}
