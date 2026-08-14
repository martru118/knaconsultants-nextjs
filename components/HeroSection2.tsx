"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkle } from "lucide-react";
import { hero } from "../public/locales/en/common.json"

export function HeroSection2() {
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
                <Button
                  asChild
                  size="lg"
                >
                  <Link href="#link">
                    <span className="text-nowrap">{hero.cta}</span>
                    <ChevronRight className="ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10 mx-auto max-w-5xl px-6">
              <div className="mt-12 md:mt-16">
                <div className="bg-background rounded-(--radius) relative mx-auto overflow-hidden border border-transparent shadow-lg shadow-black/10 ring-1 ring-black/10">
                  <img
                    className="size-full -scale-x-100 object-cover bg-black"
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
