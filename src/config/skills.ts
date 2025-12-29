export interface Skill {
  name: string;
  icon?: string;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    skills: [
      { name: "React" },
      { name: "Next.js" },
      { name: "TypeScript" },
      { name: "JavaScript" },
      { name: "HTML5" },
      { name: "CSS3" },
      { name: "Tailwind CSS" },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Python" },
      { name: "Node.js" },
      { name: "Express" },
      { name: "REST API" },
    ],
  },
  {
    title: "Database",
    skills: [
      { name: "MySQL" },
      { name: "MongoDB" },
      { name: "PostgreSQL" },
    ],
  },
  {
    title: "Tools & Others",
    skills: [
      { name: "Git" },
      { name: "GitHub" },
      { name: "VS Code" },
      { name: "Figma" },
      { name: "Vercel" },
    ],
  },
];
