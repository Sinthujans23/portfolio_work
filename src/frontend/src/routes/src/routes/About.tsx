import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import apiClient from '../utils/apiClient';
import { About } from '../utils/types';
import LoadingSpinner from '../components/LoadingSpinner';

const About: React.FC = () => {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<About>('/api/about')
      .then((res) => setAbout(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!about) return <div>About information not available.</div>;

  return (
    <>
      <Helmet>
        <title>About Me – My Portfolio</title>
        <meta name="description" content="About me and skills" />
      </Helmet>
      <section className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">About Me</h1>
        <p className="mb-4 whitespace-pre-line">{about.bio}</p>
        <h2 className="text-2xl font-semibold mb-2">Skills</h2>
        <ul className="list-disc list-inside mb-4">
          {about.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
        {about.resumeUrl && (
          <a href={about.resumeUrl} download className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Download Resume
          </a>
        )}
      </section>
    </>
  );
};

export default About;
