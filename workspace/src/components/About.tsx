import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getContent, AboutContent } from '@/lib/content';

export default function About() {
  const [about, setAbout] = useState<AboutContent | null>(null);

  useEffect(() => {
    const { about } = getContent();
    setAbout(about);
  }, []);

  if (!about) return null;

  return (
    <section className="max-w-4xl mx-auto py-12 px-4 md:px-8" id="about">
      <h2 className="text-3xl font-semibold text-center mb-6">About Me</h2>
      <div className="flex flex-col md:flex-row items-center gap-8">
        {about.image && (
          <Image
            src={about.image}
            alt="About image"
            width={300}
            height={300}
            className="rounded-full object-cover"
          />
        )}
        <div>
          <p className="mb-4 text-gray-700 whitespace-pre-line">{about.biography}</p>
          <p className="text-gray-600 font-medium">{about.education}</p>
        </div>
      </div>
    </section>
  );
}
