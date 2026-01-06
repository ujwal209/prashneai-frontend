import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { supabase } from '../../lib/supabase';
import {
    Building2,
    Users,
    FileText,
    ArrowUpRight,
    Activity,
    TrendingUp,
    Server,
    Zap,
    MoreHorizontal
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

interface GlobalStats {
    total_companies: number;
    total_resumes_parsed: number;
    total_users: number;
}

const mockChartData = [
    { name: 'Mon', users: 120, resumes: 45 },
    { name: 'Tue', users: 132, resumes: 55 },
    { name: 'Wed', users: 101, resumes: 35 },
    { name: 'Thu', users: 134, resumes: 70 },
    { name: 'Fri', users: 190, resumes: 90 },
    { name: 'Sat', users: 230, resumes: 140 },
    { name: 'Sun', users: 210, resumes: 120 },
];

const mockTenantData = [
    { name: 'TechCorp', usage: 85 },
    { name: 'InnoSystems', usage: 65 },
    { name: 'GlobalSol', usage: 45 },
    { name: 'Alpha', usage: 30 },
    { name: 'Beta', usage: 20 },
];

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<GlobalStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    const res = await api.get('/admin/stats');
                    setStats(res.data);
                }
            } catch (e) {
                console.error("Stats Error", e);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon: Icon, trend, trendLabel, color }: any) => (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
                <Icon className="w-24 h-24 -mr-4 -mt-4 transform rotate-12" />
            </div>

            <div className="flex justify-between items-start relative z-10">
                <div>
                    <p className="text-sm font-semibold text-slate-500">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">{loading ? '-' : value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
                    <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
                    {/* Note: This simplistic replacement works if color strings are simple like "bg-indigo-500", simpler to just pass text color prop */}
                </div>
            </div>
            <div className="mt-4 flex items-center gap-2 relative z-10">
                <span className="text-emerald-600 bg-emerald-50 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> {trend}
                </span>
                <span className="text-xs text-slate-400 font-medium">{trendLabel}</span>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Overview</h1>
                    <p className="text-slate-500 mt-2">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">Download Report</button>
                    <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">Refresh Data</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Tenants"
                    value={stats?.total_companies}
                    icon={Building2}
                    color="bg-blue-500"
                    trend="+12%"
                    trendLabel="vs last month"
                />
                <StatCard
                    title="Active Users"
                    value={stats?.total_users}
                    icon={Users}
                    color="bg-purple-500"
                    trend="+8%"
                    trendLabel="new signups"
                />
                <StatCard
                    title="Resumes Parsed"
                    value={stats?.total_resumes_parsed}
                    icon={FileText}
                    color="bg-emerald-500"
                    trend="+24%"
                    trendLabel="processing volume"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-lg text-slate-900">Platform Activity</h3>
                            <p className="text-sm text-slate-500">User signups vs Resume uploads</p>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-slate-400" />
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockChartData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorResumes" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                                <Area type="monotone" dataKey="resumes" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorResumes)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Side Bar Stats */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-lg text-slate-900">Top Tenants</h3>
                            <p className="text-sm text-slate-500">By resource usage</p>
                        </div>
                    </div>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockTenantData} layout="vertical" barSize={20}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px' }} />
                                <Bar dataKey="usage" fill="#3b82f6" radius={[0, 4, 4, 0]} background={{ fill: '#f1f5f9', radius: [0, 4, 4, 0] }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Live System Specs Mockup */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'CPU Usage', val: '24%', icon: Activity, color: 'text-rose-500' },
                    { label: 'Memory', val: '3.2 GB', icon: Server, color: 'text-indigo-500' },
                    { label: 'Network', val: '120 mb/s', icon: Zap, color: 'text-amber-500' },
                    { label: 'Latency', val: '45 ms', icon: Activity, color: 'text-emerald-500' },
                ].map((system, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className={`p-3 rounded-lg bg-slate-50 ${system.color}`}>
                            <system.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{system.label}</p>
                            <p className="font-mono font-bold text-slate-700">{system.val}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;