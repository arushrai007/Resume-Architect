
import { ResumeData, StyleAnalysis } from './types';

export const INITIAL_RESUME_DATA: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    website: '',
    location: '',
    summary: ''
  },
  experiences: [
    {
      id: '1',
      company: '',
      role: '',
      location: '',
      duration: '',
      description: ''
    }
  ],
  education: [
    {
      id: '1',
      school: '',
      degree: '',
      year: ''
    }
  ],
  skills: {
    technical: [],
    frameworks: [],
    tools: [],
    softSkills: []
  },
  projects: [
    {
      id: '1',
      name: '',
      description: '',
      link: ''
    }
  ],
  achievements: []
};

export const DEFAULT_STYLE: StyleAnalysis = {
  layout: 'modern',
  primaryColor: '#0f172a',
  accentColor: '#3b82f6',
  fontStyle: 'sans-serif',
  tone: 'Professional and concise',
  sectionsOrder: ['summary', 'experience', 'projects', 'education', 'skills', 'achievements']
};

export const PREDEFINED_TEMPLATES: Record<string, StyleAnalysis> = {
  Modern: {
    layout: 'sidebar',
    primaryColor: '#1e293b',
    accentColor: '#2563eb',
    fontStyle: 'sans-serif',
    tone: 'Corporate and Impactful',
    sectionsOrder: ['summary', 'experience', 'projects', 'education', 'skills', 'achievements']
  },
  Classic: {
    layout: 'classic',
    primaryColor: '#000000',
    accentColor: '#475569',
    fontStyle: 'serif',
    tone: 'Traditional and Formal',
    sectionsOrder: ['summary', 'experience', 'education', 'projects', 'skills', 'achievements']
  },
  Creative: {
    layout: 'creative',
    primaryColor: '#4c1d95',
    accentColor: '#db2777',
    fontStyle: 'sans-serif',
    tone: 'Creative and Bold',
    sectionsOrder: ['summary', 'projects', 'experience', 'skills', 'education', 'achievements']
  }
};
