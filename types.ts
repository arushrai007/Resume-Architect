
export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  duration: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
}

export interface Skills {
  technical: string[];
  frameworks: string[];
  tools: string[];
  softSkills: string[];
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
    website: string;
    location: string;
    summary: string;
  };
  experiences: Experience[];
  education: Education[];
  skills: Skills;
  projects: Project[];
  achievements: string[];
}

export interface StyleAnalysis {
  layout: 'modern' | 'classic' | 'sidebar' | 'creative';
  primaryColor: string;
  accentColor: string;
  fontStyle: 'serif' | 'sans-serif';
  tone: string;
  sectionsOrder: string[];
}

export enum AppStep {
  UPLOAD_SAMPLE = 'UPLOAD_SAMPLE',
  EDIT_CONTENT = 'EDIT_CONTENT',
  PREVIEW = 'PREVIEW'
}
