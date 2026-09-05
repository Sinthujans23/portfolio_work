import Image from 'next/image';
import { getContent } from '@/lib/content';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [hero, setHero] = useState<{ name: string; tagline: string; image: string } | null>(null);

  useEffect(() => {
    const content = getContent();
    setHero(content.hero);
  }, []);

  if (!hero) return null;

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8 text-center">
      <h1 className="text-5xl font-bold mb-4">{hero.name}</h1>
      <p className="text-xl text-gray-700 mb-6">{hero.tagline}</p>
      <div className="w-full max-w-3xl">
        <Image
          src={hero.image}
          alt="Hero image"
          width={1200}
          height={600}
          className="rounded-lg object-cover w-full h-auto"
          priority
        />
      </div>
    </section>
  );
}
