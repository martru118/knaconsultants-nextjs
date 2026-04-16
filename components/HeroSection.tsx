import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function HeroSection() {
  return (
    <>
      <section>
        <div>
          <div className="aspect-2/3 relative z-10 flex flex-col justify-end px-6 lg:aspect-video">
            <div className="mx-auto w-full max-w-7xl pb-6 lg:px-12 lg:pb-32">
              <div className="max-w-xl">
                <h1 className="text-balance font-semibold text-5xl md:text-6xl xl:text-7xl">
                  Turn your business ideas into reality
                </h1>
                <p className="mt-6 text-balance text-lg">
                  Highly customizable components.
                </p>

                <div className="mt-8 flex items-center gap-2">
                  <Button
                    asChild
                    size="lg"
                    className="h-12 rounded-full pl-5 pr-3 text-base"
                  >
                    <Link href="#link">
                      <span className="text-nowrap">Book a free consultation</span>
                      <ChevronRight className="ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="aspect-2/3 pointer-events-none absolute inset-1 overflow-hidden rounded-3xl border border-black/10 lg:aspect-video lg:rounded-[3rem] dark:border-white/5">
            <img
              className="size-full -scale-x-100 object-cover bg-black opacity-40"
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </div>
        </div>
      </section>
      <section className="bg-background py-6">
        <div className="group relative m-auto max-w-7xl px-6">
          <div className="flex flex-col items-center md:flex-row">
            <div className="md:max-w-44 md:border-r md:pr-6">
              <p className="text-end text-sm">Powering the best teams</p>
            </div>
            <div className="**:fill-foreground relative py-6 md:w-[calc(100%-11rem)]"></div>
          </div>
        </div>
      </section>
    </>
  );
}
