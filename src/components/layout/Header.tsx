import React, { useState } from 'react';
import { Database, Search, Bell, LogOut, ChevronDown, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { PageId } from './Sidebar';

interface HeaderProps {
  activePage: PageId;
  onPrintReport?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const { user, isAdmin, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="no-print h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left: Menu Toggle + Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button className="p-2 rounded-xl text-slate-700 hover:text-slate-800 hover:bg-slate-100 transition-colors">
          <Menu size={18} />
        </button>

        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search for analytics, customers, products..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 bg-slate-100/80 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium placeholder:text-slate-600"
          />
          <Search size={15} className="absolute left-3 top-2.5 text-slate-600" />
        </div>
      </div>

      {/* Right: Source Badge, Notifications, User Profile */}
      <div className="flex items-center gap-3">
        {/* Source Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700 font-semibold">
          <Database size={14} className="text-blue-500" />
          <span>Online Retail II (1.06M Rows)</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] text-emerald-600 font-bold">Data Ready</span>
        </div>

        {/* Notifications Icon */}
        <button className="relative p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center">
            3
          </span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1 pr-3 rounded-xl hover:bg-slate-100:bg-slate-50 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-white text-white font-bold text-xs flex items-center justify-center shadow-sm">
              {user?.avatar || 'PA'}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-black text-slate-900 leading-tight">
                {user?.name}
              </span>
              <span className="text-[10px] text-slate-700 font-medium leading-tight">
                {isAdmin ? 'Administrator' : 'Analyst'}
              </span>
            </div>
            <ChevronDown size={14} className="text-slate-600" />
          </button>

          {/* Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 text-xs space-y-1">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="font-bold text-slate-900">{user?.name}</p>
                <p className="text-[11px] text-slate-600 truncate">{user?.email}</p>
                <div className="mt-1">
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                    isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {isAdmin ? 'Administrator' : 'Analyst'}
                  </span>
                </div>
              </div>

              <div className="px-2 pt-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50:bg-rose-950/50 font-bold transition-colors"
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
