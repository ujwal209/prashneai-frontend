import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  User, 
  Sparkles,
  AlertTriangle,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface Props {
  candidateName: string;
  score: number;
  reason: string;
  missingSkills: string[];
  candidateId?: string;
  onInterview?: () => void;
}

const CandidateMatchCard: React.FC<Props> = ({ candidateName, score, reason, missingSkills, onInterview }) => {
  
  // Professional Semantic Theming (Subtle & Data-Driven)
  const getMatchTheme = (s: number) => {
    if (s >= 80) return {
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      bar: 'bg-emerald-600',
      icon: CheckCircle2,
      label: 'High Match'
    };
    if (s >= 50) return {
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      bar: 'bg-amber-500',
      icon: AlertCircle,
      label: 'Potential Match'
    };
    return {
      color: 'text-slate-600',
      bg: 'bg-slate-100',
      border: 'border-slate-200',
      bar: 'bg-slate-500',
      icon: XCircle,
      label: 'Low Match'
    };
  };

  const theme = getMatchTheme(score);
  const StatusIcon = theme.icon;

  return (
    <div className="group relative bg-white rounded-xl border border-slate-200 p-0 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 overflow-hidden">
       
       {/* Decorative Left Border based on score */}
       <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.bar}`} />

       <div className="p-6 flex flex-col md:flex-row gap-6">
          
          {/* Left: Identity & Score */}
          <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:w-48 shrink-0 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
              
              {/* Profile Pic Placeholder */}
              <div className="flex items-center gap-3 w-full">
                  <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                      <User className="w-6 h-6" />
                  </div>
                  <div className="md:hidden">
                      <h3 className="font-bold text-slate-900 text-lg">{candidateName}</h3>
                  </div>
              </div>

              {/* Score Indicator */}
              <div className="w-full space-y-2">
                  <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-slate-900">{score}</span>
                      <span className="text-sm text-slate-400 font-medium">/100</span>
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-bold uppercase tracking-wide ${theme.bg} ${theme.color} ${theme.border}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {theme.label}
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-1">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${theme.bar}`} 
                        style={{ width: `${score}%` }}
                      />
                  </div>
              </div>
          </div>

          {/* Right: Analysis Content */}
          <div className="flex-1 flex flex-col gap-4">
              
              <div className="hidden md:flex justify-between items-start">
                  <div>
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-700 transition-colors">
                          {candidateName}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                          <span>AI Analysis ID:</span>
                          <span className="font-mono">{candidateId?.substring(0,8) || 'GEN-001'}</span>
                      </div>
                  </div>
              </div>

              {/* AI Insight Box */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 relative group-hover:bg-indigo-50/30 group-hover:border-indigo-100 transition-colors">
                  <div className="flex items-start gap-3">
                      <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                          <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">AI Assessment</h4>
                          <p className="text-sm text-slate-600 leading-relaxed font-medium">
                              {reason}
                          </p>
                      </div>
                  </div>
              </div>

              {/* Missing Skills (Gap Analysis) */}
              {missingSkills.length > 0 && (
                  <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                          <AlertTriangle className="w-3 h-3" />
                          Skill Gaps Identified
                      </h4>
                      <div className="flex flex-wrap gap-2">
                          {missingSkills.map((skill, i) => (
                              <span 
                                key={i} 
                                className="px-2.5 py-1 bg-white border border-slate-200 text-slate-500 text-xs font-semibold rounded-md shadow-sm"
                              >
                                {skill}
                              </span>
                          ))}
                      </div>
                  </div>
              )}

              {/* Action Area */}
              <div className="pt-2 flex justify-end mt-auto">
                  <button
                    onClick={onInterview}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-bold rounded-lg transition-all shadow-sm hover:shadow-indigo-200 hover:-translate-y-0.5"
                  >
                    Schedule Interview
                    <ArrowRight className="w-4 h-4" />
                  </button>
              </div>
          </div>
       </div>
    </div>
  );
};

export default CandidateMatchCard;