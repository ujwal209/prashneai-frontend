import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import ResumeCard from '../../components/ResumeCard';
import { 
  Search, 
  Loader2, 
  Users, 
  Filter, 
  RefreshCw,
  FolderOpen,
  Plus,
  Download,
  LayoutGrid
} from 'lucide-react';
import ResumeDetailModal from '../../components/ResumeDetailModal';

const ResumesList: React.FC = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Local state for immediate input feedback
  const paramQuery = searchParams.get('q') || '';
  const [localSearch, setLocalSearch] = useState(paramQuery);

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

  const handleDelete = async (id: string) => {
      if(!window.confirm("Are you sure you want to delete this resume? This action cannot be undone.")) return;
      try {
          await api.delete(`/resumes/${id}`);
          setCandidates(prev => prev.filter(c => c.id !== id));
      } catch (err) {
          console.error("Delete failed", err);
          alert("Failed to delete resume");
          fetchCandidates(); // Re-sync on error
      }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Sync local search with params if changed externally
  useEffect(() => {
    setLocalSearch(paramQuery);
  }, [paramQuery]);

  const filteredCandidates = candidates.filter(c => 
      (c.candidate_name && c.candidate_name.toLowerCase().includes(localSearch.toLowerCase())) ||
      (c.raw_ai_response?.email && c.raw_ai_response.email.toLowerCase().includes(localSearch.toLowerCase())) ||
      (c.raw_ai_response?.skills && c.raw_ai_response.skills.some((s: string) => s.toLowerCase().includes(localSearch.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12 pt-6 px-4 md:px-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
       
       {/* --- Modal Layer --- */}
       {selectedCandidate && (
           <ResumeDetailModal 
              candidate={selectedCandidate} 
              onClose={() => setSelectedCandidate(null)} 
           />
       )}

       <div className="max-w-[1600px] mx-auto space-y-8">
          
          {/* --- Header Section --- */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                  <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-2 px-3 py-1 bg-white text-slate-600 rounded-full border border-slate-200 shadow-sm">
                         <LayoutGrid className="w-3 h-3" />
                         <span className="text-[11px] font-bold uppercase tracking-wider">
                             Candidate Database
                         </span>
                      </div>
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                      Talent Pool
                  </h1>
                  <p className="text-slate-500 mt-2 font-medium">
                      Manage, search, and analyze your processed candidate profiles.
                  </p>
              </div>
              
              <div className="flex items-center gap-3">
                  <button 
                    onClick={fetchCandidates}
                    className="p-3 bg-white text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
                    title="Refresh List"
                  >
                      <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
                  </button>
                  <button 
                    onClick={() => navigate('/hr/upload')}
                    className="group flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
                  >
                      <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                      <span>Add Resume</span>
                  </button>
              </div>
          </div>

          {/* --- Toolbar --- */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center sticky top-4 z-10">
              <div className="relative flex-1 w-full group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search by name, email, or skill..." 
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 focus:bg-white transition-all font-medium text-slate-700 placeholder:text-slate-400"
                    value={localSearch}
                    onChange={(e) => {
                        setLocalSearch(e.target.value);
                        setSearchParams({ q: e.target.value });
                    }}
                  />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                  <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 flex items-center gap-2 whitespace-nowrap">
                      <Users className="w-4 h-4 text-indigo-600" />
                      {filteredCandidates.length} <span className="font-normal text-slate-500">Results</span>
                  </div>
                  <button className="flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors bg-white">
                      <Filter className="w-4 h-4" /> Filter
                  </button>
                  <button className="flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors bg-white">
                      <Download className="w-4 h-4" /> Export
                  </button>
              </div>
          </div>

          {/* --- Main Content --- */}
          {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                  <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
                  <p className="text-slate-400 font-medium animate-pulse">Scanning database...</p>
              </div>
          ) : filteredCandidates.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 border-dashed p-20 flex flex-col items-center justify-center text-center shadow-sm">
                  <div className="p-4 bg-slate-50 rounded-full mb-6 border border-slate-100">
                     {localSearch ? <Search className="w-10 h-10 text-slate-300" /> : <FolderOpen className="w-10 h-10 text-slate-300" />}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                     {localSearch ? 'No matches found' : 'Talent pool is empty'}
                  </h3>
                  <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">
                    {localSearch 
                      ? `We couldn't find any candidates matching "${localSearch}". Try different keywords.` 
                      : "Upload resumes to the system to start building your talent pool."}
                  </p>
                  {!localSearch && (
                     <button 
                        onClick={() => navigate('/hr/upload')}
                        className="text-indigo-600 font-bold hover:text-indigo-800 hover:underline transition-colors"
                     >
                        Upload your first resume
                     </button>
                  )}
              </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCandidates.map(candidate => (
                   <div key={candidate.id} className="h-full">
                      <ResumeCard 
                          candidate={candidate} 
                          onDelete={handleDelete}
                          onView={(c) => setSelectedCandidate(c)}
                      />
                   </div>
                ))}
             </div>
          )}
       </div>
    </div>
  );
};

export default ResumesList;