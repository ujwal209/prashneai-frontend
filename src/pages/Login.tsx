import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import api from '../lib/api';
import { 
  AlertCircle, 
  Loader2, 
  Lock, 
  Mail, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        const response = await api.post('/auth/login', {
            email,
            password
        });

        const { access_token, refresh_token, user } = response.data;

        const { error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token
        });

        if (sessionError) throw new Error("Failed to sync session: " + sessionError.message);

        const role = user.role;
        if (role === 'super_admin') navigate('/admin');
        else if (role === 'hr_admin') navigate('/hr/admin');
        else if (role === 'hr_user' || role === 'hr_staff') navigate('/hr/dashboard');
        else navigate('/hr/dashboard');

    } catch (err: any) {
        console.error("Login Failed:", err);
        const serverError = err.response?.data?.detail;
        
        if (serverError) setError(serverError);
        else if (err.message) setError(err.message);
        else setError("An unexpected error occurred.");
        
        await supabase.auth.signOut();
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans antialiased bg-white selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* --- LEFT SIDE: Brand & Visuals (Enterprise Dark Mode) --- */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 flex-col justify-between p-16 text-white border-r border-slate-800">
        
        {/* Subtle Architectural Pattern */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(to right, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
        
        {/* Deep Ambient Glows */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-900/40 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-2 rounded-lg shadow-sm">
             <img src="/logo.webp" alt="Prashne Logo" className="w-6 h-6 object-contain" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Prashne Corp.</span>
        </div>

        {/* Main Visual Content */}
        <div className="relative z-10 max-w-lg space-y-8">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Recruitment <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-blue-200">
              Intelligence Refined.
            </span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed font-medium">
            Secure, AI-driven candidate pipelines for the modern enterprise. Streamline your hiring with precision matching.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex items-center gap-6 pt-4 text-sm font-semibold text-slate-400">
             <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>SOC2 Compliant</span>
             </div>
             <div className="w-1 h-1 rounded-full bg-slate-600" />
             <div>99.9% Uptime</div>
             <div className="w-1 h-1 rounded-full bg-slate-600" />
             <div>SSO Enabled</div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex justify-between items-center text-xs text-slate-500 font-medium tracking-wider uppercase">
          <span>© 2025 Prashne Inc.</span>
          <span>Enterprise Edition v2.1</span>
        </div>
      </div>

      {/* --- RIGHT SIDE: Login Form --- */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 lg:px-24 bg-white relative">
        
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-3">
          <img src="/logo.webp" alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-slate-900 text-xl tracking-tight">Prashne</span>
        </div>

        <div className="w-full max-w-[380px] space-y-8">
          
          {/* Header */}
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              Please enter your credentials to access the dashboard.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-100 flex gap-3 items-start animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-red-800">Authentication Failed</h3>
                <p className="text-sm text-red-600 mt-1 leading-tight font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 bg-white 
                           placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 
                           transition-all outline-none text-sm font-medium shadow-sm hover:border-slate-300"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 bg-white 
                           placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 
                           transition-all outline-none text-sm font-medium shadow-sm hover:border-slate-300"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-sm font-bold text-white 
                       bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 
                       disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                  Verifying Credentials...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-sm text-slate-500 font-medium">
            Protected by Enterprise SSO. <br/>
            <a href="#" className="font-bold text-slate-700 hover:text-indigo-600 hover:underline transition-colors">
              Contact IT Support
            </a> for access issues.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;