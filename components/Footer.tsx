"use client"

import { LogoIcon } from "@/components/logo";
import Link from "next/link";
import { header } from "@/public/locales/en/common.json"

export function Footer() {
  return (
    <footer className="bg-background border-b py-8">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap justify-between gap-12">
          <div className="order-last flex items-center gap-3 md:order-first">
            <Link href="/" aria-label="go home">
              <LogoIcon />
            </Link>
            <span className="text-muted-foreground block text-center text-sm">
              © {new Date().getFullYear()} {header.footer}
            </span>
          </div>

          <div className="order-first flex flex-wrap gap-x-6 gap-y-4 md:order-last">
            {header.nav.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-muted-foreground hover:text-primary block duration-150"
              >
                <span>{link.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
