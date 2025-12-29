export interface Skill {
  name: string;
  icon: string;
}

// Using devicon CDN for SVG icons
const DEVICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

export const skills: Skill[] = [
  // Frontend
  { name: "React", icon: `${DEVICON_BASE}/react/react-original.svg` },
  { name: "Next.js", icon: `${DEVICON_BASE}/nextjs/nextjs-original.svg` },
  { name: "TypeScript", icon: `${DEVICON_BASE}/typescript/typescript-original.svg` },
  { name: "JavaScript", icon: `${DEVICON_BASE}/javascript/javascript-original.svg` },
  { name: "HTML5", icon: `${DEVICON_BASE}/html5/html5-original.svg` },
  { name: "CSS3", icon: `${DEVICON_BASE}/css3/css3-original.svg` },
  { name: "Tailwind CSS", icon: `${DEVICON_BASE}/tailwindcss/tailwindcss-original.svg` },
  { name: "Flutter", icon: `${DEVICON_BASE}/flutter/flutter-original.svg` },

  // Backend
  { name: "Python", icon: `${DEVICON_BASE}/python/python-original.svg` },
  { name: "Node.js", icon: `${DEVICON_BASE}/nodejs/nodejs-original.svg` },
  { name: "FastAPI", icon: `${DEVICON_BASE}/fastapi/fastapi-original.svg` },
  { name: "Flask", icon: `${DEVICON_BASE}/flask/flask-original.svg` },

  // Database
  { name: "PostgreSQL", icon: `${DEVICON_BASE}/postgresql/postgresql-original.svg` },
  { name: "MongoDB", icon: `${DEVICON_BASE}/mongodb/mongodb-original.svg` },
  { name: "MySQL", icon: `${DEVICON_BASE}/mysql/mysql-original.svg` },
  { name: "Redis", icon: `${DEVICON_BASE}/redis/redis-original.svg` },

  // DevOps & Tools
  { name: "AWS", icon: `${DEVICON_BASE}/amazonwebservices/amazonwebservices-original-wordmark.svg` },
  { name: "Docker", icon: `${DEVICON_BASE}/docker/docker-original.svg` },
  { name: "Git", icon: `${DEVICON_BASE}/git/git-original.svg` },
  { name: "GitHub", icon: `${DEVICON_BASE}/github/github-original.svg` },
  { name: "Figma", icon: `${DEVICON_BASE}/figma/figma-original.svg` },
  { name: "VS Code", icon: `${DEVICON_BASE}/vscode/vscode-original.svg` },
];
