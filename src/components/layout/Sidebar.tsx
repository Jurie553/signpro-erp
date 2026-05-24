import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Box, 
  Truck, 
  Tag, 
  BookOpen, 
  Package, 
  FileText, 
  Briefcase, 
  Columns, 
  Cpu, 
  Warehouse, 
  ShoppingCart, 
  BarChart3,
  History,
  Settings,
  LogOut,
  ChevronLeft,
  Layers,
  Printer,
  ChevronDown,
  Shirt
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLocation } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Columns, label: 'Production Board', path: '/production-board' },
  { icon: FileText, label: 'Quotes', path: '/quotes' },
  { icon: Briefcase, label: 'Jobs', path: '/jobs' },
  { icon: Users, label: 'Clients', path: '/clients' },
  { 
    icon: Box, 
    label: 'Products', 
    path: '/inventory-group',
    children: [
      { icon: LayoutDashboard, label: 'Overview', path: '/inventory-registry' },
      { icon: Box, label: 'Materials', path: '/materials' },
      { icon: Printer, label: 'Litho Printing', path: '/litho-products' },
      { icon: BookOpen, label: 'NCR Books', path: '/ncr-books' },
      { icon: Package, label: 'Packages', path: '/packages' },
    ]
  },
  { 
    icon: Truck, 
    label: 'Procurement', 
    path: '/procurement-group',
    children: [
      { icon: Warehouse, label: 'Inventory', path: '/inventory' },
      { icon: Truck, label: 'Suppliers', path: '/suppliers' },
      { icon: ShoppingCart, label: 'Purchasing', path: '/purchasing' },
    ]
  },
  { 
    icon: Settings, 
    label: 'Settings', 
    path: '/settings-group',
    children: [
      { icon: Settings, label: 'General', path: '/settings' },
      { icon: Cpu, label: 'Machines', path: '/machines' },
      { icon: Layers, label: 'Departments', path: '/departments' },
      { icon: BarChart3, label: 'Reports', path: '/reports' },
      { icon: Cpu, label: 'Utilization', path: '/utilization' },
      { icon: History, label: 'Order History', path: '/order-history' },
    ]
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = React.useState(true);
  const [openSubmenus, setOpenSubmenus] = React.useState<string[]>(['/inventory-group', '/settings-group', '/procurement-group']);
  const { pathname } = useLocation();

  const toggleSubmenu = (path: string) => {
    setOpenSubmenus(prev => 
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  return (
    <aside className={cn(
      "bg-white border-r border-slate-200 flex flex-col h-screen transition-all duration-300 relative z-20 shadow-sm",
      collapsed ? "w-20" : "w-72"
    )}>
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white shrink-0 shadow-md">
          <span className="font-bold text-sm tracking-tight">SP</span>
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <h1 className="font-bold text-lg leading-none text-slate-900 tracking-tight">SignPro</h1>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-0.5">Corporate ERP</span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-1 py-4">
        {navItems.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const isSubmenuOpen = openSubmenus.includes(item.path);
          const isChildActive = hasChildren && item.children?.some(child => pathname === child.path);
          const isItemActive = pathname === item.path || isChildActive;

          if (hasChildren) {
            return (
              <div key={item.path} className="space-y-0.5">
                <button
                  onClick={() => !collapsed && toggleSubmenu(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 transition-colors rounded-lg font-medium",
                    isChildActive 
                      ? "text-blue-700 bg-blue-50" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <item.icon size={18} strokeWidth={2} className={cn("shrink-0", isChildActive && "text-blue-700")} />
                  {!collapsed && (
                    <>
                      <span className="text-xs font-semibold flex-1 text-left tracking-wide">{item.label}</span>
                      <ChevronDown size={14} className={cn("transition-transform duration-300", isSubmenuOpen && "rotate-180")} />
                    </>
                  )}
                </button>
                
                {!collapsed && isSubmenuOpen && (
                  <div className="pl-6 space-y-0.5">
                    {item.children?.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) => cn(
                          "flex items-center gap-3 px-3 py-2.5 transition-colors rounded-lg font-medium",
                          isActive 
                            ? "text-blue-700 bg-blue-50/50" 
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                        )}
                      >
                        <child.icon size={14} strokeWidth={2} className={cn("shrink-0", "text-slate-400")} />
                        <span className="text-[11px] uppercase tracking-wider">{child.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-3 transition-colors rounded-lg font-medium",
                isActive 
                  ? "text-blue-700 bg-blue-50" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <item.icon size={18} strokeWidth={2} className={cn("shrink-0")} />
              {!collapsed && <span className="text-xs font-semibold tracking-wide">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        {!collapsed && (
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">System Status</h4>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-slate-800">Operational</span>
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-24 bg-white border border-slate-200 shadow-sm rounded-full p-1.5 text-slate-400 hover:text-blue-700 transition-all z-30"
      >
        <ChevronLeft size={12} strokeWidth={2.5} className={cn("transition-transform duration-300", collapsed && "rotate-180")} />
      </button>
    </aside>
  );
}
