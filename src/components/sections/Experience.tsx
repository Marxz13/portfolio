"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function Experience() {
  return (
    <section id="experience" className="py-20 sm:py-32 bg-card/50">
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
              My <span className="gradient-text">Experience</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              My professional journey and experiences
            </p>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full mt-4" />
          </motion.div>

          {/* Placeholder Content */}
          <motion.div
            variants={fadeInUp}
            className="text-center p-12 rounded-xl bg-card border border-border border-dashed"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
              <Briefcase className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Experience Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              This section will be updated with my professional experience and
              educational background. Stay tuned!
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Content to be added</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
