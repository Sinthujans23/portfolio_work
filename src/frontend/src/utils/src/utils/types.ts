export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description?: string;
  thumbnail?: string;
  tags?: string[];
  images?: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface About {
  bio: string;
  skills: string[];
  resumeUrl: string;
}
