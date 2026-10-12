import React from 'react';
import {
  LayoutDashboard,
  Database,
  CheckCircle2,
  GitMerge,
  Network,
  TrendingUp,
  ShoppingBag,
  Users,
  Globe,
  PieChart,
  Boxes,
  Layers,
  Target,
  BarChart3,
  Lightbulb,
  FileText,
  UserCog,
  Sliders,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LineChart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type PageId =
  | 'dashboard'
  | 'analyst-dashboard'
  | 'dataset'
  | 'data-quality'
  | 'etl'
  | 'warehouse'
  | 'sales'
  | 'products'
  | 'customers'
  | 'geographic'
  | 'rfm'
  | 'clustering'
  | 'association'
  | 'market-basket'
  | 'classification'
  | 'model-evaluation'
  | 'feature-importance'
  | 'insights'
  | 'reports'
  | 'users'
  | 'settings';

interface SidebarProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  sidebarWidth?: number;
  setSidebarWidth?: (w: number) => void;
}

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

interface NavSection {
  title?: string;
  items: NavItem[];
  adminOnly?: boolean;
}

const navSections: NavSection[] = [
  {
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, adminOnly: true },
      { id: 'analyst-dashboard', label: 'Analytics Overview', icon: LineChart },
    ],
  },
  {
    title: 'DATA WAREHOUSE',
    adminOnly: true,
    items: [
      { id: 'dataset', label: 'Dataset Overview', icon: Database, adminOnly: true },
      { id: 'data-quality', label: 'Data Quality', icon: CheckCircle2, adminOnly: true },
      { id: 'etl', label: 'Preprocessing / ETL', icon: GitMerge, adminOnly: true },
      { id: 'warehouse', label: 'Warehouse Schema', icon: Network, adminOnly: true },
    ],
  },
  {
    title: 'ANALYTICS',
    items: [
      { id: 'sales', label: 'Sales Analytics', icon: TrendingUp },
      { id: 'products', label: 'Product Analytics', icon: ShoppingBag },
      { id: 'customers', label: 'Customer Analytics', icon: Users },
      { id: 'geographic', label: 'Geographic Analytics', icon: Globe },
    ],
  },
  {
    title: 'DATA MINING & ML',
    items: [
      { id: 'rfm', label: 'RFM Analysis', icon: PieChart },
      { id: 'clustering', label: 'Customer Clustering', icon: Boxes },
      { id: 'classification', label: 'Classification', icon: Target },
      { id: 'association', label: 'Association Rules', icon: Layers },
      { id: 'model-evaluation', label: 'Model Evaluation', icon: BarChart3, adminOnly: true },
    ],
  },
  {
    title: 'INSIGHTS',
    items: [
      { id: 'insights', label: 'Business Insights', icon: Lightbulb },
      { id: 'reports', label: 'Reports', icon: FileText },
    ],
  },
  {
    title: 'ADMINISTRATION',
    adminOnly: true,
    items: [
      { id: 'users', label: 'User Management', icon: UserCog, adminOnly: true },
      { id: 'settings', label: 'Settings', icon: Sliders, adminOnly: true },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  collapsed,
  setCollapsed,
  sidebarWidth = 256,
  setSidebarWidth,
}) => {
  const { user, isAdmin, logout } = useAuth();

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      let newWidth = startWidth + deltaX;

      if (newWidth < 140) {
        setCollapsed(true);
      } else {
        if (collapsed) setCollapsed(false);
        const clampedWidth = Math.max(220, Math.min(360, newWidth));
        if (setSidebarWidth) setSidebarWidth(clampedWidth);
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <aside
      className="no-print relative flex flex-col bg-[#081225] text-white border-r border-[#10203e] shrink-0 z-20 transition-[width] duration-150 select-none"
      style={{ width: collapsed ? '72px' : `${sidebarWidth}px` }}
    >
      {/* Resizable Drag Edge Handle */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute top-0 right-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500/40 active:bg-blue-600/60 transition-colors z-30 group"
        title="Drag edge left/right to resize sidebar width"
      >
        <div className="absolute right-0.5 top-1/2 -translate-y-1/2 h-8 w-1 rounded-full bg-slate-600 group-hover:bg-blue-400 opacity-60" />
      </div>

      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#10203e]/60 shrink-0">
        {!collapsed ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-blue-500/20 shrink-0">
              SR
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-black text-sm tracking-tight text-white leading-none truncate">
                Smart Retail
              </span>
              <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mt-1 truncate">
                ANALYTICS PLATFORM
              </span>
            </div>
          </div>
        ) : (
          <div
            className="mx-auto h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0"
            title="Smart Retail Analytics Platform"
          >
            SR
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#10203e] transition-colors shrink-0"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {navSections.map((sec, sIdx) => {
          if (sec.adminOnly && !isAdmin) return null;
          const filteredItems = sec.items.filter(item => !item.adminOnly || isAdmin);

          if (filteredItems.length === 0) return null;

          return (
            <div key={sIdx} className="space-y-1">
              {sec.title && !collapsed && (
                <h3 className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest truncate">
                  {sec.title}
                </h3>
              )}
              <div className="space-y-0.5">
                {filteredItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActivePage(item.id)}
                      title={item.label}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                        collapsed ? 'justify-center px-0' : ''
                      } ${
                        isActive
                          ? 'bg-[#1D61E7] text-white shadow-md shadow-blue-600/30 font-bold'
                          : 'text-slate-300 hover:bg-[#10203e] hover:text-white'
                      }`}
                    >
                      <Icon
                        size={18}
                        className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}
                      />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* User Info & Logout Footer */}
      <div className="p-3.5 border-t border-[#10203e]/60 bg-[#050c19] flex items-center justify-between shrink-0">
        {!collapsed ? (
          <>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-[#10203e] border border-slate-700 flex items-center justify-center font-bold text-xs text-sky-400 shrink-0">
                {user?.avatar || 'U'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white truncate">{user?.name}</span>
                <span className="text-[10px] text-slate-400 truncate">{isAdmin ? 'Administrator' : 'Analyst'}</span>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#10203e] transition-colors shrink-0"
              title="Logout of session"
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <div className="w-full flex flex-col items-center gap-2">
            <div
              className="h-8 w-8 rounded-full bg-[#10203e] border border-slate-700 flex items-center justify-center font-bold text-xs text-sky-400"
              title={`${user?.name} (${isAdmin ? 'Administrator' : 'Analyst'})`}
            >
              {user?.avatar || 'U'}
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#10203e] transition-colors"
              title="Logout of session"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
