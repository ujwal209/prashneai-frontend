import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { 
  Loader2, 
  History, 
  Briefcase, 
  User, 
  Search, 
  Filter, 
  Calendar,
  Sparkles,
  ChevronDown,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Download,
  FileText,
  LayoutList
} from 'lucide-react';

const MatchHistory: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobFilter, setJobFilter] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/jobs/matches');
        setMatches(res.data);
      } catch (e) {
        console.error("Failed to load matches", e);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Extract unique jobs for filter
  const uniqueJobs = Array.from(new Set(matches.map(m => m.job?.title).filter(Boolean)));

  const filteredMatches = matches.filter(m => {
    const matchesSearch = 
      (m.resume?.candidate_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (m.job?.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesJob = jobFilter ? m.job?.title === jobFilter : true;
    
    return matchesSearch && matchesJob;
  });

  const getScoreTheme = (score: number) => {
    if (score >= 80) return {
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        indicator: 'bg-emerald-500',
        icon: CheckCircle2,
        label: 'High Match'
    };
    if (score >= 50) return {
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        indicator: 'bg-amber-500',
        icon: AlertCircle,
        label: 'Potential'
    };
    return {
        color: 'text-slate-600',
        bg: 'bg-slate-100',
        border: 'border-slate-200',
        indicator: 'bg-slate-400',
        icon: XCircle,
        label: 'Low Match'
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12 pt-6 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
             <div>
                <div className="flex items-center gap-2 mb-2">
                   <div className="flex items-center gap-2 px-3 py-1 bg-white text-slate-600 rounded-full border border-slate-200 shadow-sm">
                      <LayoutList className="w-3 h-3" />
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                          AI Evaluation Log
                      </span>
                   </div>
               </div>
               <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Match History</h1>
               <p className="text-slate-500 mt-2 font-medium">Timeline of all AI-driven candidate assessments.</p>
            </div>
            
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-bold hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm active:scale-95">
                <Download className="w-4 h-4" /> Export CSV
            </button>
        </div>

        {/* --- Filters Toolbar --- */}
        <div className="sticky top-4 z-30 bg-white/90 backdrop-blur-xl rounded-xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
            
            {/* Search */}
            <div className="relative flex-1 w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search by candidate name, job title, or keywords..." 
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 focus:bg-white transition-all font-medium text-slate-700 placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Filter Dropdown */}
            <div className="relative min-w-[240px] w-full md:w-auto">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select 
                  className="w-full pl-11 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 appearance-none cursor-pointer font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  value={jobFilter}
                  onChange={(e) => setJobFilter(e.target.value)}
                >
                    <option value="">All Job Profiles</option>
                    {uniqueJobs.map((j: any) => (
                        <option key={j} value={j}>{j}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
        </div>

        {/* --- Results List --- */}
        <div className="space-y-4">
            {loading ? (
                <div className="py-32 flex flex-col items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
                    <p className="text-slate-400 font-medium">Retrieving match data...</p>
                </div>
            ) : filteredMatches.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-slate-300 p-20 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                        <History className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No evaluations found</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-6 font-medium">
                        Try adjusting your search filters or run a new Smart Match analysis to populate this list.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredMatches.map((m) => {
                        const theme = getScoreTheme(m.match_score);
                        const ThemeIcon = theme.icon;

                        return (
                            <div 
                                key={m.id} 
                                className="group bg-white rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all duration-200 overflow-hidden"
                            >
                                <div className="flex flex-col md:flex-row">
                                    
                                    {/* Left: Score Indicator (Desktop) */}
                                    <div className="hidden md:flex w-28 flex-col items-center justify-center border-r border-slate-100 bg-slate-50/50 p-6 shrink-0">
                                        <div className={`relative flex items-center justify-center w-14 h-14 rounded-full border-4 ${theme.border} bg-white text-slate-700`}>
                                            <span className="text-lg font-extrabold">{m.match_score}</span>
                                        </div>
                                        <div className={`mt-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${theme.color}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${theme.indicator}`}></span>
                                            {theme.label}
                                        </div>
                                    </div>

                                    {/* Middle: Content */}
                                    <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between mb-3 gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 shrink-0 mt-1">
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                                {m.resume?.candidate_name || 'Unknown Candidate'}
                                                        </h3>
                                                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                                                {m.job ? (
                                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                                                        <Briefcase className="w-3 h-3 text-slate-400" />
                                                                        {m.job.title}
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100 border-dashed">
                                                                        <Sparkles className="w-3 h-3" /> Ad-hoc
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                                                                    <Calendar className="w-3 h-3" />
                                                                    {new Date(m.created_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                                                                </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mobile Score Badge */}
                                            <div className={`md:hidden self-start mb-4 px-2.5 py-1 rounded-full text-xs font-bold border ${theme.bg} ${theme.color} ${theme.border} flex items-center gap-1.5`}>
                                                <ThemeIcon className="w-3.5 h-3.5" />
                                                {m.match_score}% Match
                                            </div>

                                            {/* AI Insight Box */}
                                            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 relative mt-2 group-hover:bg-indigo-50/30 group-hover:border-indigo-100 transition-colors">
                                                <div className="flex items-start gap-2">
                                                    <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                                                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                                        "{m.match_reason}"
                                                    </p>
                                                </div>
                                            </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="md:w-20 border-t md:border-t-0 md:border-l border-slate-100 flex flex-row md:flex-col items-center justify-center gap-2 p-4 bg-slate-50/30">
                                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-lg transition-all" title="View Details">
                                                <ArrowUpRight className="w-5 h-5" />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-lg transition-all" title="Download Report">
                                                <FileText className="w-5 h-5" />
                                            </button>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
        
        {/* --- Footer Stats --- */}
        {!loading && filteredMatches.length > 0 && (
             <div className="flex justify-center pb-8">
                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm text-sm font-medium text-slate-500">
                    <History className="w-4 h-4 text-slate-400" />
                    <span>Total Evaluations:</span>
                    <span className="text-slate-900 font-bold">{filteredMatches.length}</span>
                 </div>
             </div>
        )} 
      </div>
    </div>
  );
};

export default MatchHistory;