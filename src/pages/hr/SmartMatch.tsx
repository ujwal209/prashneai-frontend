import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import CandidateMatchCard from '../../components/CandidateMatchCard';
import { 
  Search, 
  Loader2, 
  Sparkles, 
  BrainCircuit, 
  Users, 
  CheckCircle2, 
  Briefcase,
  X,
  ChevronDown,
  Filter,
  LayoutGrid
} from 'lucide-react';

interface MatchResult {
  candidate_id: string;
  candidate_name: string;
  score: number;
  reason: string;
  missing_skills: string[];
}

const SmartMatch: React.FC = () => {
  const [jdText, setJdText] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [results, setResults] = useState<MatchResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  
  // Selection State
  const [showCandidateSelector, setShowCandidateSelector] = useState(false);
  const [allCandidates, setAllCandidates] = useState<any[]>([]);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  useEffect(() => {
    api.get('/jobs')
       .then(res => setJobs(res.data))
       .catch(err => console.error("Failed to load jobs", err));
  }, []);

  const handleJobSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const jobId = e.target.value;
      if (!jobId) return;

      const job = jobs.find(j => j.id === jobId);
      if (job) {
          setSelectedJobId(jobId);
          const fullJd = `
Role: ${job.title}
Location: ${job.location || 'Not specified'}
Salary: ${job.salary || 'Not specified'}

Description:
${job.description}

Requirements:
${Array.isArray(job.requirements) ? job.requirements.join('\n- ') : job.requirements}
          `.trim();
          
          setJdText(fullJd);
      }
  };

  const toggleCandidateSelection = async () => {
      if (!showCandidateSelector) {
          setLoadingCandidates(true);
          try {
              const res = await api.get('/resumes');
              setAllCandidates(res.data);
              // Default to selecting all if none selected previously
              if(selectedCandidateIds.length === 0) {
                  setSelectedCandidateIds(res.data.map((c: any) => c.id));
              }
          } catch(e) {
              console.error(e);
          } finally {
              setLoadingCandidates(false);
          }
      }
      setShowCandidateSelector(!showCandidateSelector);
  };

  const handleSelectCandidate = (id: string) => {
      if (selectedCandidateIds.includes(id)) {
          setSelectedCandidateIds(prev => prev.filter(c => c !== id));
      } else {
          setSelectedCandidateIds(prev => [...prev, id]);
      }
  };

  const handleMatch = async () => {
    if (!jdText.trim()) return;
    
    setIsAnalyzing(true);
    setResults([]);
    setHasSearched(true);
    setShowCandidateSelector(false);
    
    try {
      const payload: any = { 
          jd_text: jdText,
          job_id: selectedJobId || null
      };

      if (selectedCandidateIds.length > 0) {
          payload.candidate_ids = selectedCandidateIds;
      }

      const res = await api.post('/jobs/match', payload);
      setResults(res.data);
    } catch (error) {
      console.error("Match error", error);
      alert("Analysis failed. Please ensure the backend AI service is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreateInterview = async (candidateId: string) => {
      if (!selectedJobId) {
          alert("Please select a job first.");
          return;
      }
      try {
          const res = await api.post('/interviews', {
              job_id: selectedJobId,
              candidate_id: candidateId
          });
          const sessionId = res.data.session_id;
          alert(`Interview Session Created! Session ID: ${sessionId}`);
      } catch (error) {
          console.error("Failed to create interview", error);
          alert("Failed to create interview session.");
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
       
       {/* --- Modal Overlay for Candidate Selection --- */}
       {showCandidateSelector && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
               <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowCandidateSelector(false)} />
               <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
                   
                   {/* Modal Header */}
                   <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white z-10">
                       <div>
                           <h3 className="text-xl font-bold text-slate-900">Select Candidates</h3>
                           <p className="text-sm text-slate-500 font-medium">Choose which profiles to include in the AI analysis.</p>
                       </div>
                       <button 
                         onClick={() => setShowCandidateSelector(false)}
                         className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                       >
                           <X className="w-6 h-6" />
                       </button>
                   </div>

                   {/* Modal Toolbar */}
                   <div className="px-8 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex gap-3">
                             <button 
                               onClick={() => setSelectedCandidateIds(allCandidates.map(c => c.id))}
                               className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm"
                             >
                                Select All
                             </button>
                             <button 
                               onClick={() => setSelectedCandidateIds([])}
                               className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:border-red-300 hover:text-red-600 transition-all shadow-sm"
                             >
                                Clear Selection
                             </button>
                        </div>
                        <span className="text-sm font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-100">
                            {selectedCandidateIds.length} Selected
                        </span>
                   </div>

                   {/* Modal Content Grid */}
                   <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                        {loadingCandidates ? (
                            <div className="h-full flex flex-col items-center justify-center">
                                <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
                                <p className="text-slate-400 font-medium">Loading candidate pool...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {allCandidates.map(c => {
                                    const isSelected = selectedCandidateIds.includes(c.id);
                                    return (
                                        <div 
                                            key={c.id} 
                                            onClick={() => handleSelectCandidate(c.id)}
                                            className={`
                                                relative cursor-pointer transition-all duration-200 rounded-xl border p-4 group bg-white
                                                ${isSelected 
                                                    ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-md' 
                                                    : 'border-slate-200 hover:border-indigo-300 hover:shadow-sm'
                                                }
                                            `}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm shrink-0 border border-slate-200">
                                                    {c.candidate_name ? c.candidate_name.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className={`font-bold text-sm truncate ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                                                        {c.candidate_name || 'Unknown Candidate'}
                                                    </h4>
                                                    <p className="text-xs text-slate-500 truncate">{c.email || 'No email'}</p>
                                                </div>
                                            </div>
                                            
                                            {/* Selection Check */}
                                            {isSelected && (
                                                <div className="absolute top-3 right-3 text-indigo-600">
                                                    <CheckCircle2 className="w-5 h-5 fill-indigo-50" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                   </div>

                   {/* Modal Footer */}
                   <div className="p-6 border-t border-slate-200 bg-white flex justify-end gap-3">
                       <button 
                         onClick={() => setShowCandidateSelector(false)}
                         className="px-6 py-2.5 rounded-lg text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                       >
                           Cancel
                       </button>
                       <button 
                         onClick={() => setShowCandidateSelector(false)}
                         className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all shadow-sm active:scale-95"
                       >
                           Confirm Selection
                       </button>
                   </div>
               </div>
           </div>
       )}


       <div className="max-w-[1600px] mx-auto px-6 pt-8">
           {/* --- Page Header --- */}
           <div className="mb-8">
               <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                   <div className="p-2 bg-indigo-600 rounded-lg shadow-sm">
                       <BrainCircuit className="w-8 h-8 text-white" />
                   </div>
                   Smart Match AI
               </h1>
               <p className="text-slate-500 mt-2 text-lg ml-1 font-medium max-w-2xl">
                   Leverage LLMs to rank your talent pool against specific job requirements with semantic understanding.
               </p>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-start">
               
               {/* --- Left Column: Configuration (Sticky) --- */}
               <div className="lg:col-span-4 space-y-6 sticky top-6">
                   <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                       <div className="p-5 border-b border-slate-100 bg-slate-50">
                           <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                               <Filter className="w-4 h-4 text-indigo-600" />
                               Match Configuration
                           </h2>
                       </div>
                       
                       <div className="p-6 space-y-6">
                           
                           {/* Job Selector */}
                           <div className="space-y-1.5">
                               <label className="text-sm font-bold text-slate-700">Select Job Profile</label>
                               <div className="relative group">
                                   <select 
                                       className="w-full pl-4 pr-10 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none appearance-none transition-all cursor-pointer hover:border-slate-300"
                                       onChange={handleJobSelect}
                                       defaultValue=""
                                   >
                                       <option value="" disabled>-- Choose a Job --</option>
                                       {jobs.map(job => (
                                           <option key={job.id} value={job.id}>{job.title}</option>
                                       ))}
                                   </select>
                                   <Briefcase className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-indigo-600 transition-colors" />
                               </div>
                           </div>

                           {/* Candidate Selector */}
                           <div className="space-y-1.5">
                               <label className="text-sm font-bold text-slate-700">Candidate Pool</label>
                               <button 
                                   onClick={toggleCandidateSelection}
                                   className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all group text-left"
                               >
                                   <div className="flex items-center gap-3">
                                       <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                           <Users className="w-4 h-4" />
                                       </div>
                                       <div>
                                           <p className="font-bold text-slate-800 text-sm">Select Candidates</p>
                                           <p className="text-xs text-slate-500 font-medium mt-0.5">
                                               {selectedCandidateIds.length > 0 ? <span className="text-indigo-600 font-bold">{selectedCandidateIds.length} profiles selected</span> : 'Entire talent pool'}
                                           </p>
                                       </div>
                                   </div>
                                   <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                               </button>
                           </div>

                           {/* JD Text Area */}
                           <div className="space-y-1.5">
                               <div className="flex justify-between items-center px-1">
                                   <label className="text-sm font-bold text-slate-700">Job Description</label>
                                   <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-wide">Required</span>
                               </div>
                               <textarea 
                                   className="w-full h-48 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm leading-relaxed text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 focus:bg-white outline-none resize-none transition-all"
                                   placeholder="Paste the job description, requirements, and responsibilities here..."
                                   value={jdText}
                                   onChange={(e) => setJdText(e.target.value)}
                               />
                           </div>

                           {/* Action Button */}
                           <button 
                               onClick={handleMatch}
                               disabled={isAnalyzing || !jdText}
                               className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-lg shadow-sm hover:bg-indigo-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                           >
                               {isAnalyzing ? (
                                   <>
                                       <Loader2 className="w-5 h-5 animate-spin" />
                                       <span>Analyzing...</span>
                                   </>
                               ) : (
                                   <>
                                       <Sparkles className="w-5 h-5" />
                                       <span>Run Match Analysis</span>
                                   </>
                               )}
                           </button>
                       </div>
                   </div>
               </div>

               {/* --- Right Column: Results --- */}
               <div className="lg:col-span-8 space-y-6">
                   <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Analysis Results</h2>
                        {results.length > 0 && (
                            <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-sm font-bold text-slate-600 shadow-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                {results.length} Matches Found
                            </span>
                        )}
                   </div>

                   <div className="min-h-[500px]">
                       {isAnalyzing ? (
                           <div className="h-[500px] flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm">
                               <div className="relative w-20 h-20 mb-6">
                                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <BrainCircuit className="w-8 h-8 text-indigo-600 animate-pulse" />
                                    </div>
                               </div>
                               <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing Profiles</h3>
                               <p className="text-slate-500 font-medium">Our AI is semantically comparing skills and experience...</p>
                           </div>
                       ) : !hasSearched ? (
                           <div className="h-[500px] flex flex-col items-center justify-center bg-white rounded-xl border-2 border-dashed border-slate-300 text-center p-8">
                               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                                   <LayoutGrid className="w-10 h-10 text-slate-300" />
                               </div>
                               <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to Match</h3>
                               <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8">
                                   Select a job profile on the left to start ranking your candidate pool.
                               </p>
                               <div className="flex gap-3 text-sm font-semibold text-slate-400">
                                   <div className="px-3 py-1.5 bg-slate-50 rounded border border-slate-100">✨ AI Scoring</div>
                                   <div className="px-3 py-1.5 bg-slate-50 rounded border border-slate-100">📊 Skill Gap Analysis</div>
                               </div>
                           </div>
                       ) : results.length === 0 ? (
                           <div className="h-[500px] flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
                               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                   <Search className="w-10 h-10 text-slate-300" />
                               </div>
                               <h3 className="text-xl font-bold text-slate-900 mb-2">No High Matches Found</h3>
                               <p className="text-slate-500 font-medium max-w-sm mx-auto">
                                   None of the selected candidates met the matching threshold. Try relaxing the requirements in your job description.
                               </p>
                           </div>
                       ) : (
                           <div className="space-y-5">
                               {results.map((r, index) => (
                                   <div key={r.candidate_id} className="animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                                       <CandidateMatchCard 
                                          candidateName={r.candidate_name}
                                          score={r.score}
                                          reason={r.reason}
                                          missingSkills={r.missing_skills}
                                          candidateId={r.candidate_id}
                                          onInterview={() => handleCreateInterview(r.candidate_id)}
                                       />
                                   </div>
                               ))}
                           </div>
                       )}
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
};

export default SmartMatch;