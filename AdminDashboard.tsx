import React, { useState, useEffect } from "react";
import { Plus, Users, Briefcase, TrendingUp, CheckCircle, XCircle, MoreVertical, Search } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion } from "motion/react";

interface Stats {
  totalStudents: number;
  totalPlaced: number;
  avgPackage: number;
  highestPackage: number;
  branchStats: { branch: string; placed: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [editingCompany, setEditingCompany] = useState<any>(null);

  const [newCompany, setNewCompany] = useState({
    name: "", role: "", package: "", eligibility_cgpa: "", eligibility_branch: "Computer Science", deadline: "", description: ""
  });

  const [newNews, setNewNews] = useState({ title: "", content: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const [statsRes, appsRes, stdsRes, compRes] = await Promise.all([
      fetch("/api/stats", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("/api/applications/admin", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("/api/students", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("/api/companies", { headers: { Authorization: `Bearer ${token}` } })
    ]);
    setStats(await statsRes.json());
    setApplications(await appsRes.json());
    setStudents(await stdsRes.json());
    setCompanies(await compRes.json());
  };

  const handleDownloadReport = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/admin/download-report", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'placement_report.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handlePostNews = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch("/api/news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newNews),
    });
    if (res.ok) {
      setNewNews({ title: "", content: "" });
      alert("Update posted successfully!");
    }
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch("/api/companies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...newCompany,
        package: parseFloat(newCompany.package),
        eligibility_cgpa: parseFloat(newCompany.eligibility_cgpa)
      }),
    });
    if (res.ok) {
      setShowAddCompany(false);
      fetchData();
    }
  };

  const handleDeleteCompany = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this drive?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/companies/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) fetchData();
  };

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/companies/${editingCompany.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...editingCompany,
        package: parseFloat(editingCompany.package),
        eligibility_cgpa: parseFloat(editingCompany.eligibility_cgpa)
      }),
    });
    if (res.ok) {
      setEditingCompany(null);
      fetchData();
    }
  };

  const updateAppStatus = async (id: number, status: string) => {
    const token = localStorage.getItem("token");
    await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status }),
    });
    fetchData();
  };

  if (!stats) return <div className="flex items-center justify-center h-64">Loading Admin Portal...</div>;

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Placement Cell Control</h1>
          <p className="text-neutral-500">Manage drives, track applications, and view analytics.</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleDownloadReport}
            className="px-6 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-bold hover:bg-neutral-50 transition-all flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" /> Download CSV
          </button>
          <button
            onClick={() => setShowAddCompany(true)}
            className="bg-violet-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-violet-700 transition-all shadow-lg shadow-violet-100"
          >
            <Plus className="w-5 h-5" /> Add New Drive
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Students", value: stats.totalStudents, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Placed Students", value: stats.totalPlaced, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Success Rate", value: `${((stats.totalPlaced / stats.totalStudents) * 100 || 0).toFixed(1)}%`, icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Highest Package", value: `${stats.highestPackage} LPA`, icon: Briefcase, color: "text-orange-600", bg: "bg-orange-50" },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg} ${item.color}`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider">{item.label}</p>
              <p className="text-2xl font-bold text-neutral-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Charts */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-neutral-900">Placement by Branch</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.branchStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="branch" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f9fafb' }}
                />
                <Bar dataKey="placed" fill="#7c3aed" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Post Update */}
        <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-neutral-900">Post Placement Update</h2>
          <form onSubmit={handlePostNews} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase">Title</label>
              <input
                type="text" required
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 text-sm focus:ring-2 focus:ring-violet-500 outline-none"
                value={newNews.title}
                onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase">Content</label>
              <textarea
                required
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 text-sm h-32 focus:ring-2 focus:ring-violet-500 outline-none"
                value={newNews.content}
                onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
              ></textarea>
            </div>
            <button type="submit" className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold text-sm hover:bg-violet-700 transition-all">
              Post Update
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {/* Recent Applications */}
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-neutral-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-neutral-900">Recent Applications</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search student..."
                className="pl-9 pr-4 py-2 bg-neutral-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none w-48"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50 text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-neutral-900">{app.student_name}</p>
                      <p className="text-xs text-neutral-500">{app.student_rollNo}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600 font-medium">{app.company_name}</td>
                    <td className="px-6 py-4">
                      <select
                        value={app.status}
                        onChange={(e) => updateAppStatus(app.id, e.target.value)}
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider outline-none border-none cursor-pointer transition-all ${app.status === 'selected' ? 'bg-emerald-100 text-emerald-700' :
                            app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              app.status === 'shortlisted' ? 'bg-blue-100 text-blue-700' :
                                'bg-neutral-100 text-neutral-600'
                          }`}
                      >
                        <option value="applied">Applied</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="selected">Selected</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateAppStatus(app.id, 'selected')}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Quick Select"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateAppStatus(app.id, 'rejected')}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Quick Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Manage Drives */}
      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden flex flex-col mt-10">
        <div className="p-6 border-b border-neutral-50">
          <h2 className="text-xl font-bold text-neutral-900">Manage Placement Drives</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50 text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Package</th>
                <th className="px-6 py-4">Deadline</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {companies.map((comp) => (
                <tr key={comp.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-sm text-neutral-900">{comp.name}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">{comp.role}</td>
                  <td className="px-6 py-4 text-sm text-violet-600 font-bold">{comp.package} LPA</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">{new Date(comp.deadline).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <button onClick={() => setEditingCompany(comp)} className="text-blue-600 font-bold text-xs hover:underline">Edit</button>
                      <button onClick={() => handleDeleteCompany(comp.id)} className="text-red-600 font-bold text-xs hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Students Directory */}
      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden flex flex-col mt-10">
        <div className="p-6 border-b border-neutral-50">
          <h2 className="text-xl font-bold text-neutral-900">Students Directory</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50 text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Name / Roll No</th>
                <th className="px-6 py-4">Branch</th>
                <th className="px-6 py-4">CGPA</th>
                <th className="px-6 py-4">Skills</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {students.map((std) => (
                <tr key={std.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-neutral-900">{std.name}</p>
                    <p className="text-xs text-neutral-500">{std.rollNo}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600">{std.branch}</td>
                  <td className="px-6 py-4 text-sm font-bold text-neutral-900">{std.cgpa}</td>
                  <td className="px-6 py-4 text-xs text-neutral-500 max-w-xs truncate">{std.skills}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Company Modal */}
      {editingCompany && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-neutral-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-neutral-900">Edit Placement Drive</h2>
              <button onClick={() => setEditingCompany(null)} className="text-neutral-400 hover:text-neutral-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUpdateCompany} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">Company Name</label>
                <input
                  type="text" required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-violet-500 outline-none"
                  value={editingCompany.name}
                  onChange={(e) => setEditingCompany({ ...editingCompany, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">Role</label>
                <input
                  type="text" required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-violet-500 outline-none"
                  value={editingCompany.role}
                  onChange={(e) => setEditingCompany({ ...editingCompany, role: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">Package (LPA)</label>
                <input
                  type="number" step="0.1" required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-violet-500 outline-none"
                  value={editingCompany.package}
                  onChange={(e) => setEditingCompany({ ...editingCompany, package: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">Min CGPA</label>
                <input
                  type="number" step="0.1" required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-violet-500 outline-none"
                  value={editingCompany.eligibility_cgpa}
                  onChange={(e) => setEditingCompany({ ...editingCompany, eligibility_cgpa: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">Deadline</label>
                <input
                  type="date" required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-violet-500 outline-none"
                  value={editingCompany.deadline ? editingCompany.deadline.split('T')[0] : ''}
                  onChange={(e) => setEditingCompany({ ...editingCompany, deadline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">Min Branch</label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-violet-500 outline-none bg-white"
                  value={editingCompany.eligibility_branch}
                  onChange={(e) => setEditingCompany({ ...editingCompany, eligibility_branch: e.target.value })}
                >
                  <option>Computer Science</option>
                  <option>Information Technology</option>
                  <option>All Branches</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-neutral-700">Description</label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-violet-500 outline-none h-24"
                  value={editingCompany.description}
                  onChange={(e) => setEditingCompany({ ...editingCompany, description: e.target.value })}
                ></textarea>
              </div>
              <button
                type="submit"
                className="md:col-span-2 py-4 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-all"
              >
                Save Changes
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Company Modal */}
      {showAddCompany && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-neutral-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-neutral-900">Add New Placement Drive</h2>
              <button onClick={() => setShowAddCompany(false)} className="text-neutral-400 hover:text-neutral-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddCompany} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">Company Name</label>
                <input
                  type="text" required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-violet-500 outline-none"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">Role</label>
                <input
                  type="text" required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-violet-500 outline-none"
                  value={newCompany.role}
                  onChange={(e) => setNewCompany({ ...newCompany, role: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">Package (LPA)</label>
                <input
                  type="number" step="0.1" required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-violet-500 outline-none"
                  value={newCompany.package}
                  onChange={(e) => setNewCompany({ ...newCompany, package: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">Min CGPA</label>
                <input
                  type="number" step="0.1" required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-violet-500 outline-none"
                  value={newCompany.eligibility_cgpa}
                  onChange={(e) => setNewCompany({ ...newCompany, eligibility_cgpa: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">Deadline</label>
                <input
                  type="date" required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-violet-500 outline-none"
                  value={newCompany.deadline}
                  onChange={(e) => setNewCompany({ ...newCompany, deadline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">Min Branch</label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-violet-500 outline-none bg-white"
                  value={newCompany.eligibility_branch}
                  onChange={(e) => setNewCompany({ ...newCompany, eligibility_branch: e.target.value })}
                >
                  <option>Computer Science</option>
                  <option>Information Technology</option>
                  <option>All Branches</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-neutral-700">Description</label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-violet-500 outline-none h-24"
                  value={newCompany.description}
                  onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
                ></textarea>
              </div>
              <button
                type="submit"
                className="md:col-span-2 py-4 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-all"
              >
                Create Drive
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
