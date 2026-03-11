import { motion } from "motion/react";
import { ArrowRight, Briefcase, Users, ShieldCheck, BarChart3, Sparkles, GraduationCap, Globe } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="space-y-32 pb-32">
      {/* Immersive Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden rounded-b-[4rem] shadow-2xl">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1920" 
            alt="Students collaborating" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-violet-950/90 via-violet-900/80 to-transparent z-10"></div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-10 max-w-4xl mx-auto"
          >
            <h1 className="text-7xl md:text-8xl font-extrabold tracking-tight text-white leading-[1.1]">
              Secure Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-violet-100">Future Today.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-violet-100/90 max-w-2xl mx-auto leading-relaxed font-medium">
              Experience the most professional way to connect with global hiring partners. 
              AI-driven matching, real-time tracking, and elite career opportunities.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-6">
              <Link 
                to="/signup" 
                className="px-12 py-6 bg-white text-violet-900 rounded-2xl font-extrabold text-xl hover:bg-violet-50 transition-all shadow-2xl shadow-violet-900/40 flex items-center gap-3 group"
              >
                Get Started <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link 
                to="/login" 
                className="px-12 py-6 bg-violet-600/20 backdrop-blur-md text-white border border-white/20 rounded-2xl font-extrabold text-xl hover:bg-white/10 transition-all"
              >
                Admin Portal
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floating Stats Marquee */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "Partner Companies", value: "500+", icon: Globe, color: "text-violet-600" },
            { label: "Highest Package", value: "48 LPA", icon: Briefcase, color: "text-emerald-600" },
            { label: "Success Rate", value: "94.1%", icon: BarChart3, color: "text-blue-600" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-xl shadow-neutral-200/50 flex items-center gap-6"
            >
              <div className={`p-5 rounded-2xl bg-neutral-50 ${stat.color}`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-4xl font-black text-neutral-900 tracking-tight">{stat.value}</p>
                <p className="text-neutral-500 font-bold uppercase text-xs tracking-widest">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Interactive Features Section */}
      <section className="max-w-7xl mx-auto px-4 space-y-20">
        <div className="text-center space-y-6">
          <h2 className="text-5xl font-black text-neutral-900 tracking-tight">
            Designed for <span className="text-violet-600">High Performance.</span>
          </h2>
          <p className="text-neutral-500 max-w-2xl mx-auto text-lg font-medium">
            Our platform is built to handle the complexities of modern recruitment with ease and elegance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "Eligibility Auto-Check",
              desc: "Instantly know if you qualify for a drive based on CGPA and branch.",
              icon: ShieldCheck,
              color: "bg-emerald-50 text-emerald-600",
              link: "/student-dashboard"
            },
            {
              title: "Real-time Tracking",
              desc: "Track your application status from shortlist to final selection.",
              icon: BarChart3,
              color: "bg-blue-50 text-blue-600",
              link: "/student-dashboard"
            },
            {
              title: "Resume Matching",
              desc: "AI-powered resume analysis to match you with the right roles.",
              icon: Users,
              color: "bg-violet-50 text-violet-600",
              link: "/student-dashboard"
            },
            {
              title: "Centralized Hub",
              desc: "All job descriptions, schedules, and resources in one place.",
              icon: Briefcase,
              color: "bg-orange-50 text-orange-600",
              link: "/student-dashboard"
            }
          ].map((feature, i) => (
            <Link 
              key={i} 
              to={feature.link}
              className="bg-white p-10 rounded-[3rem] border border-neutral-100 space-y-6 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-200/50 transition-all group block relative overflow-hidden"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 ${feature.color}`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-neutral-900 group-hover:text-violet-600 transition-colors">{feature.title}</h3>
                <p className="text-neutral-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
              <div className="pt-4 flex items-center gap-2 text-sm font-black text-violet-600 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                Explore Feature <ArrowRight className="w-4 h-4" />
              </div>
              {/* Decorative Background Icon */}
              <feature.icon className="absolute -bottom-8 -right-8 w-32 h-32 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity" />
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-violet-950 py-24 rounded-[4rem] mx-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-violet-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-violet-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center space-y-12 px-4 relative z-10">
          <h2 className="text-5xl font-black text-white leading-tight">
            Trusted by the world's <br />
            <span className="text-violet-400">most innovative companies.</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Mock Company Logos */}
            {['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'].map((company) => (
              <span key={company} className="text-2xl font-black text-white tracking-tighter">{company}</span>
            ))}
          </div>
          <div className="pt-8">
            <Link 
              to="/signup" 
              className="px-12 py-6 bg-violet-600 text-white rounded-2xl font-black text-xl hover:bg-violet-500 transition-all shadow-2xl shadow-violet-900/50"
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
