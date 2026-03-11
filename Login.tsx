import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn, Shield, GraduationCap } from "lucide-react";

export default function Login() {
  const [role, setRole] = useState<"student" | "admin">("student");
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const endpoint = role === "student" ? "/api/auth/student/login" : "/api/auth/admin/login";
    const body = role === "student" ? { rollNo: formData.identifier, password: formData.password } : { username: formData.identifier, password: formData.password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token, data.user);
        navigate(role === "student" ? "/student-dashboard" : "/admin-dashboard");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-neutral-100 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-neutral-900">Welcome Back</h2>
          <p className="text-neutral-500">Sign in to access your portal</p>
        </div>

        <div className="flex p-1 bg-neutral-100 rounded-xl">
          <button
            onClick={() => setRole("student")}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${role === "student" ? "bg-white text-violet-600 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
          >
            <GraduationCap className="w-4 h-4" /> Student
          </button>
          <button
            onClick={() => setRole("admin")}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${role === "admin" ? "bg-white text-violet-600 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
          >
            <Shield className="w-4 h-4" /> Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-700">{role === "student" ? "Roll Number" : "Username"}</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
              placeholder={role === "student" ? "e.g. 2021CS101" : "admin"}
              value={formData.identifier}
              onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-700">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-4 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-100 flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" /> Sign In
          </button>
        </form>

        {role === "student" ? (
          <p className="text-center text-sm text-neutral-500">
            Don't have an account? <Link to="/signup" className="text-violet-600 font-bold hover:underline">Sign up</Link>
          </p>
        ) : (
          <p className="text-center text-sm text-neutral-500">
            Don't have an account? <Link to="/admin-signup" className="text-violet-600 font-bold hover:underline">Sign up as Admin</Link>
          </p>
        )}
      </div>
    </div>
  );
}
