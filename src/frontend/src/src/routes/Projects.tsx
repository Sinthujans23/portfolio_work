import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ProjectCard from '../components/ProjectCard';
import { Project } from '../utils/types';
import apiClient from '../utils/apiClient';
import LoadingSpinner from '../components/LoadingSpinner';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<Project[]>('/api/projects')
      .then((res) => setProjects(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Projects – My Portfolio</title>
        <meta name="description" content="Portfolio projects" />
      </Helmet>
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Projects</h1>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Projects;
