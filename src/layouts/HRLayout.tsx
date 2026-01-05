import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  Briefcase,
  UploadCloud,
  Sparkles,
  History,
  Search,
  Bell,
  Code2,
  Settings,
  UserCircle,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  Trophy,
  Video,
  Shield
} from 'lucide-react';

const HRLayout: React.FC = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  const isAdmin = user?.user_metadata?.role === 'hr_admin' || user?.app_metadata?.role === 'hr_admin';

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const term = e.target.value;
      setSearchTerm(term);
      if (term) {
          setSearchParams({ ...Object.fromEntries(searchParams), q: term });
      } else {
          const newParams = Object.fromEntries(searchParams);
          delete newParams.q;
          setSearchParams(newParams);
      }
  };

  const sharedItems = [
    { path: '/hr/talent', label: 'Talent Pool', icon: Users },
    { path: '/hr/upload', label: 'Upload Resumes', icon: UploadCloud },
    { path: '/hr/jobs', label: 'Job Descriptions', icon: Briefcase },
    { path: '/hr/match', label: 'Smart Match AI', icon: Sparkles },
    { path: '/hr/history', label: 'Match History', icon: History },
    { path: '/hr/interviews', label: 'Interviews', icon: Video },
  ];

  const userNavItems = [
    { path: '/hr/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ...sharedItems
  ];

  const adminNavItems = [
    { path: '/hr/admin', label: 'Analytics', icon: TrendingUp },
    { path: '/hr/leaderboard', label: 'Leaderboard', icon: Trophy },
    ...sharedItems
  ];

  const currentNavItems = isAdmin ? adminNavItems : userNavItems;

  // Reusable NavItem Component
  const NavItem = ({ item, onClick }: { item: typeof userNavItems[0], onClick?: () => void }) => (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        `group relative flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ease-out ${
          isActive
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-3 relative z-10">
            <item.icon className={`h-5 w-5 transition-transform duration-200 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
            <span className="tracking-wide">{item.label}</span>
          </div>
          {isActive && (
             <ChevronRight className="h-4 w-4 text-indigo-200" />
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* --- SIDEBAR (DESKTOP) --- */}
      <aside className="hidden lg:flex w-72 flex-col bg-slate-900 text-white border-r border-slate-800 relative z-30">
          
          {/* Header */}
          <div className="h-20 flex items-center px-6 border-b border-slate-800 bg-slate-900 z-10">
              <div className="flex items-center gap-3">
                 <div className="relative group cursor-pointer">
                    <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                       <img src="/logo.webp" alt="Prashne" className="h-6 w-6 object-contain" />
                    </div>
                 </div>
                 <div>
                    <h1 className="font-bold text-lg tracking-tight text-white leading-none">PRASHNE</h1>
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-1 block">
                        {isAdmin ? 'HR Admin' : 'Recruiter'}
                    </span>
                 </div>
              </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-700 z-10 pt-6">
              <div className="px-4 mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Workspace</span>
              </div>
              {currentNavItems.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-800 bg-slate-900 z-10 space-y-1">
              <button 
                onClick={() => navigate('/hr/profile')}
                className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all text-sm font-medium group"
              >
                  <UserCircle className="w-5 h-5 group-hover:text-indigo-400 transition-colors" />
                  <span>My Profile</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all text-sm font-medium group"
              >
                  <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
                  <span>Sign Out</span>
              </button>
          </div>
      </aside>

      {/* --- MOBILE DRAWER --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          
          <div className="absolute inset-y-0 left-0 w-72 bg-slate-900 text-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 border-r border-slate-800">
              
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                 <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-white rounded-lg flex items-center justify-center">
                       <img src="/logo.webp" alt="Prashne" className="h-5 w-5 object-contain" />
                    </div>
                    <span className="font-bold text-lg">PRASHNE</span>
                 </div>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
                    <X className="h-5 w-5" />
                 </button>
              </div>

              {/* Nav */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                 {currentNavItems.map((item) => (
                    <NavItem key={item.path} item={item} onClick={() => setIsMobileMenuOpen(false)} />
                 ))}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-900 space-y-2">
                 <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 mb-2 border border-slate-700">
                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                        {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                    </div>
                 </div>
                 <button 
                   onClick={handleSignOut}
                   className="flex items-center justify-center gap-2 w-full p-3 rounded-lg bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 transition-colors"
                 >
                    <LogOut className="h-4 w-4" /> Sign Out
                 </button>
              </div>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative bg-slate-50">
        
        {/* Top Header */}
        <header className="h-16 lg:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-20 sticky top-0">
            
            {/* Left: Mobile Toggle & Search */}
            <div className="flex items-center gap-4 flex-1">
               <button 
                 onClick={() => setIsMobileMenuOpen(true)}
                 className="lg:hidden text-slate-500 p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors"
               >
                 <Menu className="w-6 h-6" />
               </button>

               {/* Desktop Search */}
               <div className="hidden md:block w-full max-w-md relative group">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                   </div>
                   <input 
                     type="text"
                     placeholder="Search candidates, skills, or job IDs..."
                     className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all text-sm font-medium"
                     value={searchTerm}
                     onChange={handleSearch}
                   />
               </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 lg:gap-6">
               <button className="relative p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all group">
                   <Bell className="w-5 h-5" />
                   <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
               </button>
               
               <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
               
               <div className="hidden sm:flex items-center gap-3 pl-2">
                   <div className="text-right hidden lg:block">
                       <p className="text-sm font-bold text-slate-900">{isAdmin ? 'HR Administrator' : 'Talent Acquisition'}</p>
                       <p className="text-xs text-slate-500 font-medium">Prashne Corp</p>
                   </div>
                   <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
                      <ChevronDown className="w-4 h-4" />
                   </div>
               </div>
            </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 p-4 lg:p-8 relative scroll-smooth">
           <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
             <Outlet />
           </div>
        </main>

      </div>
    </div>
  );
};

export default HRLayout;