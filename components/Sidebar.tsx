"use client";
import React, { useState, useEffect } from 'react';
import {
  Home,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  BarChart3,
  FileText,
  Bell,
  Search,
  HelpCircle
} from 'lucide-react';

import SidebarItem from './SidebarItem';

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  badge?: string;
  children?: NavigationItem[];
}

interface SidebarProps {
  className?: string;
  children?: React.ReactNode;
}

// Updated navigation items - remove logout from here
const navigationItems: NavigationItem[] = [
  { id: "dashboard", name: "Dashboard", icon: Home, href: "/dashboard" },
  { id: "analytics", name: "Ventas", icon: BarChart3, href: "/ventas", children: [
      { id: "ventas-resumen", name: "Resumen", icon: BarChart3, href: "/ventas/resumen" },
      { id: "ventas-detalle", name: "Detalle", icon: BarChart3, href: "/ventas/detalle" }
    ]
  },
  { id: "documents", name: "Cuentas", icon: FileText, href: "/cuentas", badge: "3", children: [
      { id: "cuentas-facturas", name: "Facturas", icon: FileText, href: "/cuentas/facturas" },
      { id: "cuentas-balance", name: "Balances", icon: FileText, href: "/cuentas/balance" }
    ]
  },
  { id: "notifications", name: "Inventario", icon: Bell, href: "/inventario", badge: "12", children: [
      { id: "inventario-productos", name: "Productos", icon: Bell, href: "/inventario/productos" },
      { id: "inventario-stock", name: "Stock", icon: Bell, href: "/inventario/stock" }
    ]
  },
  { id: "profile", name: "Catalogo", icon: User, href: "/catalogo" },
  { id: "settings", name: "Compras", icon: Settings, href: "/compras" },
  { id: "help", name: "Proveedores", icon: HelpCircle, href: "/proveedores" },
];

export function Sidebar({ className = "", children }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");

  // Auto-open sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-6 left-6 z-50 p-3 rounded-lg bg-white shadow-md border border-slate-100 md:hidden hover:bg-slate-50 transition-all duration-200"
        aria-label="Toggle sidebar"
      >
        {isOpen ?
          <X className="h-5 w-5 text-slate-600" /> :
          <Menu className="h-5 w-5 text-slate-600" />
        }
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-40 transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-20" : "w-72"}
          md:translate-x-0
          ${className}
        `}
      >
        {/* Header with logo and collapse button */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/60">
          {/* {!isCollapsed && ( */}
          {/*   <div className="flex items-center space-x-2.5"> */}
          {/*     <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm"> */}
          {/*       <span className="text-white font-bold text-base">A</span> */}
          {/*     </div> */}
          {/*     <div className="flex flex-col"> */}
          {/*       <span className="font-semibold text-slate-800 text-base">Acme Corp</span> */}
          {/*       <span className="text-xs text-slate-500">Enterprise Dashboard</span> */}
          {/*     </div> */}
          {/*   </div> */}
          {/* )} */}

          {/* {isCollapsed && ( */}
          {/*   <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center mx-auto shadow-sm"> */}
          {/*     <span className="text-white font-bold text-base">A</span> */}
          {/*   </div> */}
          {/* )} */}

          {/* Desktop collapse button */}
          <button
            onClick={toggleCollapse}
            className="hidden md:flex p-1.5 rounded-md hover:bg-slate-100 transition-all duration-200"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-slate-500" />
            )}
          </button>
        </div>

        {/* Search Bar */}
        {!isCollapsed && (
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <ul className="space-y-0.5">
{navigationItems.map((item) => (
  <SidebarItem
    key={item.id}
    item={item}
    isCollapsed={isCollapsed}
    activeItem={activeItem}
    onActivate={handleItemClick}
  />
))}
          </ul>
        </nav>

        {/* Bottom section with profile and logout */}
        <div className="mt-auto border-t border-slate-200">
          {/* Profile Section */}
          <div className={`border-b border-slate-200 bg-slate-50/30 ${isCollapsed ? 'py-3 px-2' : 'p-3'}`}>
            {!isCollapsed ? (
              <div className="flex items-center px-3 py-2 rounded-md bg-white hover:bg-slate-50 transition-colors duration-200">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                  <span className="text-slate-700 font-medium text-sm">JD</span>
                </div>
                <div className="flex-1 min-w-0 ml-2.5">
                  <p className="text-sm font-medium text-slate-800 truncate">John Doe</p>
                  <p className="text-xs text-slate-500 truncate">Senior Administrator</p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full ml-2" title="Online" />
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-slate-700 font-medium text-sm">JD</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <div className="p-3">
            <button
              onClick={() => handleItemClick("logout")}
              className={`
                w-full flex items-center rounded-md text-left transition-all duration-200 group
                text-red-600 hover:bg-red-50 hover:text-red-700
                ${isCollapsed ? "justify-center p-2.5" : "space-x-2.5 px-3 py-2.5"}
              `}
              title={isCollapsed ? "Logout" : undefined}
            >
              <div className="flex items-center justify-center min-w-[24px]">
                <LogOut className="h-4.5 w-4.5 flex-shrink-0 text-red-500 group-hover:text-red-600" />
              </div>

              {!isCollapsed && (
                <span className="text-sm">Logout</span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                  Logout
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-slate-800 rotate-45" />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`
          transition-all duration-300 ease-in-out w-full
          ${isCollapsed ? "md:ml-20" : "md:ml-72"}
        `}
      >
        {children}
      </div>
    </>
  );
}

