import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { Plus, Search, Building2, Globe, MoreHorizontal } from 'lucide-react';

const CompanyList: React.FC = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/companies')
       .then(res => setCompanies(res.data))
       .catch(console.error)
       .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex justify-between items-end">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Tenants</h1>
                <p className="text-slate-500 text-sm mt-1">Manage registered organizations.</p>
            </div>
            <button 
                onClick={() => navigate('/admin/companies/new')}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm"
            >
                <Plus className="w-4 h-4" /> Register Tenant
            </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center gap-3">
                <Search className="w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search companies..." 
                    className="flex-1 outline-none text-sm text-slate-700 placeholder-slate-400"
                />
            </div>
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-3 w-1/3">Company Name</th>
                        <th className="px-6 py-3">Domain</th>
                        <th className="px-6 py-3">Plan</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {loading ? (
                        <tr><td colSpan={4} className="p-8 text-center text-slate-400">Loading tenants...</td></tr>
                    ) : companies.length === 0 ? (
                        <tr><td colSpan={4} className="p-8 text-center text-slate-400">No companies found.</td></tr>
                    ) : (
                        companies.map(c => (
                            <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 rounded text-slate-500"><Building2 className="w-4 h-4" /></div>
                                    {c.name}
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {c.domain ? <div className="flex items-center gap-2"><Globe className="w-3 h-3" /> {c.domain}</div> : '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-bold text-slate-600">
                                        {c.plan_tier}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default CompanyList;