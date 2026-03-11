import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Shield } from "lucide-react";

export default function AdminSignup() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch("/api/auth/admin/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
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
        <div className="max-w-md mx-auto mt-12">
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-neutral-100 space-y-8">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-violet-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-neutral-900">Admin Registration</h2>
                    <p className="text-neutral-500">Create your admin account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-neutral-700">Username</label>
                        <input
                            type="text" required
                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-violet-500 outline-none"
                            placeholder="e.g. adminguy"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-neutral-700">Password</label>
                        <input
                            type="password" required
                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-violet-500 outline-none"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full py-4 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        <UserPlus className="w-5 h-5" /> Create Admin
                    </button>
                </form>

                <p className="text-center text-sm text-neutral-500">
                    Already have an admin account? <Link to="/login" className="text-violet-600 font-bold hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
