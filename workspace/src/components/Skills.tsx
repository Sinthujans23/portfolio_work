import { useEffect, useState } from 'react';
import { getContent, Skill } from '@/lib/content';

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const { skills } = getContent();
    setSkills(skills);
  }, []);

  if (skills.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto py-12 px-4 md:px-8" id="skills">
      <h2 className="text-3xl font-semibold text-center mb-8">Skills</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {skills.map((skill) => (
          <div key={skill.name} className="flex flex-col items-center">
            {skill.icon && (
              <img src={skill.icon} alt={`${skill.name} icon`} className="w-12 h-12 mb-2" />
            )}
            <span className="font-medium text-gray-800 mb-1">{skill.name}</span>
            {typeof skill.level === 'number' && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
