import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp, 
  Search, 
  Filter, 
  Download,
  MoreHorizontal,
  LayoutList
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LeaderboardEntry {
    user_id: string;
    name: string;
    email: string;
    role: string;
    count: number;
    rank: number;
}

const LeaderboardPage: React.FC = () => {
    const { user } = useAuth();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterPeriod, setFilterPeriod] = useState('This Month');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await api.get('/analytics/leaderboard');
                setLeaderboard(res.data);
            } catch (err) {
                console.error("Failed to load leaderboard", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    const topThree = leaderboard.slice(0, 3);
    const others = leaderboard.slice(3);

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-12 pt-6 px-4 md:px-8">
            <div className="max-w-[1200px] mx-auto space-y-8">
                
                {/* --- Header Section --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                             <div className="flex items-center gap-2 px-3 py-1 bg-white text-slate-600 rounded-full border border-slate-200 shadow-sm">
                                <Trophy className="w-3 h-3 text-indigo-600" />
                                <span className="text-[11px] font-bold uppercase tracking-wider">
                                    Top Performers
                                </span>
                             </div>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Recruiter Leaderboard
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">
                            Recognizing the top talent acquisition specialists in the team.
                        </p>
                    </div>

                    <div className="flex gap-3">
                         <div className="flex bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
                             {['This Week', 'This Month', 'All Time'].map((period) => (
                                 <button
                                     key={period}
                                     onClick={() => setFilterPeriod(period)}
                                     className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${
                                         filterPeriod === period 
                                         ? 'bg-slate-900 text-white shadow-sm' 
                                         : 'text-slate-500 hover:bg-slate-50'
                                     }`}
                                 >
                                     {period}
                                 </button>
                             ))}
                         </div>
                         <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-all shadow-sm">
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* --- Podium Section --- */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-200 rounded-xl animate-pulse"></div>)}
                    </div>
                ) : (
                    <div className="relative pt-12 pb-8">
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                            
                            {/* 2nd Place (Silver) */}
                            {topThree[1] && (
                                <div className="order-2 md:order-1 flex flex-col">
                                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                                         <div className="absolute top-0 inset-x-0 h-1 bg-slate-300" /> {/* Silver Bar */}
                                         <div className="mb-4 relative">
                                             <div className="w-16 h-16 rounded-full border-4 border-slate-100 bg-slate-50 flex items-center justify-center text-xl font-bold text-slate-600 shadow-inner">
                                                 {topThree[1].name.charAt(0)}
                                             </div>
                                             <div className="absolute -bottom-2 -right-2 bg-slate-200 text-slate-600 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border-2 border-white shadow-sm">
                                                 2
                                             </div>
                                         </div>
                                         <h3 className="font-bold text-slate-900 text-base">{topThree[1].name}</h3>
                                         <p className="text-slate-400 text-xs font-medium mb-4">{topThree[1].role}</p>
                                         <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 w-full">
                                             <div className="text-xl font-bold text-slate-900">{topThree[1].count}</div>
                                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resumes</div>
                                         </div>
                                    </div>
                                </div>
                            )}

                            {/* 1st Place (Gold) */}
                            {topThree[0] && (
                                <div className="order-1 md:order-2 flex flex-col -mt-10 md:-mt-12 z-10">
                                    <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-lg flex flex-col items-center text-center relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 ring-4 ring-slate-100/50">
                                         <div className="absolute top-0 inset-x-0 h-1.5 bg-yellow-500" /> {/* Gold Bar */}
                                         
                                         <div className="mb-5 relative">
                                             <div className="w-20 h-20 rounded-full border-4 border-yellow-100 bg-yellow-50 flex items-center justify-center text-2xl font-bold text-yellow-700 shadow-inner relative z-10">
                                                 {topThree[0].name.charAt(0)}
                                             </div>
                                             <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-yellow-500 drop-shadow-sm">
                                                 <Crown className="w-6 h-6 fill-yellow-500" />
                                             </div>
                                             <div className="absolute -bottom-3 -right-2 bg-yellow-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white shadow-md z-20">
                                                 1
                                             </div>
                                         </div>
                                         <h3 className="font-bold text-slate-900 text-lg">{topThree[0].name}</h3>
                                         <p className="text-yellow-700/80 text-xs font-bold mb-5 bg-yellow-50 px-2 py-0.5 rounded-full">{topThree[0].role}</p>
                                         
                                         <div className="bg-slate-900 text-white px-6 py-3 rounded-lg w-full shadow-lg shadow-slate-900/10">
                                             <div className="text-3xl font-bold">{topThree[0].count}</div>
                                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Processed</div>
                                         </div>
                                    </div>
                                </div>
                            )}

                            {/* 3rd Place (Bronze) */}
                            {topThree[2] && (
                                <div className="order-3 md:order-3 flex flex-col">
                                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                                         <div className="absolute top-0 inset-x-0 h-1 bg-orange-400" /> {/* Bronze Bar */}
                                         <div className="mb-4 relative">
                                             <div className="w-16 h-16 rounded-full border-4 border-orange-100 bg-orange-50 flex items-center justify-center text-xl font-bold text-orange-800 shadow-inner">
                                                 {topThree[2].name.charAt(0)}
                                             </div>
                                             <div className="absolute -bottom-2 -right-2 bg-orange-100 text-orange-800 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border-2 border-white shadow-sm">
                                                 3
                                             </div>
                                         </div>
                                         <h3 className="font-bold text-slate-900 text-base">{topThree[2].name}</h3>
                                         <p className="text-slate-400 text-xs font-medium mb-4">{topThree[2].role}</p>
                                         <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 w-full">
                                             <div className="text-xl font-bold text-slate-900">{topThree[2].count}</div>
                                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resumes</div>
                                         </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- List View for Others --- */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                            <LayoutList className="w-4 h-4 text-slate-500" />
                            Full Standings
                        </h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search member..." 
                                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none shadow-sm transition-all w-64"
                            />
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                    <th className="px-6 py-3 w-20 text-center">Rank</th>
                                    <th className="px-6 py-3">Team Member</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3 text-right">Activity Score</th>
                                    <th className="px-6 py-3 w-16"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading && (
                                    <tr>
                                        <td colSpan={5} className="p-10 text-center text-slate-400 animate-pulse">
                                            Loading data...
                                        </td>
                                    </tr>
                                )}
                                {!loading && others.map((entry) => {
                                    const isMe = user?.id === entry.user_id || entry.email === user?.email;
                                    return (
                                        <tr 
                                            key={entry.user_id} 
                                            className={`group hover:bg-slate-50 transition-colors ${isMe ? 'bg-indigo-50/40' : ''}`}
                                        >
                                            <td className="px-6 py-3 text-center">
                                                <span className="text-sm font-bold text-slate-500">#{entry.rank}</span>
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs border border-slate-200">
                                                        {entry.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className={`font-bold text-sm ${isMe ? 'text-indigo-700' : 'text-slate-900'}`}>
                                                            {entry.name} {isMe && '(You)'}
                                                        </p>
                                                        <p className="text-xs text-slate-500">{entry.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                    {entry.role || 'Recruiter'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <div className="font-bold text-slate-900">{entry.count}</div>
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LeaderboardPage;