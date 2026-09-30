"use client"

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, Phone } from "lucide-react";
import { Badge } from "./ui/badge";
import { contact } from "@/public/messages/en.json";
import { useProfileStore } from "@/hooks/use-profile";
import { motion } from "motion/react";

export function ContactSection() {
  const userProfile = useProfileStore(state => state.profile)
	const common = contact.content

	// header icons and links for each card
	const iconCards = [Mail, Phone, Calendar]
	const hrefCards = [`mailto:${common.at(0)?.label}`, `tel:+1${common.at(1)?.label.replace(/\D/g, "")}`, `/${userProfile}`]
  
	return (
		<section id="contact" className="mx-auto max-w-4xl px-4 py-16">
			<motion.div 
				initial={{ opacity: 0, x: -20 }}
				whileInView={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.6 }}
				className="mb-12 flex max-w-md flex-col justify-center gap-2"
			>
        <Badge className="mb-2">{contact.badge}</Badge>
				<h1 className="font-bold text-2xl md:text-3xl">{contact.heading}</h1>
				<p className="text-base text-muted-foreground">
					{contact.subheading}
				</p>
			</motion.div>

			<div className="grid gap-0.5 overflow-hidden rounded-lg bg-muted p-0.5 md:grid-cols-3 dark:bg-muted/50">
				{common.map((item, index) => {
					const Icon = iconCards.at(index)!

					return (						
						<motion.div
							key={item.title}
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1, duration: 0.5 }}
							className="flex flex-col gap-3 rounded-lg bg-background px-6 py-6 shadow-xs"
						>
							<div
								className={cn(
									"flex items-center gap-x-2",
									"[&_svg]:size-4 [&_svg]:text-muted-foreground"
								)}
							>
								<Icon />
								<h2 className="text-sm">{item.title}</h2>
							</div>
							<p className="text-muted-foreground text-sm">{item.desc}</p>
							<div className="mt-1 flex items-center gap-x-2">
								<Button asChild variant="link">
									<a href={hrefCards.at(index)}>{item.label}</a>
								</Button>
							</div>
						</motion.div>
					) 
				})}
			</div>
		</section>
	);
}
