import contentData from '../../public/content.json';

/**
 * Types representing the shape of the JSON configuration file.
 */
export interface HeroContent {
  name: string;
  tagline: string;
  image: string; // URL or path to hero image
}

export interface AboutContent {
  title: string;
  biography: string;
  education: string;
  image?: string;
}

export interface Skill {
  name: string;
  icon?: string; // optional icon path
  level?: number; // 0-100 for progress bar
}

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  technologies: string[];
  demoUrl?: string;
  repoUrl?: string;
}

export interface SiteContent {
  hero: HeroContent;
  about: AboutContent;
  skills: Skill[];
  projects: Project[];
  // Additional sections can be added here
}

/**
 * Returns the typed content from the static JSON configuration.
 * This function is executed at runtime on the client; during build it can be inlined.
 */
export function getContent(): SiteContent {
  // The imported JSON is already typed as any; we cast it to SiteContent.
  return contentData as SiteContent;
}
