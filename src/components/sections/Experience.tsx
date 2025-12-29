"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, FileDown, GraduationCap, Briefcase } from "lucide-react";
import { fadeInUp, staggerContainer, slideInFromLeft, slideInFromRight } from "@/lib/animations";
import { siteConfig } from "@/config/site";

const experiences = [
  {
    company: "Growth.Pro",
    role: "Full-Stack Developer | Zicy",
    period: "Oct 2025 – Present",
    location: "Kuala Lumpur, MY (Remote)",
    highlights: [
      "Contributed to SaaS platform deployment on AWS EC2, implementing CI/CD pipelines via GitHub Actions",
      "Developed core features for Chrome extension serving 150+ users: SEO schema generator, AI crawlability checker",
      "Built Admin Panel with real-time analytics dashboard connecting dual-server architecture",
      "Implemented Stripe subscription system with webhook handling, JWT authentication for 15+ enterprise clients",
    ],
  },
  {
    company: "Growth.Pro",
    role: "Junior Data Engineer",
    period: "Nov 2024 – Oct 2025",
    location: "Kuala Lumpur, MY (Remote)",
    highlights: [
      "Developed XGBoost ML model achieving 89% R² accuracy for property price prediction using 15,000+ records",
      "Delivered production-ready Flask REST API with PyTest coverage and automated data pipelines",
      "Reduced manual processing time by 60% through automation",
    ],
  },
  {
    company: "Fuji Elevator Cambodia",
    role: "Freelance Full-Stack Developer",
    period: "Oct 2023 – May 2024",
    location: "Phnom Penh, KH (Remote)",
    highlights: [
      "Architected enterprise ERP dashboard (32+ pages) for elevator sales, installation, and maintenance",
      "Built React 18/TypeScript frontend with RBAC supporting 8 user roles and 80+ permissions",
      "Developed FastAPI backend with 100+ RESTful endpoints, JWT auth, and WebSocket notifications",
      "Built document generation engine using ReportLab (PDF) and OpenPyXL (Excel)",
    ],
  },
];

const education = {
  institution: "University of Nottingham Malaysia",
  degree: "Bachelor of Science in Computer Science",
  period: "Aug 2022 – Feb 2026",
  location: "Semenyih, MY",
};

export function Experience() {
  return (
    <section id="experience" className="py-20 sm:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              My <span className="gradient-text">Experience</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Building enterprise applications, SaaS platforms, and AI-powered tools
            </p>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full mt-4" />
          </motion.div>

          {/* Split Timeline */}
          <div className="relative max-w-6xl mx-auto">
            {/* Center Timeline Line - Hidden on mobile */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent -translate-x-1/2" />

            {/* Experience Items */}
            <div className="space-y-12 lg:space-y-0">
              {experiences.map((exp, index) => {
                const isLeft = index % 2 === 0;

                return (
                  <div key={`${exp.company}-${exp.role}`} className="relative lg:mb-16">
                    {/* Timeline Dot - Center */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-8 z-20"
                    >
                      <div className="w-5 h-5 rounded-full bg-primary pulse-glow flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                      </div>
                    </motion.div>

                    {/* Connecting Line - Hidden on mobile */}
                    <div
                      className={`hidden lg:block absolute top-10 h-0.5 bg-primary/30 w-8 ${
                        isLeft ? 'right-1/2 mr-2.5' : 'left-1/2 ml-2.5'
                      }`}
                    />

                    {/* Card Container */}
                    <div className={`lg:w-[calc(50%-2rem)] ${isLeft ? 'lg:mr-auto lg:pr-8' : 'lg:ml-auto lg:pl-8'}`}>
                      <motion.div
                        variants={isLeft ? slideInFromLeft : slideInFromRight}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="group"
                      >
                        {/* Mobile Timeline Dot */}
                        <div className="lg:hidden flex items-center gap-4 mb-4">
                          <div className="w-4 h-4 rounded-full bg-primary pulse-glow flex-shrink-0" />
                          <div className="h-0.5 flex-grow bg-gradient-to-r from-primary/50 to-transparent" />
                        </div>

                        <div className="relative p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                          {/* Decorative corner */}
                          <div className={`absolute top-0 ${isLeft ? 'right-0 rounded-tr-2xl' : 'left-0 rounded-tl-2xl'} w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent`} />

                          {/* Header */}
                          <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Briefcase className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold leading-tight">{exp.role}</h3>
                                <p className="text-primary font-medium">{exp.company}</p>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:text-right">
                              <div className="flex items-center gap-1 sm:justify-end">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{exp.period}</span>
                              </div>
                              <div className="flex items-center gap-1 sm:justify-end">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{exp.location}</span>
                              </div>
                            </div>
                          </div>

                          {/* Highlights */}
                          <ul className="space-y-2 relative">
                            {exp.highlights.map((highlight, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Education Section */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-20 max-w-2xl mx-auto"
          >
            <h3 className="text-2xl font-bold mb-8 text-center">
              <span className="gradient-text">Education</span>
            </h3>

            <div className="relative p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 group">
              {/* Decorative gradient */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors w-fit">
                  <GraduationCap className="h-8 w-8" />
                </div>

                <div className="flex-grow">
                  <h4 className="text-lg font-semibold">{education.degree}</h4>
                  <p className="text-primary font-medium">{education.institution}</p>
                </div>

                <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:text-right">
                  <div className="flex items-center gap-1 sm:justify-end">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{education.period}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:justify-end">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{education.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Download CV Button */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <a
              href={siteConfig.links.cv}
              download
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-105 glow"
            >
              <FileDown className="h-5 w-5" />
              Download Full CV
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
