"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function Contact() {
  const contactLinks = [
    {
      icon: Mail,
      label: "Email",
      value: "Get in touch via email",
      href: siteConfig.links.email,
    },
    {
      icon: Github,
      label: "GitHub",
      value: "@Marxz13",
      href: siteConfig.links.github,
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "marzallan",
      href: siteConfig.links.linkedin,
    },
  ];

  return (
    <section id="contact" className="py-20 sm:py-32">
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
              Get In <span className="gradient-text">Touch</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              I&apos;m currently open to new opportunities and collaborations.
              Whether you have a question or just want to say hi, feel free to
              reach out!
            </p>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full mt-4" />
          </motion.div>

          {/* Contact Cards */}
          <motion.div
            variants={fadeInUp}
            className="grid sm:grid-cols-3 gap-6 mb-12"
          >
            {contactLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto") ? undefined : "_blank"}
                rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 hover:-translate-y-1 transition-all text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                  <link.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold mb-1">{link.label}</h3>
                <p className="text-sm text-muted-foreground">{link.value}</p>
              </a>
            ))}
          </motion.div>

          {/* Location */}
          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-center gap-2 text-muted-foreground"
          >
            <MapPin className="h-4 w-4" />
            <span>Based in {siteConfig.author.location}</span>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeInUp} className="text-center mt-12">
            <a
              href={siteConfig.links.email}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity glow text-lg"
            >
              <Mail className="h-5 w-5" />
              Say Hello
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
