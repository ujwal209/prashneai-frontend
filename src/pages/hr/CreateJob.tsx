import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../lib/api';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Plus, 
  Loader2, 
  Save, 
  Sparkles, 
  ArrowLeft,
  Wand2 
} from 'lucide-react';

const CreateJob: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary: ''
  });

  const [aiPrompt, setAiPrompt] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      setLoading(true);
      api.get('/jobs').then(res => {
         const job = res.data.find((j: any) => j.id === id);
         if (job) {
             setFormData({
                 title: job.title,
                 description: job.description,
                 requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : (job.requirements || ''),
                 location: job.location || '',
                 salary: job.salary || ''
             });
         }
      }).catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleGenerate = async () => {
      if(!aiPrompt.trim()) return;
      setGenerating(true);
      try {
          // Placeholder for AI Generation Endpoint
          const res = await api.post('/jobs/generate', { prompt: aiPrompt });
          const data = res.data;
          
          setFormData({
              title: data.title || '',
              description: data.description || '',
              requirements: Array.isArray(data.requirements) ? data.requirements.join('\n') : (data.requirements || ''),
              location: data.location || '',
              salary: data.salary || ''
          });
      } catch (err) {
          console.error("AI Gen Failed", err);
          alert("Failed to generate job description. Please ensure your backend supports this feature.");
      } finally {
          setGenerating(false);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
          ...formData,
          requirements: formData.requirements.split('\n').filter(line => line.trim() !== '')
      };
      
      if (isEditing && id) {
          await api.put(`/jobs/${id}`, payload);
      } else {
          await api.post('/jobs', payload);
      }
      navigate('/hr/jobs');
    } catch (error) {
      console.error("Failed to save job", error);
      alert("Failed to save job details.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading && isEditing && !formData.title) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
          <Loader2 className="w-10 h-10 animate-spin text-[#5F1DD6]" />
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button 
              onClick={() => navigate('/hr/jobs')} 
              className="group flex items-center text-sm font-bold text-slate-500 hover:text-[#5F1DD6] transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back to Listings
            </button>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isEditing ? 'Edit Job Posting' : 'Create New Opportunity'}
            </h1>
            <p className="text-slate-500 mt-1 font-medium">
              {isEditing ? 'Update the role details below.' : 'Define the requirements for your next hire.'}
            </p>
          </div>
        </div>

        {/* --- AI Generator Card --- */}
        <div className="relative overflow-hidden rounded-3xl p-[1px] shadow-2xl shadow-[#5F1DD6]/20 group">
            {/* Animated Border Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#5F1DD6] via-purple-500 to-[#5F1DD6] opacity-30 group-hover:opacity-50 transition-opacity duration-1000"></div>
            
            <div className="relative bg-[#0F172A] rounded-[23px] overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-[#5F1DD6] opacity-20 rounded-full blur-[80px]"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-indigo-500 opacity-20 rounded-full blur-[80px]"></div>

                <div className="relative p-8 md:p-10">
                    <div className="flex flex-col md:flex-row items-start gap-8">
                        <div className="p-4 bg-white/10 rounded-2xl shadow-inner backdrop-blur-md shrink-0 border border-white/10">
                            <Wand2 className="w-8 h-8 text-[#5F1DD6]" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                AI Job Architect <span className="px-2 py-0.5 rounded text-[10px] bg-[#5F1DD6] font-bold tracking-widest uppercase">Beta</span>
                            </h3>
                            <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                               Skip the manual drafting. Describe the role briefly (e.g., <span className="text-white font-medium italic">"Senior React Developer, $140k, Remote, must know Next.js"</span>) and let our LLM generate a structured job description instantly.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <input 
                           type="text" 
                           placeholder="Describe the ideal candidate..." 
                           className="flex-1 px-5 py-4 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-[#5F1DD6] focus:border-transparent focus:bg-slate-900 outline-none shadow-inner transition-all"
                           value={aiPrompt}
                           onChange={(e) => setAiPrompt(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                        <button 
                          type="button"
                          onClick={handleGenerate} 
                          disabled={generating || !aiPrompt}
                          className="px-8 py-4 bg-[#5F1DD6] text-white font-bold rounded-xl hover:bg-[#4a15a8] transition-all shadow-lg shadow-[#5F1DD6]/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[160px]"
                        >
                            {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Generate JD</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* --- Main Form --- */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          
          <div className="p-8 md:p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Job Title */}
                  <div className="md:col-span-2 space-y-1.5 group">
                    <label className="block text-sm font-bold text-slate-700 ml-1">Job Title</label>
                    <div className="relative transition-all duration-300 focus-within:-translate-y-0.5">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Briefcase className="h-5 w-5 text-slate-400 group-focus-within:text-[#5F1DD6] transition-colors" />
                        </div>
                        <input 
                          type="text" 
                          name="title" 
                          required
                          placeholder="e.g. Senior Backend Engineer"
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-[#5F1DD6]/10 focus:border-[#5F1DD6] focus:bg-white outline-none transition-all font-medium"
                          value={formData.title}
                          onChange={handleChange}
                        />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5 group">
                    <label className="block text-sm font-bold text-slate-700 ml-1">Location</label>
                    <div className="relative transition-all duration-300 focus-within:-translate-y-0.5">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-slate-400 group-focus-within:text-[#5F1DD6] transition-colors" />
                        </div>
                        <input 
                          type="text" 
                          name="location" 
                          placeholder="e.g. Remote / New York"
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-[#5F1DD6]/10 focus:border-[#5F1DD6] focus:bg-white outline-none transition-all font-medium"
                          value={formData.location}
                          onChange={handleChange}
                        />
                    </div>
                  </div>

                  {/* Salary */}
                  <div className="space-y-1.5 group">
                    <label className="block text-sm font-bold text-slate-700 ml-1">Salary Range</label>
                    <div className="relative transition-all duration-300 focus-within:-translate-y-0.5">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <DollarSign className="h-5 w-5 text-slate-400 group-focus-within:text-[#5F1DD6] transition-colors" />
                        </div>
                        <input 
                          type="text" 
                          name="salary" 
                          placeholder="e.g. $120k - $150k"
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-[#5F1DD6]/10 focus:border-[#5F1DD6] focus:bg-white outline-none transition-all font-medium"
                          value={formData.salary}
                          onChange={handleChange}
                        />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-sm font-bold text-slate-700 ml-1">Job Description</label>
                    <textarea 
                      name="description" 
                      required
                      rows={6}
                      placeholder="Describe the role responsibilities, company culture, and perks..."
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-[#5F1DD6]/10 focus:border-[#5F1DD6] focus:bg-white outline-none transition-all resize-y leading-relaxed"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Requirements */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-sm font-bold text-slate-700 ml-1">
                        Requirements <span className="text-slate-400 font-normal ml-1">(One per line)</span>
                    </label>
                    <div className="relative">
                        <textarea 
                          name="requirements" 
                          rows={6}
                          placeholder={'5+ years React experience\nKnowledge of TypeScript\nStrong communication skills'}
                          className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-[#5F1DD6]/10 focus:border-[#5F1DD6] focus:bg-white outline-none transition-all resize-y font-mono text-sm leading-relaxed"
                          value={formData.requirements}
                          onChange={handleChange}
                        />
                         <div className="absolute top-3 right-3 pointer-events-none">
                            <div className="px-2 py-1 bg-white border border-slate-200 rounded-md shadow-sm text-[10px] font-bold text-slate-400 uppercase tracking-wide">Markdown Supported</div>
                         </div>
                    </div>
                  </div>
              </div>
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4">
              <button 
                type="button" 
                onClick={() => navigate('/hr/jobs')}
                className="px-6 py-3 rounded-xl text-slate-600 font-bold hover:text-slate-900 hover:bg-slate-200 transition-colors"
              >
                  Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-[#5F1DD6] text-white font-bold hover:bg-[#4a15a8] active:translate-y-0.5 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 flex items-center gap-2"
              >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isEditing ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {isEditing ? 'Save Changes' : 'Post Job'}
              </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateJob;