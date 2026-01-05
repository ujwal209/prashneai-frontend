import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { supabase } from '../../lib/supabase';
import { Building2, Users, FileText, ArrowUpRight, Activity } from 'lucide-react';

interface GlobalStats {
  total_companies: number;
  total_resumes_parsed: number;
  total_users: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
        try {
            // Need session for Auth header if using API wrapper
            const { data: { session } } = await supabase.auth.getSession();
            if(session) {
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

  const StatCard = ({ title, value, icon: Icon }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">{loading ? '-' : value}</h3>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                <Icon className="w-5 h-5" />
            </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
            <span className="text-emerald-600 bg-emerald-50 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> +0%
            </span>
            <span className="text-xs text-slate-400">vs last month</span>
        </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">System Overview</h1>
            <p className="text-slate-500 text-sm mt-1">Real-time metrics across the platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Tenants" value={stats?.total_companies} icon={Building2} />
            <StatCard title="Active Users" value={stats?.total_users} icon={Users} />
            <StatCard title="Resumes Parsed" value={stats?.total_resumes_parsed} icon={FileText} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-80 flex flex-col justify-center items-center text-center">
                <Activity className="w-10 h-10 text-slate-300 mb-4" />
                <h3 className="font-bold text-slate-900">Platform Activity</h3>
                <p className="text-slate-500 text-sm">Chart visualization would go here.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-80 flex flex-col justify-center items-center text-center">
                <div className="w-32 h-32 rounded-full border-8 border-slate-100 border-t-indigo-600 mb-4"></div>
                <h3 className="font-bold text-slate-900">Storage Usage</h3>
                <p className="text-slate-500 text-sm">Resume storage capacity.</p>
            </div>
        </div>
    </div>
  );
};

export default AdminDashboard;