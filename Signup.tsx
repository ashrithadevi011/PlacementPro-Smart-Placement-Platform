import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, GraduationCap } from "lucide-react";

export default function Signup() {
  const [formData, setFormData] = useState({
    rollNo: "",
    name: "",
    password: "",
    branch: "Computer Science",
    cgpa: "",
    skills: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/student/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, cgpa: parseFloat(formData.cgpa) }),
      });
      if (res.ok) {
        navigate("/login");
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-neutral-100 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-violet-600" />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900">Student Registration</h2>
          <p className="text-neutral-500">Create your account to start applying</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-700">Full Name</label>
            <input 
              type="text" required
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-violet-500 outline-none"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-700">Roll Number</label>
            <input 
              type="text" required
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-violet-500 outline-none"
              placeholder="2021CS101"
              value={formData.rollNo}
              onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-700">Branch</label>
            <select 
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-violet-500 outline-none bg-white"
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
            >
              <option>Computer Science</option>
              <option>Information Technology</option>
              <option>Electronics</option>
              <option>Mechanical</option>
              <option>Civil</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-700">Current CGPA</label>
            <input 
              type="number" step="0.01" min="0" max="10" required
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-violet-500 outline-none"
              placeholder="8.5"
              value={formData.cgpa}
              onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-neutral-700">Skills (Comma separated)</label>
            <input 
              type="text" required
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-violet-500 outline-none"
              placeholder="React, Node.js, Python, SQL"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-neutral-700">Password</label>
            <input 
              type="password" required
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-violet-500 outline-none"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {error && <p className="md:col-span-2 text-red-500 text-sm font-medium text-center">{error}</p>}

          <button 
            type="submit"
            className="md:col-span-2 py-4 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" /> Create Account
          </button>
        </form>

        <p className="text-center text-sm text-neutral-500">
          Already have an account? <Link to="/login" className="text-violet-600 font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
