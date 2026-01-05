import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LeaderboardWidget from '../../components/LeaderboardWidget';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  Sparkles, 
  TrendingUp, 
  FileText, 
  CheckCircle2,
  ArrowUpRight,
  BarChart3,
  Download,
  Users,
  ShieldCheck
} from 'lucide-react';
import api from '../../lib/api';

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalResumes: 0,
        totalJobs: 0,
        teamSize: 0
    });
    
    useEffect(() => {
        const fetchStats = async () => {
             try {
                // Mocking the fetch for now
                const res = await api.get('/resumes/stats'); 
                setStats(prev => ({...prev, totalResumes: res.data.total_parsed || 0}));
             } catch (e) {
                console.log("Stats fetch placeholder");
             }
        };
        fetchStats();
    }, []);

    // --- Reusable Stat Card (Strict Slate/Indigo Theme) ---
    const StatCard = ({ title, value, icon: Icon, trend }: any) => (
        <div className="group relative overflow-hidden rounded-xl bg-white p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
                    <h3 className="mt-2 text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
                </div>
                <div className="rounded-lg p-3 bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <Icon className="h-6 w-6" />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center gap-2 text-xs font-bold relative z-10">
                    <div className="flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1 text-slate-700 border border-slate-200">
                        <ArrowUpRight className="h-3 w-3 text-indigo-600" />
                        {trend}
                    </div>
                    <span className="text-slate-400">vs last week</span>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12 pt-8 px-4 md:px-8">
            <div className="max-w-[1600px] mx-auto space-y-8">
                
                {/* --- Header Section --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                             <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
                                <ShieldCheck className="w-3 h-3" />
                                <span className="text-[11px] font-bold uppercase tracking-wider">
                                    Admin Console
                                </span>
                             </div>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Team Analytics
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">
                            Monitor recruitment velocity and team performance metrics.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
                            <Download className="w-4 h-4" />
                            <span>Export Report</span>
                        </button>
                        <button 
                             onClick={() => navigate('/hr/upload')}
                             className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
                        >
                            <UploadCloud className="w-4 h-4" />
                            <span>Upload Resume</span>
                        </button>
                    </div>
                </div>

                {/* --- KPI Cards --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard 
                        title="My Processed Resumes" 
                        value={stats.totalResumes} 
                        icon={FileText} 
                        trend="+12%"
                    />
                    <StatCard 
                        title="Candidates Shortlisted" 
                        value="--" 
                        icon={CheckCircle2} 
                        trend="+5%"
                    />
                    <StatCard 
                        title="Active Job Posts" 
                        value="--" 
                        icon={Sparkles} 
                        trend="0%"
                    />
                </div>

                {/* --- Main Content Grid --- */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-[500px]">
                    
                    {/* Left: Leaderboard Widget */}
                    <div className="xl:col-span-7 flex flex-col gap-5">
                         <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2 text-indigo-600">
                               <TrendingUp className="w-5 h-5" />
                               <h2 className="text-xl font-bold text-slate-900">Team Leaderboard</h2>
                            </div>
                            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                                View All
                            </button>
                        </div>
                        
                        {/* Widget Wrapper */}
                        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <LeaderboardWidget />
                        </div>
                    </div>

                    {/* Right: Analytics / Insights */}
                    <div className="xl:col-span-5 flex flex-col gap-5">
                        <div className="flex items-center gap-2 px-1 text-slate-700">
                           <BarChart3 className="w-5 h-5" />
                           <h2 className="text-xl font-bold text-slate-900">Performance Insights</h2>
                        </div>
                        
                        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-8 flex flex-col relative overflow-hidden group">
                             {/* Subtle Pattern Background */}
                            <div className="absolute inset-0 bg-slate-50/50" 
                                 style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
                            />
                            
                            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
                                <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-6 transform group-hover:scale-105 transition-transform duration-500">
                                    <Sparkles className="w-8 h-8 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">AI Analytics Suite</h3>
                                <p className="text-slate-500 max-w-xs mx-auto mt-3 font-medium text-sm leading-relaxed">
                                    We are gathering data on recruitment velocity and JD match success rates.
                                </p>
                                <div className="mt-8 px-4 py-2 bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
                                    Coming Soon
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;