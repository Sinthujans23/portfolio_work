import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ProjectCard from '../components/ProjectCard';
import { Project } from '../utils/types';
import apiClient from '../utils/apiClient';
import LoadingSpinner from '../components/LoadingSpinner';

const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<Project[]>('/api/projects?limit=3')
      .then((res) => setProjects(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Home – My Portfolio</title>
        <meta name="description" content="Welcome to my portfolio" />
      </Helmet>
      <section className="text-center py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <h1 className="text-5xl font-bold mb-4">Hello, I'm Jane Doe</h1>
        <p className="text-xl">Full‑stack developer & UI/UX enthusiast.</p>
      </section>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Featured Projects</h2>
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

export default Home;
