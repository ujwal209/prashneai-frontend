import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { 
  UserPlus, 
  Mail, 
  Building2, 
  Key, 
  Copy, 
  Check, 
  Shield, 
  Loader2,
  AlertCircle,
  CheckCircle2,
  UserCheck
} from 'lucide-react';

interface Company {
  id: string;
  name: string;
}

interface UserForm {
    email: string;
    full_name: string;
    company_id: string;
    role: string;
    password: string;
}

const UserProvisioning: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [formData, setFormData] = useState<UserForm>({ 
        email: '', 
        full_name: '', 
        company_id: '',
        role: 'hr_admin',
        password: '' 
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        api.get('/admin/companies').then(res => setCompanies(res.data)).catch(console.error);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear message when user starts typing again
        if (message) setMessage(null);
    };

    const copyPassword = () => {
        navigator.clipboard.writeText(formData.password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            await api.post('/admin/users', formData);
            setMessage({ type: 'success', text: 'HR Account successfully provisioned.' });
            setFormData({ email: '', full_name: '', company_id: '', role: 'hr_admin', password: '' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error: any) {
             const errMsg = error.response?.data?.detail || "Failed to create user";
             setMessage({ type: 'error', text: errMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
             
             {/* --- Header --- */}
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-2 px-3 py-1 bg-white text-slate-600 rounded-full border border-slate-200 shadow-sm">
                            <UserCheck className="w-3 h-3 text-indigo-600" />
                            <span className="text-[11px] font-bold uppercase tracking-wider">
                                Access Management
                            </span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Provisioning</h1>
                    <p className="mt-2 text-slate-500 font-medium">
                        Manually generate secure access credentials for HR Administrators and Staff.
                    </p>
                </div>
             </div>

            {/* --- Main Form Card --- */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative">
                
                {/* Decorative Top Border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600" />
                
                <div className="p-8 md:p-10">
                    
                    {/* Status Message */}
                    {message && (
                        <div className={`mb-8 p-4 rounded-lg flex items-start gap-3 border animate-in slide-in-from-top-2 ${
                            message.type === 'success' 
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                : 'bg-red-50 text-red-800 border-red-200'
                        }`}>
                            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" /> : <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />}
                            <div className="font-semibold text-sm pt-0.5">{message.text}</div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                             
                             {/* Full Name */}
                             <div className="space-y-1.5 group">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                <input 
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Sarah Connor"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium placeholder:text-slate-400 bg-white"
                                />
                             </div>

                             {/* Email Address */}
                             <div className="space-y-1.5 group">
                                  <label className="block text-sm font-bold text-slate-700 ml-1">Work Email</label>
                                  <div className="relative">
                                     <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                     <input 
                                         type="email"
                                         name="email"
                                         value={formData.email}
                                         onChange={handleChange}
                                         required
                                         placeholder="user@company.com"
                                         className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium placeholder:text-slate-400 bg-white"
                                     />
                                  </div>
                             </div>

                             {/* Company Selection */}
                             <div className="space-y-1.5 group">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Assign Tenant</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <select 
                                        name="company_id"
                                        value={formData.company_id}
                                        onChange={handleChange}
                                        required
                                        className="w-full appearance-none rounded-lg border border-slate-300 pl-10 pr-10 py-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium text-slate-700 bg-white cursor-pointer"
                                    >
                                        <option value="">Select Organization</option>
                                        {companies.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-3.5 pointer-events-none border-l border-slate-300 pl-2">
                                        <div className="w-2 h-2 border-r-2 border-b-2 border-slate-400 rotate-45 mb-0.5"></div>
                                    </div>
                                </div>
                             </div>

                             {/* Role Selection */}
                             <div className="space-y-1.5 group">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Access Role</label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <select 
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        required
                                        className="w-full appearance-none rounded-lg border border-slate-300 pl-10 pr-10 py-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium text-slate-700 bg-white cursor-pointer"
                                    >
                                        <option value="hr_admin">HR Admin (Full Control)</option>
                                        <option value="hr_user">HR User (Restricted)</option>
                                    </select>
                                    <div className="absolute right-3 top-3.5 pointer-events-none border-l border-slate-300 pl-2">
                                        <div className="w-2 h-2 border-r-2 border-b-2 border-slate-400 rotate-45 mb-0.5"></div>
                                    </div>
                                </div>
                             </div>

                            {/* Password Section */}
                            <div className="md:col-span-2 bg-slate-50 rounded-xl p-6 border border-slate-200">
                                 <label className="block text-sm font-bold text-slate-700 mb-3">Temporary Credentials</label>
                                 <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1 group">
                                        <Key className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                        <input 
                                            type="text" 
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            minLength={8}
                                            placeholder="Create a secure password..."
                                            className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-mono text-slate-700 bg-white text-sm"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={copyPassword}
                                        className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all border text-sm ${
                                            copied 
                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                                            : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400'
                                        }`}
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        <span>{copied ? 'Copied' : 'Copy'}</span>
                                    </button>
                                 </div>
                                 <div className="mt-3 flex items-start gap-2 text-xs text-slate-500 font-medium">
                                     <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                                     <p>Please copy and share this password securely with the user immediately. It cannot be retrieved later.</p>
                                 </div>
                             </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
                            <button 
                                type="button"
                                onClick={() => setFormData({ email: '', full_name: '', company_id: '', role: 'hr_admin', password: '' })}
                                className="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            >
                                Reset Form
                            </button>
                            <button 
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white text-sm font-bold bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Provisioning...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4" /> Create Account
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProvisioning;