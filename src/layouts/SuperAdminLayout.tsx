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
  const { signOut } = useAuth();
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
    const [expanded, setExpanded] = useState(active);

    return (
      <div className="mb-2">
        <div className="px-3">
          <NavLink
            to={item.path}
            onClick={() => {
              if (hasSubItems) {
                setExpanded(!expanded);
              }
              if (onClick) onClick();
            }}
            end={item.exact}
            className={`group relative flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${active && !hasSubItems
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-900/20'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className={`h-5 w-5 ${active ? 'text-indigo-200' : 'text-slate-500 group-hover:text-indigo-400'} transition-colors duration-300`} />
              <span className="tracking-wide font-medium">{item.name}</span>
            </div>
            {hasSubItems ? (
              <ChevronRight className={`h-4 w-4 text-slate-600 transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`} />
            ) : (
              active && <div className="h-1.5 w-1.5 rounded-full bg-indigo-300 shadow-glow" />
            )}
          </NavLink>
        </div>

        {/*Sub Items*/}
        {hasSubItems && expanded && (
          <div className="mt-1 ml-4 border-l-2 border-slate-800 pl-3 space-y-1 animate-in slide-in-from-left-2 duration-200">
            {item.subItems.map((sub: any) => {
              const subActive = location.pathname === sub.path;
              return (
                <NavLink
                  key={sub.path}
                  to={sub.path}
                  onClick={onClick}
                  className={`group flex items-center gap-3 rounded-lg px-4 py-2.5 text-xs font-medium transition-all duration-200 ${subActive
                      ? 'bg-slate-800 text-indigo-400 border border-slate-700'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
                    }`}
                >
                  <sub.icon className={`h-3.5 w-3.5 ${subActive ? 'text-indigo-400' : 'text-slate-600'}`} />
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
      <aside className="hidden lg:flex w-72 flex-col bg-slate-950 text-white border-r border-slate-900 shadow-2xl z-20">
        <div className="h-20 flex items-center px-8 border-b border-slate-900 bg-slate-950/50 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/20">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="block font-bold text-lg tracking-tight text-white leading-none">Admin</span>
              <span className="block text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-1">Console</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-8">
          <div className="px-7 mb-4">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Main Menu</span>
          </div>
          {navItems.map((item) => <NavItem key={item.name} item={item} />)}
        </nav>

        <div className="p-6 border-t border-slate-900 bg-slate-950/50">
          <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold ring-2 ring-slate-900">SA</div>
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">Administrator</p>
              <p className="truncate text-xs text-slate-500">Super Admin</p>
            </div>
            <button onClick={handleLogout} className="text-slate-500 hover:text-rose-400 transition-colors p-1.5 hover:bg-rose-500/10 rounded-lg">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* --- CONTENT AREA --- */}
      <div className="flex flex-1 flex-col overflow-hidden relative bg-slate-50/50">

        {/* Mobile Header (Visible only on mobile for navigation) */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-30">
          <span className="font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-indigo-600" /> Admin
          </span>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute inset-0 z-50 bg-slate-950 text-white p-4 lg:hidden">
            <nav className="space-y-2 mt-10">
              {navItems.map((item) => <NavItem key={item.name} item={item} onClick={() => setMobileMenuOpen(false)} />)}
              <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-4 text-rose-400 mt-8 rounded-xl hover:bg-slate-900">
                <LogOut className="h-5 w-5" /> Sign Out
              </button>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;