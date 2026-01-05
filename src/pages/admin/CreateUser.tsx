import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { ArrowLeft, UserPlus, Loader2, Copy, Check, AlertCircle } from 'lucide-react';

const CreateUser: React.FC = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<any[]>([]);
  const [formData, setFormData] = useState({ 
      email: '', full_name: '', company_id: '', role: 'hr_admin', password: '' 
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
      api.get('/admin/companies').then(res => setCompanies(res.data || [])).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<any>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
          await api.post('/admin/users', formData);
          setSuccess(true);
          window.scrollTo(0,0);
      } catch (error) {
          alert("Failed to provision user");
      } finally {
          setLoading(false);
      }
  };

  const copyPass = () => {
      navigator.clipboard.writeText(formData.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button onClick={() => navigate('/admin/users')} className="text-slate-500 hover:text-slate-800 text-sm font-bold flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Users
        </button>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-indigo-600" />
                    Provision New User
                </h1>
            </div>

            <div className="p-8">
                {success ? (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-6 text-center space-y-4">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                            <Check className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-emerald-800">User Successfully Provisioned</h3>
                        <p className="text-emerald-700 text-sm">The account for {formData.full_name} is ready.</p>
                        <button onClick={() => navigate('/admin/users')} className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm">
                            Done
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                                <input name="full_name" required type="text" onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                                <input name="email" required type="email" onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">Tenant</label>
                                <select name="company_id" required onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white">
                                    <option value="">Select Company</option>
                                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">Role</label>
                                <select name="role" required onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white">
                                    <option value="hr_admin">HR Admin</option>
                                    <option value="hr_user">HR User</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                            <label className="text-sm font-bold text-slate-700">Temporary Password</label>
                            <div className="flex gap-2">
                                <input name="password" required type="text" minLength={8} onChange={handleChange} className="flex-1 px-3 py-2.5 rounded-lg border border-slate-300 font-mono text-sm" placeholder="Enter secure password" />
                                <button type="button" onClick={copyPass} className="px-4 border border-slate-300 bg-white rounded-lg hover:bg-slate-50">
                                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                                </button>
                            </div>
                            <div className="flex gap-2 text-xs text-amber-600 items-start">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <p>Copy this password now. It will be emailed, but good to have a backup.</p>
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all disabled:opacity-70">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create User'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    </div>
  );
};

export default CreateUser;