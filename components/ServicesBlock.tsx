"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { motion } from "motion/react";
import {
  BadgeDollarSign,
  Drill,
  PlaneLanding,
} from "lucide-react";
import { services } from "@/public/locales/en/common.json";

// header icons for each card
const iconCards = [BadgeDollarSign, PlaneLanding, Drill]

export function ServicesBlock() {
  return (
    <section id="services" className="w-full bg-background px-4 py-16 -mt-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center md:mb-16"
        >
          <Badge className="mb-4">
            {services.badge}
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {services.heading}
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            {services.subheading}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 md:gap-6">
          {services.content.map((service, index) => {
            const Icon = iconCards.at(index)!;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <Card className="group relative h-full overflow-hidden border-border/50 bg-card p-4 transition-all hover:border-accent hover:shadow-xl md:p-6">
                  {/* Gradient overlay */}
                  <motion.div
                    className={`absolute inset-0 ${service.bgColor} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                  />

                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div transition={{ duration: 0.6 }} className="mb-4">
                      <div
                        className={`w-fit rounded-xl ${service.bgColor} p-3`}
                      >
                        <Icon
                          className={`h-6 w-6 ${service.iconColor} md:h-7 md:w-7`}
                        />
                      </div>
                    </motion.div>

                    {/* Content */}
                    <h3 className="mb-2 text-lg font-semibold md:text-xl">
                      {service.title}
                    </h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      {service.desc}
                    </p>

                    {/* Features */}
                    <ul className="mb-4 space-y-1.5">
                      {service.features.map((feature, idx) => (
                        <motion.li
                          key={feature}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <div className={`h-1 w-1 rounded-full bg-muted-foreground`} />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
