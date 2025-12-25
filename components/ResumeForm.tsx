
import React from 'react';
import { ResumeData, Experience, Education, Project, Skills } from '../types';
import { polishResumeContent } from '../services/geminiService';

interface ResumeFormProps {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
  targetTone: string;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ data, setData, targetTone }) => {
  const [isPolishing, setIsPolishing] = React.useState<string | null>(null);

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const handlePolish = async (field: string, value: string, path: string[]) => {
    if (!value) return;
    setIsPolishing(field);
    try {
      const polished = await polishResumeContent(data, targetTone, field, value);
      
      setData(prev => {
        const newData = JSON.parse(JSON.stringify(prev));
        if (path.length === 1) {
          newData[path[0]] = polished;
        } else if (path.length === 2) {
          newData[path[0]][path[1]] = polished;
        } else if (path.length === 3) {
          newData[path[0]][parseInt(path[1])][path[2]] = polished;
        }
        return newData;
      });
    } finally {
      setIsPolishing(null);
    }
  };

  const addArrayItem = (key: 'experiences' | 'education' | 'projects', defaultItem: any) => {
    setData(prev => ({
      ...prev,
      [key]: [...prev[key], { ...defaultItem, id: Date.now().toString() }]
    }));
  };

  const updateArrayItem = (key: 'experiences' | 'education' | 'projects', id: string, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      [key]: (prev[key] as any[]).map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const updateSkills = (category: keyof Skills, value: string) => {
    setData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: value.split(',').map(s => s.trim()).filter(s => s !== '')
      }
    }));
  };

  return (
    <div className="space-y-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-y-auto max-h-[85vh]">
      {/* Personal Info */}
      <section>
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" value={data.personalInfo.fullName} onChange={v => updatePersonalInfo('fullName', v)} />
          <Input label="Email" value={data.personalInfo.email} onChange={v => updatePersonalInfo('email', v)} />
          <Input label="Phone" value={data.personalInfo.phone} onChange={v => updatePersonalInfo('phone', v)} />
          <Input label="Location" value={data.personalInfo.location} onChange={v => updatePersonalInfo('location', v)} />
          <Input label="LinkedIn" value={data.personalInfo.linkedin} onChange={v => updatePersonalInfo('linkedin', v)} />
          <Input label="Website" value={data.personalInfo.website} onChange={v => updatePersonalInfo('website', v)} />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1 flex justify-between">
              Professional Summary
              <button 
                onClick={() => handlePolish('Summary', data.personalInfo.summary, ['personalInfo', 'summary'])}
                className="text-blue-600 text-xs hover:underline disabled:opacity-50"
                disabled={isPolishing !== null}
              >
                {isPolishing === 'Summary' ? 'Polishing...' : '✨ AI Polish'}
              </button>
            </label>
            <textarea
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              value={data.personalInfo.summary}
              onChange={e => updatePersonalInfo('summary', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Experience */}
      <section>
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-lg font-semibold text-slate-800">Experience</h3>
          <button onClick={() => addArrayItem('experiences', { company: '', role: '', location: '', duration: '', description: '' })} className="text-blue-600 text-sm font-medium hover:text-blue-700">+ Add</button>
        </div>
        {data.experiences.map((exp, idx) => (
          <div key={exp.id} className="p-4 mb-4 border border-slate-100 rounded-lg bg-slate-50/50 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Company" value={exp.company} onChange={v => updateArrayItem('experiences', exp.id, 'company', v)} />
              <Input label="Role" value={exp.role} onChange={v => updateArrayItem('experiences', exp.id, 'role', v)} />
              <Input label="Duration" value={exp.duration} onChange={v => updateArrayItem('experiences', exp.id, 'duration', v)} />
              <Input label="Location" value={exp.location} onChange={v => updateArrayItem('experiences', exp.id, 'location', v)} />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1 flex justify-between">
                Description & Achievements
                <button 
                  onClick={() => handlePolish(`Experience ${idx}`, exp.description, ['experiences', idx.toString(), 'description'])}
                  className="text-blue-600 text-xs hover:underline disabled:opacity-50"
                  disabled={isPolishing !== null}
                >
                  {isPolishing === `Experience ${idx}` ? 'Polishing...' : '✨ AI Polish'}
                </button>
              </label>
              <textarea
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                value={exp.description}
                onChange={e => updateArrayItem('experiences', exp.id, 'description', e.target.value)}
                placeholder="Key accomplishments..."
              />
            </div>
          </div>
        ))}
      </section>

      {/* Projects */}
      <section>
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-lg font-semibold text-slate-800">Projects</h3>
          <button onClick={() => addArrayItem('projects', { name: '', description: '', link: '' })} className="text-blue-600 text-sm font-medium hover:text-blue-700">+ Add</button>
        </div>
        {data.projects.map((proj, idx) => (
          <div key={proj.id} className="p-4 mb-4 border border-slate-100 rounded-lg bg-slate-50/50 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Project Name" value={proj.name} onChange={v => updateArrayItem('projects', proj.id, 'name', v)} />
              <Input label="GitHub/Live Link" value={proj.link} onChange={v => updateArrayItem('projects', proj.id, 'link', v)} />
            </div>
            <textarea
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 min-h-[60px]"
              value={proj.description}
              onChange={e => updateArrayItem('projects', proj.id, 'description', e.target.value)}
              placeholder="Describe what you built and technologies used..."
            />
          </div>
        ))}
      </section>

      {/* Education */}
      <section>
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-lg font-semibold text-slate-800">Education</h3>
          <button onClick={() => addArrayItem('education', { school: '', degree: '', year: '' })} className="text-blue-600 text-sm font-medium hover:text-blue-700">+ Add</button>
        </div>
        {data.education.map(edu => (
          <div key={edu.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 mb-2 border border-slate-100 rounded-lg bg-slate-50/50">
            <Input label="School" value={edu.school} onChange={v => updateArrayItem('education', edu.id, 'school', v)} />
            <Input label="Degree" value={edu.degree} onChange={v => updateArrayItem('education', edu.id, 'degree', v)} />
            <Input label="Year/Period" value={edu.year} onChange={v => updateArrayItem('education', edu.id, 'year', v)} />
          </div>
        ))}
      </section>

      {/* Skills */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 mb-2 border-b pb-2">Skills (Categorized)</h3>
        <Input label="Technical (Core Languages)" value={data.skills.technical.join(', ')} onChange={v => updateSkills('technical', v)} />
        <Input label="Frameworks & Libraries" value={data.skills.frameworks.join(', ')} onChange={v => updateSkills('frameworks', v)} />
        <Input label="Tools & Platforms" value={data.skills.tools.join(', ')} onChange={v => updateSkills('tools', v)} />
        <Input label="Soft Skills" value={data.skills.softSkills.join(', ')} onChange={v => updateSkills('softSkills', v)} />
      </section>

      {/* Achievements */}
      <section>
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Achievements</h3>
        <textarea
          className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          value={data.achievements.join('\n')}
          onChange={e => setData(prev => ({ ...prev, achievements: e.target.value.split('\n').filter(a => a.trim() !== '') }))}
          placeholder="Enter each achievement on a new line..."
        />
      </section>
    </div>
  );
};

const Input: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <input
      type="text"
      className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

export default ResumeForm;
