import { useEffect, useState } from 'react';
import { getContent, Project } from '@/lib/content';
import ProjectCard from '@/components/ProjectCard';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const { projects } = getContent();
    setProjects(projects);
  }, []);

  if (projects.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto py-12 px-4 md:px-8" id="projects">
      <h2 className="text-3xl font-semibold text-center mb-8">Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
