import React, { useState, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import { Brain, Sparkles, Loader2, Upload, FileCheck } from "lucide-react";

export default function ResumeAnalyzer({ skills }: { skills: string }) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const analyzeResume = async () => {
    if (!fileName) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this student's skills: "${skills}". 
        They just uploaded a resume named "${fileName}".
        Provide a professional assessment (max 150 words) on their job readiness for a Software Engineer role. 
        1. Give a score out of 100.
        2. List 3 key strengths.
        3. List 2 areas for improvement.
        Format as a clean summary.`
      });
      setAnalysis(response.text || "Could not generate analysis.");
    } catch (err) {
      console.error(err);
      setAnalysis("Error analyzing resume. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-violet-600 to-violet-800 p-8 rounded-3xl text-white shadow-xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Brain className="w-32 h-32" />
      </div>
      
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-violet-200" />
          <h2 className="text-xl font-bold">AI Resume Matching</h2>
        </div>
        <p className="text-violet-100 text-sm leading-relaxed">
          Upload your resume to get an instant AI-powered score and feedback tailored to your skills.
        </p>
        
        {analysis ? (
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-sm leading-relaxed whitespace-pre-wrap">
            {analysis}
            <button 
              onClick={() => {
                setAnalysis(null);
                setFileName(null);
              }}
              className="mt-4 text-xs font-bold uppercase tracking-widest text-violet-200 hover:text-white transition-colors"
            >
              Reset Analysis
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" 
              accept=".pdf,.doc,.docx"
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-violet-400 rounded-2xl cursor-pointer bg-violet-500/20 hover:bg-violet-500/30 transition-all"
            >
              {fileName ? (
                <div className="flex flex-col items-center">
                  <FileCheck className="w-8 h-8 mb-2 text-emerald-300" />
                  <span className="text-xs font-bold text-white">{fileName}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 mb-2 text-violet-100" />
                  <span className="text-xs font-bold text-violet-100">Click to upload PDF</span>
                </div>
              )}
            </div>

            <button 
              onClick={analyzeResume}
              disabled={loading || !fileName}
              className={`w-full py-3 bg-white text-violet-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                loading || !fileName ? "opacity-50 cursor-not-allowed" : "hover:bg-violet-50"
              }`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
              {loading ? "Analyzing Resume..." : "Analyze Resume"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
