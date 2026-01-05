import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import ResumeCard from '../../components/ResumeCard';
import ResumeUpload from './ResumeUpload'; 
import { 
  Search, 
  Loader2, 
  Users, 
  Sparkles, 
  RefreshCw, 
  Plus,
  Layout,
  ArrowUp,
  Filter,
  LayoutGrid
} from 'lucide-react';

const TalentPool: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await api.get('/resumes');
      setCandidates(res.data);
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleUploadSuccess = (newCandidate: any) => {
    fetchCandidates();
    // Optional: Collapse upload after success
    // setShowUpload(false); 
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12 font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8 px-4 md:px-8 pt-6">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
               <div className="flex items-center gap-2 mb-2">
                   <div className="flex items-center gap-2 px-3 py-1 bg-white text-slate-600 rounded-full border border-slate-200 shadow-sm">
                      <LayoutGrid className="w-3 h-3" />
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                          Pipeline Management
                      </span>
                   </div>
               </div>
               <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                   Talent Pipeline
               </h1>
               <p className="text-slate-500 mt-2 font-medium">
                   Centralized hub for resume ingestion and candidate rankings.
               </p>
            </div>
            
            <div className="flex items-center gap-3">
               <button 
                 onClick={() => setShowUpload(!showUpload)}
                 className={`
                   group flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all shadow-sm active:scale-95
                   ${showUpload 
                     ? 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50' 
                     : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                   }
                 `}
               >
                   {showUpload ? <ArrowUp className="w-4 h-4" /> : <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />}
                   {showUpload ? 'Close Upload' : 'Add Talent'}
               </button>
            </div>
        </div>

        {/* --- Upload Section (Collapsible) --- */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showUpload ? 'max-h-[1200px] opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
            <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden relative">
                {/* Decorative Top Accent */}
                <div className="absolute top-0 inset-x-0 h-1 bg-indigo-600"></div>
                
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Add New Talent</h2>
                            <p className="text-slate-500 text-sm font-medium">Upload resumes to automatically parse and rank candidates.</p>
                        </div>
                    </div>
                    
                    {/* Resume Upload Component Wrapper */}
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                        <ResumeUpload onUploadSuccess={handleUploadSuccess} />
                    </div>
                </div>
            </div>
        </div>

        {/* --- Pipeline List Section --- */}
        <div className="space-y-6">
            
            {/* List Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-bold text-slate-900 pl-2">Recent Applicants</h2>
                    <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-md border border-slate-200">
                        {candidates.length} Total
                    </span>
                </div>
                
                <div className="flex gap-2">
                    <button className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-200" title="Filter">
                        <Filter className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={fetchCandidates}
                        className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-200"
                        title="Refresh List"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-xl border border-slate-200 border-dashed">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
                    <p className="text-slate-400 font-medium">Syncing pipeline data...</p>
                </div>
            ) : candidates.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-slate-300 p-20 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-200">
                        <Users className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">The pipeline is empty</h3>
                    <p className="text-slate-500 max-w-sm mx-auto font-medium">
                        Use the "Add Talent" button above to ingest resumes and start building your pool.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {candidates.map((candidate, index) => (
                        <div key={candidate.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms` }}>
                            <ResumeCard candidate={candidate} />
                        </div>
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default TalentPool;