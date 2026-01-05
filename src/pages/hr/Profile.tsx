import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Shield, 
  Building2, 
  MapPin, 
  Phone, 
  Calendar, 
  Camera, 
  Edit2,
  CheckCircle2,
  LogOut,
  Fingerprint
} from 'lucide-react';

const Profile: React.FC = () => {
    const { user, signOut } = useAuth();
    
    // Formatting helper
    const roleName = user?.user_metadata?.role 
        ? user.user_metadata.role.replace('_', ' ').toUpperCase() 
        : (user?.app_metadata?.role || 'HR STAFF').replace('_', ' ').toUpperCase();
        
    const initial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';
    const joinDate = new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-12 animate-in fade-in duration-500">
            
            {/* --- Banner Section --- */}
            <div className="h-64 bg-slate-900 relative overflow-hidden">
                {/* Subtle Professional Pattern */}
                <div className="absolute inset-0 opacity-10" 
                     style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}>
                </div>
                
                {/* Accent Line */}
                <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500"></div>
                
                <div className="absolute bottom-6 right-6 z-10">
                    <button className="group flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg text-white text-sm font-semibold hover:bg-white/20 transition-all shadow-sm">
                        <Camera className="w-4 h-4 group-hover:scale-105 transition-transform" />
                        <span>Update Cover</span>
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
                
                {/* --- Main Identity Card --- */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                    
                    <div className="p-8 sm:p-10">
                        <div className="flex flex-col md:flex-row items-start gap-8">
                            
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                <div className="w-32 h-32 rounded-xl bg-white p-1 shadow-md ring-1 ring-slate-100">
                                    <div className="w-full h-full rounded-lg bg-indigo-600 flex items-center justify-center text-5xl font-bold text-white shadow-inner">
                                        {initial}
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 -right-2">
                                    <div className="p-2 bg-white rounded-lg shadow-md border border-slate-100 text-indigo-600">
                                        <Shield className="w-4 h-4 fill-indigo-50" />
                                    </div>
                                </div>
                            </div>

                            {/* Header Info */}
                            <div className="flex-1 pt-2 md:pt-14 min-w-0">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div>
                                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                            {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                                            <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-50" />
                                        </h1>
                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm font-medium text-slate-500">
                                            <span className="flex items-center gap-1.5 text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                                <Building2 className="w-3.5 h-3.5" /> Prashne Corp
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5" /> Bengaluru, India
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" /> Joined {joinDate}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                                        <Edit2 className="w-4 h-4" />
                                        <span>Edit Profile</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* --- Details Grid --- */}
                        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* Left Column: Personal Info */}
                            <div className="lg:col-span-2 space-y-8">
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                                        Contact Information
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="group p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                                            <div className="flex items-center gap-3 mb-1">
                                                <div className="p-1.5 bg-white rounded text-slate-400 group-hover:text-indigo-600 shadow-sm border border-slate-100 transition-colors">
                                                    <Mail className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-500 uppercase">Email</span>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-900 pl-1">{user?.email}</p>
                                        </div>

                                        <div className="group p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                                            <div className="flex items-center gap-3 mb-1">
                                                <div className="p-1.5 bg-white rounded text-slate-400 group-hover:text-indigo-600 shadow-sm border border-slate-100 transition-colors">
                                                    <Phone className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-500 uppercase">Phone</span>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-900 pl-1">+91 98765 43210</p>
                                        </div>

                                        <div className="group p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                                            <div className="flex items-center gap-3 mb-1">
                                                <div className="p-1.5 bg-white rounded text-slate-400 group-hover:text-indigo-600 shadow-sm border border-slate-100 transition-colors">
                                                    <Shield className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-500 uppercase">Role</span>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-900 pl-1">{roleName}</p>
                                        </div>

                                        <div className="group p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                                            <div className="flex items-center gap-3 mb-1">
                                                <div className="p-1.5 bg-white rounded text-slate-400 group-hover:text-indigo-600 shadow-sm border border-slate-100 transition-colors">
                                                    <Fingerprint className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-500 uppercase">User ID</span>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-900 pl-1 font-mono">{user?.id?.substring(0, 18)}...</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Stats & Actions */}
                            <div className="space-y-6">
                                <div className="p-6 rounded-xl bg-slate-900 text-white shadow-lg relative overflow-hidden">
                                    {/* Decoration */}
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500 opacity-20 rounded-full blur-xl -mr-8 -mt-8"></div>
                                    
                                    <h3 className="font-bold text-white mb-4 relative z-10 text-sm uppercase tracking-wide">Profile Strength</h3>
                                    <div className="relative pt-1 z-10">
                                        <div className="flex mb-2 items-center justify-between">
                                            <span className="text-xs font-bold inline-block text-indigo-600 bg-white px-2 py-0.5 rounded">
                                                80%
                                            </span>
                                        </div>
                                        <div className="overflow-hidden h-1.5 mb-4 text-xs flex rounded-full bg-slate-700">
                                            <div style={{ width: "80%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"></div>
                                        </div>
                                        <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                            Complete your profile by adding your LinkedIn URL to reach 100%.
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-slate-200 p-5 bg-white">
                                    <h3 className="font-bold text-slate-900 mb-4 text-sm">Account Actions</h3>
                                    <button 
                                        onClick={signOut}
                                        className="w-full py-2.5 text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-sm"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out Securely
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;