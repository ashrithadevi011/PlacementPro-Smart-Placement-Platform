import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, LogOut, User, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-violet-600" />
            <span className="text-xl font-bold tracking-tight text-neutral-900">PlacementPro</span>
          </Link>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link 
                  to={user.role === "admin" ? "/admin-dashboard" : "/student-dashboard"}
                  className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-violet-600 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 pl-6 border-l border-neutral-200">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-neutral-900">{user.name || "Admin"}</span>
                    <span className="text-xs text-neutral-500 capitalize">{user.role}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-neutral-600 hover:text-violet-600">Login</Link>
                <Link 
                  to="/signup" 
                  className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition-all shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
