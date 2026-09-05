import Image from 'next/image';
import { useState } from 'react';
import { Project } from '@/lib/content';

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
      <button onClick={openModal} className="w-full text-left">
        <Image
          src={project.thumbnail}
          alt={project.title}
          width={400}
          height={250}
          className="object-cover w-full h-48"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/placeholder.png';
            target.alt = 'Image not available';
          }}
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-2">{project.description}</p>
          <div className="flex flex-wrap gap-1">
            {project.technologies.map((tech) => (
              <span key={tech} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-lg max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-500" onClick={closeModal} aria-label="Close modal">
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
            <Image
              src={project.thumbnail}
              alt={project.title}
              width={800}
              height={400}
              className="object-cover w-full h-48 mb-4"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder.png';
                target.alt = 'Image not available';
              }}
            />
            <p className="mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech) => (
                <span key={tech} className="bg-indigo-200 text-indigo-900 text-sm px-2 py-1 rounded">
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex space-x-4">
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  Live Demo
                </a>
              )}
              {project.repoUrl && (
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  Source Code
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
