import React, { useState, useEffect } from 'react';
import { useSearchParams, NavLink, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Plus, 
  Loader2, 
  Trash2, 
  Search,
  ArrowRight,
  Filter,
  Clock,
  LayoutGrid
} from 'lucide-react';

const JobsList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const paramQuery = searchParams.get('q') || '';
  
  // Local state for immediate search feedback
  const [localSearch, setLocalSearch] = useState(paramQuery);
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Fetch Jobs
  useEffect(() => {
    setLoading(true);
    api.get('/jobs')
      .then(res => setJobs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Update local search if params change externally
  useEffect(() => {
    setLocalSearch(paramQuery);
  }, [paramQuery]);

  // Delete Handler
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent navigation
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    setIsDeleting(id);
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(prev => prev.filter(j => j.id !== id));
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Failed to delete job");
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredJobs = jobs.filter(job => 
      job.title.toLowerCase().includes(localSearch.toLowerCase()) ||
      (job.description && job.description.toLowerCase().includes(localSearch.toLowerCase())) ||
      (job.location && job.location.toLowerCase().includes(localSearch.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12 pt-6 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
               <div className="flex items-center gap-2 mb-2">
                   <div className="flex items-center gap-2 px-3 py-1 bg-white text-slate-600 rounded-full border border-slate-200 shadow-sm">
                      <LayoutGrid className="w-3 h-3" />
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                          Recruitment Ops
                      </span>
                   </div>
               </div>
               <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Active Opportunities</h1>
               <p className="text-slate-500 mt-2 font-medium">Manage your open roles, requirements, and hiring status.</p>
            </div>
            
            <button 
              onClick={() => navigate('/hr/jobs/new')}
              className="group flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> 
              <span>Post New Job</span>
            </button>
        </div>

        {/* --- Toolbar / Search --- */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Filter by title, location, or keyword..." 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 focus:bg-white transition-all font-medium text-slate-700 placeholder:text-slate-400"
                  value={localSearch}
                  onChange={(e) => {
                      setLocalSearch(e.target.value);
                      setSearchParams({ q: e.target.value });
                  }}
                />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors bg-white">
                    <Filter className="w-4 h-4" /> Filters
                </button>
            </div>
        </div>

        {/* --- Content Area --- */}
        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="h-64 bg-slate-200 rounded-xl animate-pulse"></div>
               ))}
            </div>
        ) : filteredJobs.length === 0 ? (
           <div className="bg-white rounded-xl border border-dashed border-slate-300 p-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                 <Briefcase className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No active listings found</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">
                {localSearch ? `No matches found for "${localSearch}". Try adjusting your search terms.` : "You haven't posted any jobs yet. Create your first listing to start hiring."}
              </p>
              {!localSearch && (
                <button 
                  onClick={() => navigate('/hr/jobs/new')}
                  className="text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-2 px-6 py-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all"
                >
                  Create Job Post <ArrowRight className="w-4 h-4" />
                </button>
              )}
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <NavLink 
                to={`/hr/jobs/edit/${job.id}`}
                key={job.id} 
                className="group relative bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 flex flex-col h-full cursor-pointer"
              >
                {/* Top Row: Icon & Status */}
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-slate-50 rounded-lg text-slate-600 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                           Active
                        </span>
                        
                        {/* Delete Button (Visible on Hover) */}
                        <div className="flex gap-1 pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={(e) => e.preventDefault()}>
                             <button 
                               onClick={(e) => handleDelete(e, job.id)}
                               className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                               title="Delete Job"
                             >
                                 {isDeleting === job.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                             </button>
                        </div>
                    </div>
                </div>
                
                {/* Main Info */}
                <div className="mb-6 flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {job.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 font-medium">
                    {job.description || "No description provided."}
                  </p>
                </div>

                {/* Metadata Tags */}
                <div className="space-y-4 pt-5 border-t border-slate-100 mt-auto">
                    <div className="flex flex-wrap gap-2">
                      {job.location && (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
                             <MapPin className="w-3.5 h-3.5 text-slate-400" /> 
                             {job.location}
                          </div>
                      )}
                      {job.salary && (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
                             <DollarSign className="w-3.5 h-3.5 text-slate-400" /> 
                             {job.salary}
                          </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                        <div className="flex items-center gap-1.5">
                           <Clock className="w-3.5 h-3.5" /> 
                           <span>Posted {new Date(job.created_at || Date.now()).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
                        </div>
                        <div className="flex items-center gap-1 text-indigo-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 font-bold">
                            Edit <ArrowRight className="w-3 h-3" />
                        </div>
                    </div>
                </div>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsList;