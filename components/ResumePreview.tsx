
import React from 'react';
import { ResumeData, StyleAnalysis } from '../types';

interface ResumePreviewProps {
  data: ResumeData;
  style: StyleAnalysis;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, style }) => {
  const { personalInfo, experiences, education, skills, projects, achievements } = data;

  const sectionStyles = "mb-6";
  const headingStyles = `text-lg font-bold uppercase tracking-wider border-b-2 mb-3 pb-1`;
  const textStyles = style.fontStyle === 'serif' ? 'font-serif' : 'font-sans';

  const renderSection = (type: string) => {
    switch (type) {
      case 'summary':
        return personalInfo.summary && (
          <div key="summary" className={sectionStyles}>
            <h2 className={headingStyles} style={{ borderColor: style.accentColor, color: style.primaryColor }}>Profile</h2>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{personalInfo.summary}</p>
          </div>
        );
      case 'experience':
        return experiences.length > 0 && experiences[0].company && (
          <div key="experience" className={sectionStyles}>
            <h2 className={headingStyles} style={{ borderColor: style.accentColor, color: style.primaryColor }}>Experience</h2>
            <div className="space-y-4">
              {experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-800">{exp.role}</h3>
                    <span className="text-xs font-medium text-slate-500">{exp.duration}</span>
                  </div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-semibold italic text-slate-600">{exp.company}</span>
                    <span className="text-xs text-slate-400">{exp.location}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-normal whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'projects':
        return projects.length > 0 && projects[0].name && (
          <div key="projects" className={sectionStyles}>
            <h2 className={headingStyles} style={{ borderColor: style.accentColor, color: style.primaryColor }}>Projects</h2>
            <div className="space-y-4">
              {projects.map(proj => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-800">{proj.name}</h3>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                        View Project ↗
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-normal whitespace-pre-wrap mt-1">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'education':
        return education.length > 0 && education[0].school && (
          <div key="education" className={sectionStyles}>
            <h2 className={headingStyles} style={{ borderColor: style.accentColor, color: style.primaryColor }}>Education</h2>
            {education.map(edu => (
              <div key={edu.id} className="flex justify-between mb-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-800">{edu.school}</h3>
                  <p className="text-xs text-slate-600">{edu.degree}</p>
                </div>
                <span className="text-xs text-slate-500">{edu.year}</span>
              </div>
            ))}
          </div>
        );
      case 'skills':
        const categories = [
          { label: 'Technical', items: skills.technical },
          { label: 'Frameworks', items: skills.frameworks },
          { label: 'Tools', items: skills.tools },
          { label: 'Soft Skills', items: skills.softSkills }
        ].filter(c => c.items.length > 0);

        return categories.length > 0 && (
          <div key="skills" className={sectionStyles}>
            <h2 className={headingStyles} style={{ borderColor: style.accentColor, color: style.primaryColor }}>Skills</h2>
            <div className="space-y-2">
              {categories.map(cat => (
                <div key={cat.label} className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 min-w-[70px]">{cat.label}:</span>
                  <div className="flex flex-wrap gap-1">
                    {cat.items.map((skill, i) => (
                      <span key={i} className="text-xs text-slate-700">
                        {skill}{i < cat.items.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'achievements':
        return achievements.length > 0 && (
          <div key="achievements" className={sectionStyles}>
            <h2 className={headingStyles} style={{ borderColor: style.accentColor, color: style.primaryColor }}>Achievements</h2>
            <ul className="list-disc list-inside space-y-1">
              {achievements.map((achievement, i) => (
                <li key={i} className="text-xs text-slate-700 leading-relaxed">
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`w-full h-full bg-white shadow-2xl overflow-y-auto ${textStyles} origin-top transition-transform duration-300`}>
      {/* A4 Proportionate wrapper */}
      <div className="min-h-full p-8 md:p-12">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold uppercase tracking-tighter mb-2" style={{ color: style.primaryColor }}>
            {personalInfo.fullName || "Your Name"}
          </h1>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedin && <span>LinkedIn: {personalInfo.linkedin}</span>}
            {personalInfo.website && <span>{personalInfo.website}</span>}
          </div>
        </header>

        {/* Dynamic Body */}
        <div className={style.layout === 'sidebar' ? 'grid grid-cols-3 gap-8' : 'block'}>
          {style.layout === 'sidebar' ? (
            <>
              <div className="col-span-1 space-y-6">
                 {renderSection('skills')}
                 {renderSection('education')}
                 {renderSection('achievements')}
              </div>
              <div className="col-span-2 space-y-6">
                 {renderSection('summary')}
                 {renderSection('experience')}
                 {renderSection('projects')}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              {style.sectionsOrder.map(section => renderSection(section))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
