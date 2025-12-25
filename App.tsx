
import React, { useState, useCallback } from 'react';
import { ResumeData, StyleAnalysis, AppStep } from './types';
import { INITIAL_RESUME_DATA, DEFAULT_STYLE, PREDEFINED_TEMPLATES } from './constants';
import { analyzeResumeSample } from './services/geminiService';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.UPLOAD_SAMPLE);
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [style, setStyle] = useState<StyleAnalysis>(DEFAULT_STYLE);
  const [isProcessing, setIsProcessing] = useState(false);
  const [samplePreview, setSamplePreview] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setSamplePreview(base64);
      
      try {
        const analysis = await analyzeResumeSample(base64);
        setStyle(analysis);
        setStep(AppStep.EDIT_CONTENT);
      } catch (err) {
        alert("Error analyzing sample. Using default style.");
        setStep(AppStep.EDIT_CONTENT);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectTemplate = (templateName: string) => {
    setStyle(PREDEFINED_TEMPLATES[templateName]);
    setStep(AppStep.EDIT_CONTENT);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center no-print">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">R</div>
          <h1 className="text-xl font-bold text-slate-800">Resume Architect <span className="text-blue-600">AI</span></h1>
        </div>
        
        <div className="flex items-center gap-4">
          {step === AppStep.EDIT_CONTENT && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setStep(AppStep.UPLOAD_SAMPLE)}
                className="text-slate-500 text-sm hover:text-slate-800 px-3 py-2"
              >
                Change Style
              </button>
              <button 
                onClick={() => window.print()}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors"
              >
                Export PDF
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {step === AppStep.UPLOAD_SAMPLE ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 overflow-y-auto">
            <div className="max-w-4xl w-full text-center space-y-12 py-12">
              <div className="space-y-4">
                <h2 className="text-4xl font-extrabold text-slate-900">How would you like to start?</h2>
                <p className="text-slate-500 text-lg max-w-xl mx-auto">Upload a design you admire or pick from our expertly crafted templates to begin your professional journey.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                {/* Upload Option */}
                <div className="flex flex-col h-full">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Upload a Design</h3>
                  <div className="flex-1 relative border-2 border-dashed border-slate-300 rounded-2xl p-10 hover:border-blue-400 transition-all bg-white group flex flex-col items-center justify-center gap-4">
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isProcessing}
                    />
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-700">Scan Sample Image</p>
                      <p className="text-sm text-slate-400">AI will clone layout & colors</p>
                    </div>
                  </div>
                </div>

                {/* Templates Option */}
                <div className="flex flex-col h-full">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Choose a Template</h3>
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    {Object.keys(PREDEFINED_TEMPLATES).map((name) => {
                      const t = PREDEFINED_TEMPLATES[name];
                      return (
                        <button
                          key={name}
                          onClick={() => handleSelectTemplate(name)}
                          className="flex flex-col items-center p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group"
                        >
                          <div className="w-full aspect-[3/4] rounded-lg bg-slate-100 mb-3 flex flex-col p-2 gap-1 overflow-hidden border border-slate-50">
                            <div className="h-2 w-2/3 bg-slate-300 rounded"></div>
                            <div className="h-1 w-full bg-slate-200 rounded"></div>
                            <div className="h-1 w-full bg-slate-200 rounded"></div>
                            <div className="mt-2 h-1 w-1/2 bg-slate-300 rounded"></div>
                            <div className="flex gap-1">
                               <div className="w-1/3 h-10 bg-slate-200 rounded"></div>
                               <div className="w-2/3 h-10 bg-slate-200 rounded"></div>
                            </div>
                            <div className="mt-auto flex justify-center gap-1">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.primaryColor }}></div>
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.accentColor }}></div>
                            </div>
                          </div>
                          <span className="font-bold text-slate-700">{name}</span>
                          <span className="text-[10px] text-slate-400 uppercase">{t.layout}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {isProcessing && (
                <div className="flex items-center justify-center gap-3 text-blue-600 font-bold animate-pulse text-lg">
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AI is reverse-engineering the design...
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
            {/* Sidebar / Editor */}
            <div className="w-full md:w-[450px] lg:w-[550px] border-r border-slate-200 bg-slate-50 overflow-y-auto no-print">
              <div className="p-6">
                 <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Edit Details</h2>
                    <div className="text-[10px] px-2 py-1 bg-green-100 text-green-700 rounded font-bold uppercase tracking-wider">
                      Live Preview Active
                    </div>
                 </div>
                 <ResumeForm data={resumeData} setData={setResumeData} targetTone={style.tone} />
                 
                 <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                       <span className="text-lg">🎨</span> Style Sync
                    </h4>
                    <p className="text-xs text-blue-600 mb-3">
                       Your resume is matching the tone: <strong>"{style.tone}"</strong>
                    </p>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full border border-white" style={{ backgroundColor: style.primaryColor }}></div>
                      <div className="w-6 h-6 rounded-full border border-white" style={{ backgroundColor: style.accentColor }}></div>
                      <span className="text-[10px] text-blue-400 self-center uppercase font-bold tracking-widest">{style.layout} layout</span>
                    </div>
                 </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="flex-1 bg-slate-200 p-4 md:p-8 overflow-y-auto flex justify-center">
              <div className="w-full max-w-[210mm] min-h-[297mm] shadow-2xl">
                <ResumePreview data={resumeData} style={style} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden no-print">
         <button className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-xl">
           📄
         </button>
      </div>
    </div>
  );
};

export default App;
