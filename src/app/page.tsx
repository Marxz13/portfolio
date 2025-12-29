import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { getTransformedProjects } from "@/lib/github";

export default async function Home() {
  const projects = await getTransformedProjects();

  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects projects={projects} />
      <Experience />
      <Contact />
    </>
  );
}
