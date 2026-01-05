import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, User, Mail, Shield } from 'lucide-react';
// import api from '../../lib/api'; // Uncomment when endpoint exists

const UserList: React.FC = () => {
  const navigate = useNavigate();
  // Mock data for now as GET /admin/users endpoint was missing in context
  const [users, setUsers] = useState<any[]>([
      { id: '1', full_name: 'Sarah Connor', email: 'sarah@acme.com', role: 'hr_admin', company_name: 'Acme Corp' },
      { id: '2', full_name: 'John Doe', email: 'john@tech.com', role: 'hr_user', company_name: 'Tech Global' },
  ]); 

  /* useEffect(() => {
     api.get('/admin/users').then(res => setUsers(res.data));
  }, []);
  */

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex justify-between items-end">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
                <p className="text-slate-500 text-sm mt-1">Provision and manage HR accounts.</p>
            </div>
            <button 
                onClick={() => navigate('/admin/users/new')}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm"
            >
                <Plus className="w-4 h-4" /> Provision User
            </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center gap-3">
                <Search className="w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search users..." className="flex-1 outline-none text-sm text-slate-700" />
            </div>
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-3">User</th>
                        <th className="px-6 py-3">Role</th>
                        <th className="px-6 py-3">Company</th>
                        <th className="px-6 py-3 text-right">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">{u.full_name}</div>
                                        <div className="text-xs text-slate-400 flex items-center gap-1"><Mail className="w-3 h-3" /> {u.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100 text-xs font-bold w-fit">
                                    <Shield className="w-3 h-3" /> {u.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600 font-medium">{u.company_name}</td>
                            <td className="px-6 py-4 text-right">
                                <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">Active</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default UserList;