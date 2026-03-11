import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Briefcase, CheckCircle, XCircle, Clock, FileText, ExternalLink, AlertCircle, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import ResumeAnalyzer from "../components/ResumeAnalyzer";

interface Company {
  id: number;
  name: string;
  role: string;
  package: number;
  eligibility_cgpa: number;
  eligibility_branch: string;
  deadline: string;
  description: string;
}

interface Application {
  id: number;
  company_id: number;
  company_name: string;
  company_role: string;
  status: string;
  applied_at: string;
}

interface News {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [compRes, appRes, newsRes] = await Promise.all([
        fetch("/api/companies", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/applications/student", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/news", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const compData = await compRes.json();
      const appData = await appRes.json();
      const newsData = await newsRes.json();
      setCompanies(compData);
      setApplications(appData);
      setNews(newsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (companyId: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ company_id: companyId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: "Applied successfully!", type: "success" });
        fetchData();
      } else {
        setMessage({ text: data.error, type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Failed to apply", type: "error" });
    }
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  if (loading) return <div className="flex items-center justify-center h-64">Loading Dashboard...</div>;

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Student Dashboard</h1>
          <p className="text-neutral-500">Welcome back, {user?.name}. Here's your placement status.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 font-bold uppercase">Applied</p>
              <p className="text-xl font-bold text-neutral-900">{applications.length}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 font-bold uppercase">Offers</p>
              <p className="text-xl font-bold text-neutral-900">
                {applications.filter(a => a.status === 'selected').length}
              </p>
            </div>
          </div>
        </div>
      </header>

      {message.text && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}
        >
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{message.text}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Available Companies */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-violet-600" />
              Active Placement Drives
            </h2>
            <button 
              onClick={() => setShowEligibilityModal(true)}
              className="text-xs font-bold text-violet-600 hover:underline flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              How eligibility works?
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {companies.map((company) => {
              const hasApplied = applications.some(a => a.company_id === company.id);
              // Simple Eligibility Check
              const isEligible = (user as any)?.cgpa >= company.eligibility_cgpa;

              return (
                <motion.div 
                  key={company.id}
                  whileHover={{ y: -4 }}
                  className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm space-y-4 flex flex-col"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900">{company.name}</h3>
                      <p className="text-sm text-neutral-500 font-medium">{company.role}</p>
                    </div>
                    <span className="px-3 py-1 bg-violet-50 text-violet-600 text-xs font-bold rounded-full">
                      {company.package} LPA
                    </span>
                  </div>

                  <div className="space-y-3 flex-grow">
                    <div className="flex items-center gap-2 text-xs text-neutral-600 bg-neutral-50 p-2 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-violet-500" />
                      <span className="font-bold">Deadline:</span> {new Date(company.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Eligibility Criteria</p>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${isEligible ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                          Min CGPA: {company.eligibility_cgpa}
                        </span>
                        <span className="px-2 py-1 bg-neutral-50 text-neutral-600 border border-neutral-100 rounded-md text-[10px] font-bold">
                          Branch: {company.eligibility_branch}
                        </span>
                      </div>
                    </div>

                    {!isEligible && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-500">
                        <AlertCircle className="w-3 h-3" />
                        <span>You do not meet the requirements for this role.</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-neutral-50 flex gap-2">
                    <button 
                      onClick={() => handleApply(company.id)}
                      disabled={hasApplied || !isEligible}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                        hasApplied 
                          ? "bg-neutral-100 text-neutral-400 cursor-not-allowed" 
                          : !isEligible 
                            ? "bg-red-50 text-red-400 cursor-not-allowed"
                            : "bg-violet-600 text-white hover:bg-violet-700 shadow-sm"
                      }`}
                    >
                      {hasApplied ? "Applied" : "Apply Now"}
                    </button>
                    <button className="p-2 text-neutral-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all">
                      <FileText className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Application Tracker */}
        <div className="space-y-10">
          <ResumeAnalyzer skills={(user as any)?.skills || "React, Node.js"} />
          
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-600" />
              Latest Updates
            </h2>
            <div className="space-y-4">
              {news.length === 0 ? (
                <p className="text-sm text-neutral-400 italic">No updates yet.</p>
              ) : (
                news.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm space-y-1">
                    <p className="text-[10px] font-bold text-violet-600 uppercase">{new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                    <h3 className="font-bold text-sm text-neutral-900">{item.title}</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">{item.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-violet-600" />
              Application Tracker
            </h2>
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
              {applications.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <p className="text-neutral-400 font-medium">No applications yet</p>
                  <p className="text-xs text-neutral-300 uppercase font-bold tracking-widest">Start applying today</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-50">
                  {applications.map((app) => (
                    <div key={app.id} className="p-4 hover:bg-neutral-50 transition-colors space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-neutral-900">{app.company_name}</p>
                          <p className="text-xs text-neutral-500">{app.company_role}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          app.status === 'selected' ? 'bg-emerald-100 text-emerald-700' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          app.status === 'shortlisted' ? 'bg-blue-100 text-blue-700' :
                          'bg-neutral-100 text-neutral-600'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400">
                        Applied on {new Date(app.applied_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Eligibility Modal */}
      {showEligibilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-bold text-neutral-900">How eligibility works?</h3>
              <button onClick={() => setShowEligibilityModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>Our system automatically matches your profile with company requirements:</p>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <div className="w-5 h-5 bg-violet-50 rounded flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-violet-600">1</span>
                  </div>
                  <p className="text-sm"><span className="font-bold text-neutral-900">CGPA Check:</span> Your current CGPA must be greater than or equal to the company's requirement.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-5 h-5 bg-violet-50 rounded flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-violet-600">2</span>
                  </div>
                  <p className="text-sm"><span className="font-bold text-neutral-900">Branch Check:</span> Your branch must match the company's eligible branches (or 'All').</p>
                </li>
              </ul>
              <p className="text-sm italic bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                The system automatically disables the 'Apply' button if you don't meet these criteria.
              </p>
            </div>
            <button 
              onClick={() => setShowEligibilityModal(false)}
              className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-all"
            >
              Got it, thanks!
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
