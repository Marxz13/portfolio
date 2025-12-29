"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Star, GitFork } from "lucide-react";
import Image from "next/image";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { TransformedProject } from "@/lib/github";

interface ProjectsProps {
  projects: TransformedProject[];
}

const DEVICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

// Map languages and topics to Devicon icons
const techIconMap: Record<string, string> = {
  typescript: `${DEVICON_BASE}/typescript/typescript-original.svg`,
  javascript: `${DEVICON_BASE}/javascript/javascript-original.svg`,
  python: `${DEVICON_BASE}/python/python-original.svg`,
  react: `${DEVICON_BASE}/react/react-original.svg`,
  nextjs: `${DEVICON_BASE}/nextjs/nextjs-original.svg`,
  "next.js": `${DEVICON_BASE}/nextjs/nextjs-original.svg`,
  nodejs: `${DEVICON_BASE}/nodejs/nodejs-original.svg`,
  "node.js": `${DEVICON_BASE}/nodejs/nodejs-original.svg`,
  mongodb: `${DEVICON_BASE}/mongodb/mongodb-original.svg`,
  postgresql: `${DEVICON_BASE}/postgresql/postgresql-original.svg`,
  tailwindcss: `${DEVICON_BASE}/tailwindcss/tailwindcss-original.svg`,
  tailwind: `${DEVICON_BASE}/tailwindcss/tailwindcss-original.svg`,
  docker: `${DEVICON_BASE}/docker/docker-original.svg`,
  html: `${DEVICON_BASE}/html5/html5-original.svg`,
  html5: `${DEVICON_BASE}/html5/html5-original.svg`,
  css: `${DEVICON_BASE}/css3/css3-original.svg`,
  css3: `${DEVICON_BASE}/css3/css3-original.svg`,
  vue: `${DEVICON_BASE}/vuejs/vuejs-original.svg`,
  angular: `${DEVICON_BASE}/angularjs/angularjs-original.svg`,
  django: `${DEVICON_BASE}/django/django-plain.svg`,
  flask: `${DEVICON_BASE}/flask/flask-original.svg`,
  mysql: `${DEVICON_BASE}/mysql/mysql-original.svg`,
  redis: `${DEVICON_BASE}/redis/redis-original.svg`,
  git: `${DEVICON_BASE}/git/git-original.svg`,
  github: `${DEVICON_BASE}/github/github-original.svg`,
  aws: `${DEVICON_BASE}/amazonwebservices/amazonwebservices-plain-wordmark.svg`,
  firebase: `${DEVICON_BASE}/firebase/firebase-original.svg`,
  graphql: `${DEVICON_BASE}/graphql/graphql-plain.svg`,
  sass: `${DEVICON_BASE}/sass/sass-original.svg`,
  java: `${DEVICON_BASE}/java/java-original.svg`,
  kotlin: `${DEVICON_BASE}/kotlin/kotlin-original.svg`,
  swift: `${DEVICON_BASE}/swift/swift-original.svg`,
  go: `${DEVICON_BASE}/go/go-original.svg`,
  rust: `${DEVICON_BASE}/rust/rust-original.svg`,
  php: `${DEVICON_BASE}/php/php-original.svg`,
  laravel: `${DEVICON_BASE}/laravel/laravel-original.svg`,
  jupyter: `${DEVICON_BASE}/jupyter/jupyter-original.svg`,
  "jupyter notebook": `${DEVICON_BASE}/jupyter/jupyter-original.svg`,
  pandas: `${DEVICON_BASE}/pandas/pandas-original.svg`,
  numpy: `${DEVICON_BASE}/numpy/numpy-original.svg`,
  "machine-learning": `${DEVICON_BASE}/tensorflow/tensorflow-original.svg`,
  tensorflow: `${DEVICON_BASE}/tensorflow/tensorflow-original.svg`,
  scikit: `${DEVICON_BASE}/scikitlearn/scikitlearn-original.svg`,
};

function getTechIcon(tech: string): string | null {
  const normalizedTech = tech.toLowerCase().replace(/\s+/g, "");
  return techIconMap[normalizedTech] || null;
}

function ProjectImage({ project }: { project: TransformedProject }) {
  return (
    <div className="relative h-full min-h-[280px] md:min-h-[320px] w-full overflow-hidden bg-gradient-to-br from-primary/20 via-accent to-primary/10">
      {project.screenshot ? (
        <Image
          src={project.screenshot}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <Github className="w-8 h-8 text-primary" />
            </div>
            <p className="text-lg font-semibold text-foreground/80">{project.title}</p>
          </div>
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="text-center text-primary-foreground">
          <ExternalLink className="w-8 h-8 mx-auto mb-2" />
          <p className="font-medium">View Project</p>
        </div>
      </div>
    </div>
  );
}

function ProjectContent({ project }: { project: TransformedProject }) {
  // Collect tech stack from language and topics
  const techStack: string[] = [];

  if (project.language && getTechIcon(project.language)) {
    techStack.push(project.language);
  }

  project.topics.forEach((topic) => {
    if (getTechIcon(topic) && !techStack.some(t => t.toLowerCase() === topic.toLowerCase())) {
      techStack.push(topic);
    }
  });

  return (
    <div className="flex flex-col justify-center h-full w-full p-6 md:p-8">
      {/* Featured label */}
      <span className="text-sm text-primary font-mono mb-2 block">
        Featured Project
      </span>

      {/* Title */}
      <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
        {project.title}
      </h3>

      {/* Description */}
      <p className="text-muted-foreground mb-6 leading-relaxed">
        {project.description}
      </p>

      {/* Tech Stack Icons */}
      {techStack.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {techStack.slice(0, 6).map((tech) => {
            const iconUrl = getTechIcon(tech);
            if (!iconUrl) return null;

            return (
              <div
                key={tech}
                className="relative w-8 h-8 rounded-lg bg-accent/50 p-1.5 hover:bg-accent transition-colors group/icon"
                title={tech}
              >
                <Image
                  src={iconUrl}
                  alt={tech}
                  fill
                  className="object-contain p-1"
                  unoptimized
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
        <span className="flex items-center gap-1.5">
          <Star className="h-4 w-4" />
          {project.stars}
        </span>
        <span className="flex items-center gap-1.5">
          <GitFork className="h-4 w-4" />
          {project.forks}
        </span>
        <span className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary">
          {project.language}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          <Github className="h-4 w-4" />
          GitHub
        </a>
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-full font-medium hover:bg-accent transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: TransformedProject; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      variants={fadeInUp}
      className="group relative rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 hover:shadow-[0_0_40px_-12px_hsl(160_84%_39%/0.3)] transition-all duration-300"
    >
      <div className="grid md:grid-cols-2 items-stretch">
        {/* Image Section */}
        <div className={`${isEven ? "md:order-1" : "md:order-2"}`}>
          <a
            href={project.demo || project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full"
          >
            <ProjectImage project={project} />
          </a>
        </div>

        {/* Content Section */}
        <div className={`${isEven ? "md:order-2" : "md:order-1"} flex`}>
          <ProjectContent project={project} />
        </div>
      </div>
    </motion.div>
  );
}

export function Projects({ projects }: ProjectsProps) {
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <section id="projects" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A selection of my recent work and side projects
            </p>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full mt-4" />
          </motion.div>

          {/* Featured Projects */}
          <div className="space-y-8">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          {/* View All Link */}
          <motion.div variants={fadeInUp} className="text-center mt-16">
            <a
              href="https://github.com/Marxz13?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-full hover:bg-accent hover:border-primary/50 transition-all"
            >
              <Github className="h-5 w-5" />
              View All Projects on GitHub
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
