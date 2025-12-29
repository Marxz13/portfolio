"use client";

import { motion } from "framer-motion";
import { MapPin, Briefcase, GraduationCap } from "lucide-react";
import { siteConfig } from "@/config/site";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function About() {
  const highlights = [
    {
      icon: MapPin,
      label: "Location",
      value: siteConfig.author.location,
    },
    {
      icon: Briefcase,
      label: "Focus",
      value: "Full-Stack Development",
    },
    {
      icon: GraduationCap,
      label: "Learning",
      value: "Always Growing",
    },
  ];

  return (
    <section id="about" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              About <span className="gradient-text">Me</span>
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          </motion.div>

          {/* Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Hello! I&apos;m <span className="text-foreground font-semibold">{siteConfig.author.name}</span>,
                a passionate developer on a journey in the tech-ki world. I love building
                things that live on the internet and exploring new technologies.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                My interest in web development started when I decided to try creating
                custom websites — turns out hacking together HTML &amp; CSS taught me
                a lot about coding and design!
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Fast-forward to today, I&apos;ve had the privilege of working on various
                projects ranging from web applications to machine learning models.
                My main focus these days is building accessible, inclusive products
                and digital experiences.
              </p>
            </motion.div>

            {/* Highlights */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="grid gap-4">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 rounded-lg bg-card border border-border">
                  <p className="text-2xl font-bold text-primary">10+</p>
                  <p className="text-sm text-muted-foreground">Projects</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-card border border-border">
                  <p className="text-2xl font-bold text-primary">2+</p>
                  <p className="text-sm text-muted-foreground">Years</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-card border border-border">
                  <p className="text-2xl font-bold text-primary">15+</p>
                  <p className="text-sm text-muted-foreground">Technologies</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
