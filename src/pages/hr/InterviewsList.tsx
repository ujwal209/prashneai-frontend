import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { 
  Calendar, 
  Briefcase, 
  Video, 
  Loader2, 
  Search,
  Filter,
  Copy,
  Check,
  User,
  TrendingUp,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
  PlayCircle,
  Clock,
  ArrowUpRight,
  LayoutList
} from 'lucide-react';

interface InterviewSession {
  id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  final_score: number | null;
  started_at: string;
  completed_at: string | null;
  created_by: string;
  candidate_id?: string;
  job_id: string;
  company_id: string;
  is_creator: boolean;
  is_candidate: boolean;
  jobs?: {
    title: string;
    description: string;
    location: string;
    salary: string;
  };
  resumes?: {
    candidate_name: string;
    email: string;
    skills: string[];
  };
  companies?: {
    name: string;
  };
  company_name?: string;
}

interface ApiResponse {
  sessions: InterviewSession[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    has_more: boolean;
  };
}

const InterviewsList: React.FC = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    in_progress: 0
  });
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // UI State
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res = await api.get<ApiResponse>('/interviews/user/list');
      setInterviews(res.data.sessions);
      
      const stats = {
        total: res.data.sessions.length,
        pending: res.data.sessions.filter(s => s.status === 'pending').length,
        completed: res.data.sessions.filter(s => s.status === 'completed').length,
        in_progress: res.data.sessions.filter(s => s.status === 'in_progress').length
      };
      setStats(stats);
    } catch (error) {
      console.error("Failed to fetch interviews", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const link = `${window.location.origin}/interview/${id}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStartInterview = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    navigate(`/interview/${sessionId}`);
  };

  const filteredInterviews = useMemo(() => {
    return interviews.filter(session => {
      const candidateName = session.resumes?.candidate_name || 'Unknown Candidate';
      const jobTitle = session.jobs?.title || 'General Interview';
      
      const matchesSearch = searchTerm === '' || 
        candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [interviews, searchTerm, statusFilter]);

  // --- Utility Functions ---

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'completed': return { icon: CheckCircle, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' };
      case 'in_progress': return { icon: PlayCircle, color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' };
      case 'failed': return { icon: XCircle, color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' };
      default: return { icon: AlertCircle, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' };
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return 'Invalid date'; }
  };

  const getCandidateInitial = (name?: string) => name?.charAt(0).toUpperCase() || 'U';
  const getCandidateName = (session: InterviewSession) => session.resumes?.candidate_name || 'Unknown Candidate';
  const getJobTitle = (session: InterviewSession) => session.jobs?.title || 'General Interview';
  const getCompanyName = (session: InterviewSession) => session.company_name || session.companies?.name || 'Unknown Company';

  // --- Components ---

  const StatsCard = ({ title, value, icon: Icon, colorClass }: { title: string; value: number; icon: any; colorClass: string }) => (
    <div className="relative overflow-hidden bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col relative z-10">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-3xl font-bold text-slate-900 tracking-tight">{value}</span>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">{title}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 relative font-sans pb-12 pt-6 px-4 md:px-8">
      
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-white text-slate-600 rounded-full border border-slate-200 shadow-sm">
                   <LayoutList className="w-3 h-3" />
                   <span className="text-[11px] font-bold uppercase tracking-wider">
                       Dashboard
                   </span>
                </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Interview Sessions</h1>
            <p className="text-slate-500 font-medium">
              Track your AI-powered interviews, analyze candidate performance, and manage schedules.
            </p>
          </div>
          
          <button 
            onClick={() => navigate('/hr/schedule')}
            className="group relative inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-sm hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
          >
            <Video className="w-5 h-5" />
            <span>New Session</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Sessions" value={stats.total} icon={BarChart3} colorClass="bg-slate-100 text-slate-700" />
          <StatsCard title="Pending" value={stats.pending} icon={Clock} colorClass="bg-amber-50 text-amber-600" />
          <StatsCard title="In Progress" value={stats.in_progress} icon={Video} colorClass="bg-indigo-50 text-indigo-600" />
          <StatsCard title="Completed" value={stats.completed} icon={CheckCircle} colorClass="bg-emerald-50 text-emerald-600" />
        </div>

        {/* Filters & Content Wrapper */}
        <div className="space-y-6">
          
          {/* Filter Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row gap-4 sticky top-4 z-30">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="Search by candidate or role..."
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              <select
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 cursor-pointer text-slate-700 font-medium appearance-none hover:bg-slate-50 transition-colors"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Grid Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
              <p className="text-slate-400 font-medium">Loading sessions...</p>
            </div>
          ) : filteredInterviews.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-16 text-center shadow-sm">
              <div className="w-20 h-20 mx-auto mb-6 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No interviews found</h3>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">
                {searchTerm ? "We couldn't find any sessions matching your search." : "Get started by creating your first interview session."}
              </p>
              {!searchTerm && (
                <button 
                  onClick={() => navigate('/hr/schedule')}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-sm"
                >
                  Create Session
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
              {filteredInterviews.map((session) => {
                const StatusInfo = getStatusConfig(session.status);
                
                return (
                  <div 
                    key={session.id} 
                    onClick={() => navigate(`/interview/${session.id}`)}
                    className="group bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 cursor-pointer relative flex flex-col h-full"
                  >
                    {/* Top Row: User & Status */}
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg border border-slate-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                          {getCandidateInitial(getCandidateName(session))}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {getCandidateName(session)}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium">{session.is_creator ? 'Created by you' : 'Invited'}</p>
                        </div>
                      </div>
                      
                      <div className={`px-2.5 py-1 rounded border text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5 ${StatusInfo.bg} ${StatusInfo.color}`}>
                        <StatusInfo.icon className="w-3.5 h-3.5" />
                        <span className="capitalize">{session.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                    
                    {/* Middle Row: Job Info */}
                    <div className="mb-6 flex-1">
                      <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-1.5">
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        {getJobTitle(session)}
                      </h4>
                      <p className="text-sm text-slate-500 pl-6 mb-4 font-medium">{getCompanyName(session)}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-slate-500 pl-6 border-t border-slate-100 pt-3 mt-3">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(session.started_at)}
                        </span>
                        {session.final_score && (
                          <span className="flex items-center gap-1.5 font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                            {session.final_score}/100
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto bg-slate-50/50 -mx-6 -mb-6 px-6 pb-4">
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mt-2">
                        <User className="w-3.5 h-3.5" />
                        {getCandidateIdDisplay(session.candidate_id)}
                      </span>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={(e) => handleCopyLink(e, session.id)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm"
                          title="Copy Link"
                        >
                          {copiedId === session.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                        
                        <button
                          onClick={(e) => handleStartInterview(e, session.id)}
                          className="flex items-center gap-1.5 pl-3 pr-4 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg shadow-sm hover:border-indigo-300 hover:text-indigo-600 transition-all group/btn"
                        >
                          <span>Open</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper for ID display
const getCandidateIdDisplay = (id?: string) => id ? `ID: ${id.substring(0, 6)}...` : 'ID: N/A';

export default InterviewsList;