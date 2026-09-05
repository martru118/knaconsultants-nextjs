"use client"

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { hero } from "@/public/locales/en/common.json"
import { RainbowButton } from "./ui/rainbow-button";
import { useProfileStore } from "@/hooks/use-profile";

export function HeroSection() {
  const userProfile = useProfileStore(state => state.profile)

  return (
    <main>
      <section className="before:bg-muted border-e-foreground relative overflow-hidden before:absolute before:inset-1 before:h-[calc(100%-8rem)] before:rounded-2xl sm:before:inset-2 md:before:rounded-[2rem] lg:before:h-[calc(100%-14rem)]">
        <div className="py-20 md:py-36">
          <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
            <div>
              <h1 className="mx-auto mt-8 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
                {hero.heading}
              </h1>
              <p className="text-muted-foreground mx-auto my-6 max-w-xl text-balance text-xl">
                {hero.subheading}
              </p>

              <div className="flex items-center justify-center gap-3">
                <RainbowButton asChild size="lg">
                  <Link href={`/${userProfile}`} prefetch={false}>
                    <span className="text-nowrap text-white dark:text-black">{hero.cta}</span>
                    <ArrowRight className="ml-2 h-4 w-4 text-white dark:text-black" />
                  </Link>
                </RainbowButton>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10 mx-auto max-w-5xl px-6">
              <div className="mt-12 md:mt-16">
                <div className="bg-background rounded-(--radius) relative mx-auto overflow-hidden border border-transparent shadow-lg shadow-black/10 ring-1 ring-black/10">
                  <img
                    className="-scale-x-100 object-cover"
                    loading="lazy"
                    alt={hero.image.alt}
                    src={hero.image.url}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
