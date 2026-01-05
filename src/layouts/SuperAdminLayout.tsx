import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  LogOut, 
  Menu, 
  X,
  ShieldCheck,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SuperAdminLayout: React.FC = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth/login');
  };

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { 
        name: 'Tenants', 
        path: '/admin/companies', 
        icon: Building2,
        subItems: [
            { name: 'Register Tenant', path: '/admin/companies/new', icon: Plus }
        ]
    },
    { 
        name: 'User Management', 
        path: '/admin/users', 
        icon: Users,
        subItems: [
            { name: 'Provision User', path: '/admin/users/new', icon: Plus }
        ]
    },
  ];

  // Helper to determine if a route is active
  const isRouteActive = (itemPath: string, exact: boolean = false) => {
      if (exact) return location.pathname === itemPath;
      return location.pathname.startsWith(itemPath);
  };

  const NavItem = ({ item, onClick }: { item: any, onClick?: () => void }) => {
    const active = isRouteActive(item.path, item.exact);
    const hasSubItems = item.subItems && item.subItems.length > 0;

    return (
        <div className="mb-1">
            <NavLink
                to={item.path}
                onClick={onClick}
                end={item.exact}
                className={`group relative flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    active && !hasSubItems // Only highlight parent if no sub-items are explicitly active
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
            >
                <div className="flex items-center gap-3">
                    <item.icon className={`h-4 w-4 ${active ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <span className="tracking-wide">{item.name}</span>
                </div>
                {active && !hasSubItems && <ChevronRight className="h-3 w-3 text-indigo-200" />}
            </NavLink>

            {/* Sub Items */}
            {hasSubItems && (
                <div className="mt-1 ml-4 border-l border-slate-700 pl-2 space-y-1">
                    {item.subItems.map((sub: any) => {
                        const subActive = location.pathname === sub.path;
                        return (
                            <NavLink
                                key={sub.path}
                                to={sub.path}
                                onClick={onClick}
                                className={`group flex items-center gap-3 rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 ${
                                    subActive
                                    ? 'bg-indigo-500/20 text-indigo-300'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                <sub.icon className="h-3 w-3" />
                                {sub.name}
                            </NavLink>
                        );
                    })}
                </div>
            )}
        </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="hidden lg:flex w-64 flex-col bg-slate-900 text-white border-r border-slate-800">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
               <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight">Admin Console</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
          <div className="px-4 mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Platform</span>
          </div>
          {navItems.map((item) => <NavItem key={item.name} item={item} />)}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold">SA</div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold text-white">Administrator</p>
              <p className="truncate text-[10px] text-slate-400">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-white"><LogOut className="h-4 w-4" /></button>
          </div>
        </div>
      </aside>

      {/* --- MOBILE --- */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4">
          <span className="font-bold text-slate-900 flex items-center gap-2">
             <ShieldCheck className="h-5 w-5 text-indigo-600" /> Admin
          </span>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>

        {mobileMenuOpen && (
            <div className="absolute inset-0 z-50 bg-slate-900 text-white p-4">
                <nav className="space-y-2 mt-10">
                    {navItems.map((item) => <NavItem key={item.name} item={item} onClick={() => setMobileMenuOpen(false)} />)}
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-rose-400 mt-8">
                        <LogOut className="h-5 w-5" /> Sign Out
                    </button>
                </nav>
            </div>
        )}

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;