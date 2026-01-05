import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

// --- Icons (React Icons / Material Design) ---
import {
  MdPeople,
  MdDescription,
  MdWorkOutline,
  MdPendingActions,
  MdEventAvailable,
  MdTrackChanges,
  MdTrendingUp,
  MdTrendingDown,
  MdCloudUpload,
  MdAutoAwesome,
  MdChevronRight,
  MdCheckCircle,
  MdTimeline,
  MdAdd,
  MdBusiness,
  MdAssessment
} from 'react-icons/md';

// --- Types ---
interface DashboardStats {
  total_parsed: number;
  total_candidates: number;
  active_jobs: number;
  pending_reviews: number;
  today_interviews: number;
  matches_this_month: number;
}

interface ActivityItem {
  id: string;
  type: 'upload' | 'review' | 'match' | 'interview';
  title: string;
  description: string;
  timestamp: string;
}

// --- Helper Components ---

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  loading
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  loading: boolean;
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col justify-between group">
      <div className="flex justify-between items-start mb-4">
        {/* Uniform Icon Style: Indigo Background, Indigo Icon */}
        <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
          <Icon size={24} />
        </div>
        
        {trend && !loading && (
          <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border ${
            trend === 'up' 
              ? 'bg-indigo-50 text-indigo-700 border-indigo-100' 
              : 'bg-slate-50 text-slate-600 border-slate-200'
          }`}>
            {trend === 'up' ? <MdTrendingUp /> : <MdTrendingDown />}
            {trendValue}
          </span>
        )}
      </div>
      
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
          {title}
        </p>
        {loading ? (
          <div className="h-8 w-24 bg-slate-100 rounded animate-pulse" />
        ) : (
          <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
            {value}
          </h3>
        )}
      </div>
    </div>
  );
};

const HRDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({ 
    total_parsed: 0,
    total_candidates: 0,
    active_jobs: 0,
    pending_reviews: 0,
    today_interviews: 0,
    matches_this_month: 0
  });
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, activitiesRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/activities?limit=5')
        ]);
        setStats(statsRes.data);
        setActivities(activitiesRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12 pt-8 px-4 md:px-8 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-[1600px] mx-auto">
        
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-slate-900 rounded-lg text-white">
                <MdBusiness size={28} />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Recruitment Dashboard</h1>
            </div>
            <p className="text-slate-500 font-medium ml-1">
              Real-time insights and hiring metrics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
              <MdCheckCircle className="text-indigo-600" size={16} />
              <span className="text-sm font-bold text-slate-700">System Operational</span>
            </div>
            <button 
              onClick={() => navigate('/hr/interviews')}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition-all active:scale-95"
            >
              <MdAdd size={20} />
              New Interview
            </button>
          </div>
        </div>

        {/* --- Stats Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-10">
          <StatCard 
            title="Total Candidates" 
            value={stats.total_candidates} 
            icon={MdPeople} 
            trend="up"
            trendValue="+12%"
            loading={loading}
          />
          <StatCard 
            title="Resumes Parsed" 
            value={stats.total_parsed} 
            icon={MdDescription} 
            trend="up"
            trendValue="+5%"
            loading={loading}
          />
          <StatCard 
            title="Active Jobs" 
            value={stats.active_jobs} 
            icon={MdWorkOutline} 
            trend="neutral"
            trendValue="0%"
            loading={loading}
          />
          <StatCard 
            title="Pending Reviews" 
            value={stats.pending_reviews} 
            icon={MdPendingActions} 
            trend="down"
            trendValue="+8%"
            loading={loading}
          />
          <StatCard 
            title="Interviews Today" 
            value={stats.today_interviews} 
            icon={MdEventAvailable} 
            loading={loading}
          />
          <StatCard 
            title="Matches (Month)" 
            value={stats.matches_this_month} 
            icon={MdTrackChanges} 
            trend="up"
            trendValue="+15%"
            loading={loading}
          />
        </div>

        {/* --- Main Content Layout --- */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column (Activity & Actions) */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Recent Activity Panel */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2 text-slate-700">
                  <MdTimeline size={22} className="text-indigo-600" />
                  <h2 className="font-bold text-lg">Recent Activity</h2>
                </div>
                <button 
                  onClick={() => navigate('/hr/activity')}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
                >
                  View All <MdChevronRight size={18} />
                </button>
              </div>
              
              <div className="divide-y divide-slate-100">
                {loading ? (
                   [1, 2, 3].map((i) => (
                     <div key={i} className="p-4 flex gap-4 animate-pulse">
                       <div className="w-10 h-10 bg-slate-200 rounded-full" />
                       <div className="flex-1 space-y-2 py-1">
                         <div className="h-4 bg-slate-200 rounded w-3/4" />
                         <div className="h-3 bg-slate-200 rounded w-1/2" />
                       </div>
                     </div>
                   ))
                ) : activities.length > 0 ? (
                  activities.map((activity) => {
                    // Strictly 2 colors: Slate for structure, Indigo for accents.
                    let Icon = MdAssessment;
                    if (activity.type === 'upload') Icon = MdCloudUpload;
                    if (activity.type === 'review') Icon = MdDescription;
                    if (activity.type === 'match') Icon = MdAutoAwesome;
                    if (activity.type === 'interview') Icon = MdEventAvailable;

                    return (
                      <div 
                        key={activity.id} 
                        className="p-4 px-6 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                      >
                        <div className="p-2.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200 mt-1">
                          <Icon size={18} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                              {activity.title}
                            </h4>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                              {activity.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    <p>No recent activity found.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* AI Generator Card - Dark Theme (Slate 900) */}
              <button 
                onClick={() => navigate('/hr/jobs/new')}
                className="text-left bg-slate-900 rounded-xl p-6 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <MdAutoAwesome size={100} />
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4 text-indigo-300 backdrop-blur-sm relative z-10">
                  <MdAutoAwesome size={24} />
                </div>
                <h3 className="text-lg font-bold mb-1 relative z-10">AI Job Generator</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed relative z-10">
                  Generate optimized job descriptions tailored to your company tone.
                </p>
                <div className="flex items-center gap-2 text-sm font-bold text-indigo-300 group-hover:text-white transition-colors relative z-10">
                  Launch Generator <MdChevronRight />
                </div>
              </button>

              {/* Bulk Upload Card - Light Theme with Border */}
              <button 
                onClick={() => navigate('/hr/upload')}
                className="text-left bg-white border border-slate-200 rounded-xl p-6 text-slate-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 text-indigo-600 relative z-10">
                  <MdCloudUpload size={24} />
                </div>
                <h3 className="text-lg font-bold mb-1 relative z-10">Bulk Resume Upload</h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed relative z-10">
                  Drag & drop multiple resumes to automatically parse and match candidates.
                </p>
                <div className="flex items-center gap-2 text-sm font-bold text-indigo-600 group-hover:text-indigo-800 transition-colors relative z-10">
                  Start Upload <MdChevronRight />
                </div>
              </button>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            
            {/* Performance Widget */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6 text-indigo-600">
                <MdTrackChanges size={22} />
                <h3 className="font-bold text-slate-900 text-lg">Performance Metrics</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500 font-medium">Time to Hire</span>
                    <span className="font-bold text-slate-900">24 days</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-800 w-[60%] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500 font-medium">Candidate Quality</span>
                    <span className="font-bold text-slate-900">4.8/5.0</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 w-[85%] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500 font-medium">Offer Acceptance</span>
                    <span className="font-bold text-slate-900">92%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-600 w-[92%] rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* System Health Widget */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4 text-slate-900">
                <MdCheckCircle size={22} className="text-indigo-600" />
                <h3 className="font-bold text-lg">System Health</h3>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: 'Resume Parser', status: 'Operational' },
                  { name: 'AI Matching Engine', status: 'Operational' },
                  { name: 'Database Clusters', status: '99.9% Uptime' },
                ].map((service, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50/50">
                    <span className="text-sm font-semibold text-slate-700">{service.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-200 bg-indigo-50 text-indigo-700 uppercase tracking-wide">
                      {service.status}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-slate-400 mt-4 font-medium">
                Last check: 1 minute ago
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;