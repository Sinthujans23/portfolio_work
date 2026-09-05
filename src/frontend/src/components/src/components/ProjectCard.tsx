import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../utils/types';

interface Props {
  project: Project;
}

const ProjectCard: React.FC<Props> = ({ project }) => (
  <div className="border rounded shadow hover:shadow-lg transition">
    <Link to={`/projects/${project.slug}`} className="block p-4">
      {project.thumbnail && (
        <img src={project.thumbnail} alt={project.title} className="w-full h-48 object-cover mb-2" />
      )}
      <h3 className="text-xl font-semibold mb-1">{project.title}</h3>
      <p className="text-gray-600 mb-2 line-clamp-2">{project.shortDescription}</p>
      <div className="flex flex-wrap gap-1">
        {project.tags?.map((tag) => (
          <span key={tag} className="bg-gray-200 text-sm px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  </div>
);

export default ProjectCard;
