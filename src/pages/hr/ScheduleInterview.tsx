import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { 
  Briefcase, 
  Users, 
  Settings, 
  Video, 
  Calendar,
  ArrowRight,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

const ScheduleInterview: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  
  const [selectedJob, setSelectedJob] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
      Promise.all([
          api.get('/jobs'),
          api.get('/resumes')
      ]).then(([jobsRes, candidatesRes]) => {
          setJobs(jobsRes.data);
          setCandidates(candidatesRes.data);
      }).catch(console.error)
        .finally(() => setInitLoading(false));
  }, []);

  const handleSchedule = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!selectedJob || !selectedCandidate) return;

      setLoading(true);
      try {
          const res = await api.post('/interviews', {
              job_id: selectedJob,
              resume_id: selectedCandidate
          });
          const sessionId = res.data.session_id;
          alert("Interview Scheduled Successfully!");
          navigate('/hr/interviews');
      } catch (error) {
          console.error(error);
          alert("Failed to schedule interview.");
      } finally {
          setLoading(false);
      }
  };

  if (initLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12 pt-6 px-4">
        <div className="max-w-3xl mx-auto">
            
            {/* Back Navigation */}
            <button 
              onClick={() => navigate('/hr/interviews')}
              className="text-slate-500 hover:text-indigo-600 font-bold text-sm flex items-center gap-2 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Interviews
            </button>

            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex items-center gap-5 bg-slate-50/50">
                    <div className="p-4 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-200">
                        <Video className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Schedule Interview</h1>
                        <p className="text-slate-500 font-medium mt-1">Configure a new AI-led assessment session.</p>
                    </div>
                </div>

                <form onSubmit={handleSchedule} className="p-8 space-y-8">
                    
                    {/* Job Selection */}
                    <div className="space-y-1.5 group">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            Target Job Role
                        </label>
                        <div className="relative">
                            <select 
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg font-medium text-slate-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all appearance-none"
                                value={selectedJob}
                                onChange={(e) => setSelectedJob(e.target.value)}
                                required
                            >
                                <option value="">Select a job position...</option>
                                {jobs.map(j => (
                                    <option key={j.id} value={j.id}>{j.title}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ArrowRight className="w-4 h-4 text-slate-400" />
                            </div>
                        </div>
                    </div>

                    {/* Candidate Selection */}
                    <div className="space-y-1.5 group">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            Candidate
                        </label>
                        <div className="relative">
                            <select 
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg font-medium text-slate-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all appearance-none"
                                value={selectedCandidate}
                                onChange={(e) => setSelectedCandidate(e.target.value)}
                                required
                            >
                                <option value="">Select a candidate...</option>
                                {candidates.map(c => (
                                    <option key={c.id} value={c.id}>{c.candidate_name || c.email || 'Unknown Candidate'}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ArrowRight className="w-4 h-4 text-slate-400" />
                            </div>
                        </div>
                    </div>

                    {/* AI Configuration Box */}
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                            <Settings className="w-4 h-4 text-indigo-600" />
                            AI Configuration
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-not-allowed opacity-60">
                                <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                                <span className="text-sm font-medium text-slate-600">Strict Evaluation</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg cursor-default shadow-sm">
                                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                                <span className="text-sm font-bold text-indigo-900">Standard Interview</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>AI will adapt questions based on the uploaded resume and job description.</span>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-6 flex items-center justify-end gap-3 border-t border-slate-100">
                        <button 
                            type="button" 
                            onClick={() => navigate('/hr/interviews')}
                            className="px-6 py-2.5 rounded-lg font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={loading || !selectedJob || !selectedCandidate}
                            className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calendar className="w-5 h-5" />}
                            Create Session
                        </button>
                    </div>

                </form>
            </div>
        </div>
    </div>
  );
};

export default ScheduleInterview;