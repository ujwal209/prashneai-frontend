import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { Loader2, ArrowLeft, Building2 } from 'lucide-react';

const CreateCompany: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', domain: '', plan_tier: 'FREE' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        await api.post('/admin/companies', formData);
        navigate('/admin/companies');
    } catch (error) {
        alert("Failed to create company");
        setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button onClick={() => navigate('/admin/companies')} className="text-slate-500 hover:text-slate-800 text-sm font-bold flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Tenants
        </button>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    Register New Tenant
                </h1>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Company Name</label>
                    <input 
                        required
                        type="text" 
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
                        placeholder="e.g. Acme Corp"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Domain (Optional)</label>
                    <input 
                        type="text" 
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
                        placeholder="e.g. acme.com"
                        value={formData.domain}
                        onChange={e => setFormData({...formData, domain: e.target.value})}
                    />
                    <p className="text-xs text-slate-500">Used for auto-onboarding users with matching email domains.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Subscription Tier</label>
                    <select 
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none bg-white"
                        value={formData.plan_tier}
                        onChange={e => setFormData({...formData, plan_tier: e.target.value})}
                    >
                        <option value="FREE">Free Tier</option>
                        <option value="PRO">Pro Plan</option>
                        <option value="ENTERPRISE">Enterprise</option>
                    </select>
                </div>

                <div className="pt-4 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all shadow-sm disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Register Tenant'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default CreateCompany;