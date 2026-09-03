"use client";

import { about } from "@/public/locales/en/common.json";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";

const competencies = about.content.competencies;
const stats = about.stats

export function AboutUsBlock() {
  return (
    <section
      id="about"
      className="container mx-auto px-4 py-24 md:px-6 2xl:max-w-[1400px]"
    >
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-xl shadow-2xl lg:max-w-md w-full"
        >
          {/* Section image */}
          <img
            src={about.image.url}
            alt={about.image.alt}
            className="object-cover"
          />

          {/* Stats banner */}
          <div className="flex items-center gap-1 absolute bottom-6 left-6 right-6 bg-background p-3 rounded-xl border">
            <div className="grid gap-4 grid-cols-3 text-center mx-auto">
              {stats.map((item, idx) => (
                <div key={idx}>
                  <div className="text-foreground space-y-1 text-lg md:text-2xl gradient-title">{item.number}</div>
                  <p className="text-muted-foreground text-xs">{item.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div>
            <Badge className="mb-4">{about.badge}</Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              {about.heading}
            </h2>
          </div>
          <p className="text-muted-foreground">{about.subheading}</p>

          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="pt-2"
          >
            <h3 className="mb-3 text-lg font-bold">{about.content.title}</h3>
            <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {competencies.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="text-primary h-5 w-5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
