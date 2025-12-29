"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { skills } from "@/config/skills";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function Skills() {
  return (
    <section id="skills" className="py-20 sm:py-32 bg-card/50">
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
              Tech <span className="gradient-text">Stack</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Technologies and tools I work with
            </p>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full mt-4" />
          </motion.div>

          {/* Skills Grid - Logo Only */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-6 sm:gap-8"
          >
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
                className="group flex flex-col items-center gap-2"
              >
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 p-2 rounded-xl bg-card border border-border group-hover:border-primary/50 group-hover:scale-110 transition-all duration-300">
                  <Image
                    src={skill.icon}
                    alt={skill.name}
                    fill
                    className="object-contain p-1.5 filter dark:brightness-90 group-hover:brightness-110 transition-all"
                    unoptimized
                  />
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors text-center leading-tight">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
