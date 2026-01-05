import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { Trophy, Medal, Crown, TrendingUp, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LeaderboardEntry {
    user_id: string;
    name: string;
    email: string;
    role: string;
    count: number;
    rank: number;
}

const LeaderboardWidget: React.FC = () => {
    const { user } = useAuth();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

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

    // Professional Rank Styling Helper
    const getRankStyle = (rank: number) => {
        if (rank === 1) return { 
            icon: <Crown className="w-4 h-4 text-yellow-600" />, 
            border: 'border-yellow-200', 
            bg: 'bg-yellow-50/50' 
        };
        if (rank === 2) return { 
            icon: <Medal className="w-4 h-4 text-slate-500" />, 
            border: 'border-slate-200', 
            bg: 'bg-slate-50/50' 
        };
        if (rank === 3) return { 
            icon: <Medal className="w-4 h-4 text-amber-700" />, 
            border: 'border-orange-100', 
            bg: 'bg-orange-50/30' 
        };
        return { 
            icon: <span className="text-xs font-bold text-slate-400">#{rank}</span>, 
            border: 'border-transparent', 
            bg: 'bg-white' 
        };
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full font-sans">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md">
                        <Trophy className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">Team Performance</h3>
                </div>
                <div className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-1 rounded uppercase tracking-wider">
                    Current Period
                </div>
            </div>

            {/* List Container */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-slate-200">
                {loading ? (
                    <div className="space-y-3 animate-pulse">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-14 bg-slate-100 rounded-lg"></div>
                        ))}
                    </div>
                ) : leaderboard.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <TrendingUp className="w-8 h-8 mb-2 opacity-30" />
                        <p className="text-sm font-medium">No activity recorded yet.</p>
                     </div>
                ) : (
                    <div className="space-y-6">
                        
                        {/* Top Performers */}
                        <div className="space-y-3">
                            {topThree.map((entry) => {
                                const style = getRankStyle(entry.rank);
                                const isMe = user?.id === entry.user_id || entry.email === user?.email;

                                return (
                                    <div 
                                        key={entry.user_id} 
                                        className={`
                                            flex items-center gap-3 p-3 rounded-lg border transition-all
                                            ${style.border} ${style.bg}
                                            ${isMe ? 'ring-1 ring-indigo-500 bg-indigo-50/20' : ''}
                                        `}
                                    >
                                        <div className="flex-shrink-0 w-8 flex justify-center">
                                            {style.icon}
                                        </div>
                                        
                                        <div className="flex-shrink-0">
                                             <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm">
                                                 {entry.name.charAt(0).toUpperCase()}
                                             </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-bold truncate ${isMe ? 'text-indigo-700' : 'text-slate-800'}`}>
                                                {entry.name} {isMe && '(You)'}
                                            </p>
                                            <p className="text-xs text-slate-500 font-medium truncate">
                                                {entry.count} candidates processed
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Honorable Mentions */}
                        {others.length > 0 && (
                            <div className="space-y-2 pt-2">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Honorable Mentions</h4>
                                <div className="space-y-1">
                                    {others.map((entry) => {
                                        const isMe = user?.id === entry.user_id || entry.email === user?.email;
                                        return (
                                            <div 
                                                key={entry.user_id} 
                                                className={`
                                                    flex items-center gap-3 p-2.5 rounded-lg border border-transparent hover:bg-slate-50 transition-colors
                                                    ${isMe ? 'bg-slate-50 border-slate-200' : ''}
                                                `}
                                            >
                                                <div className="flex-shrink-0 w-8 text-center text-xs font-bold text-slate-400">
                                                    #{entry.rank}
                                                </div>
                                                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                    {entry.name.charAt(0)}
                                                </div>
                                                <div className="flex-1 flex justify-between items-center min-w-0">
                                                    <span className={`text-xs font-medium truncate ${isMe ? 'text-indigo-700 font-bold' : 'text-slate-700'}`}>
                                                        {entry.name}
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-900">
                                                        {entry.count}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaderboardWidget;