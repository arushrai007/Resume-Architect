
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, StyleAnalysis } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeResumeSample = async (base64Image: string): Promise<StyleAnalysis> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/png',
            data: base64Image.split(',')[1],
          },
        },
        {
          text: `Analyze this resume image and extract its visual style and structure.
          Return a JSON object matching this schema:
          {
            "layout": "one of: 'modern', 'classic', 'sidebar', 'creative'",
            "primaryColor": "hex code",
            "accentColor": "hex code",
            "fontStyle": "one of: 'serif', 'sans-serif'",
            "tone": "short description of professional tone",
            "sectionsOrder": ["summary", "experience", "education", "skills", "projects", "achievements"] (reorder based on visual priority)
          }`
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
    }
  });

  try {
    return JSON.parse(response.text || '{}') as StyleAnalysis;
  } catch (e) {
    console.error("Failed to parse AI response", e);
    throw new Error("Could not analyze resume style.");
  }
};

export const polishResumeContent = async (
  currentData: ResumeData, 
  targetTone: string,
  fieldToPolish: string,
  currentValue: string
): Promise<string> => {
  const ai = getAI();
  const prompt = `Act as a professional resume writer. Rewrite the following text to better match the target tone: "${targetTone}". 
  The text is for the field "${fieldToPolish}" in a resume. Keep it concise and impact-driven.
  
  Text to polish: "${currentValue}"
  
  Return only the polished text, no commentary.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text?.trim() || currentValue;
};

export const parseExistingResume = async (base64Image: string): Promise<Partial<ResumeData>> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: base64Image.split(',')[1],
            },
          },
          {
            text: `Extract the textual content from this resume image and organize it into the following JSON structure. 
            Handle multiple entries for experience, education, and projects.
            Categorize skills into technical, frameworks, tools, and softSkills.
            
            JSON Structure:
            {
                "personalInfo": { "fullName": "", "email": "", "phone": "", "linkedin": "", "website": "", "location": "", "summary": "" },
                "experiences": [ { "company": "", "role": "", "location": "", "duration": "", "description": "" } ],
                "education": [ { "school": "", "degree": "", "year": "" } ],
                "skills": {
                  "technical": [],
                  "frameworks": [],
                  "tools": [],
                  "softSkills": []
                },
                "projects": [ { "name": "", "description": "", "link": "" } ],
                "achievements": ["achievement1", "achievement2"]
            }`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
      }
    });
  
    try {
      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error("Failed to parse resume text", e);
      return {};
    }
};
