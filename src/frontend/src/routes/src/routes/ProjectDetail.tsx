import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import apiClient from '../utils/apiClient';
import { Project } from '../utils/types';
import LoadingSpinner from '../components/LoadingSpinner';

const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    apiClient
      .get<Project>(`/api/projects/${slug}`)
      .then((res) => setProject(res.data))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner />;
  if (!project) return <div>Project not found.</div>;

  return (
    <>
      <Helmet>
        <title>{project.title} – My Portfolio</title>
        <meta name="description" content={project.shortDescription} />
      </Helmet>
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
        {project.images && (
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {project.images.map((src, idx) => (
              <img key={idx} src={src} alt={`${project.title} screenshot ${idx + 1}`} className="w-full h-auto rounded" />
            ))}
          </div>
        )}
        <p className="mb-4">{project.description}</p>
        <div className="flex space-x-4">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              GitHub
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              Live Demo
            </a>
          )}
        </div>
      </section>
    </>
  );
};

export default ProjectDetail;
