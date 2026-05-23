"use client";
import React, { useState, useEffect } from 'react';
import {
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  BanknoteArrowUp,
  FileText,
  Bell,
  Search,
  HandCoins,
  Boxes,
  ShoppingCart,
  LayoutDashboardIcon
} from 'lucide-react';
import { useSidebar } from './SidebarContext';

import SidebarItem from './SidebarItem';

interface NavigationItem {
  id: string;
  name: string;
  icon?: React.ComponentType<{ className?: string }>;
  href?: string;
  badge?: string;
  children?: NavigationItem[];
}

interface SidebarProps {
  className?: string;
  children?: React.ReactNode;
  defaultCollapsed?: boolean;
}

// Updated navigation items - remove logout from here
const navigationItems: NavigationItem[] = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboardIcon, href: "/dashboard" },
  {
    id: "sales", name: "Ventas", icon: BanknoteArrowUp, href: "/ventas", children: [
      { id: "new-sale", name: "Nueva Venta", href: "/ventas/resumen" },
      { id: "sale-details", name: "Historial de Venta", href: "/ventas/detalle" }
    ]
  },
  {
    id: "documents", name: "Cuentas por Cobrar", icon: HandCoins, href: "/cuentas", badge: "3", children: [
      { id: "credits-pending", name: "Creditos Pendientes", href: "/cuentas/facturas" },
      { id: "payment-history", name: "Historial de Pagos", href: "/cuentas/balance" }
    ]
  },
  {
    id: "inventory", name: "Inventario y Catalogo", icon: Boxes, href: "/inventario", badge: "12", children: [
      { id: "iventory-products", name: "Productos", href: "/inventario/productos" },
      { id: "categories", name: "Cateogorias", href: "/inventario/categoria" }
    ]
  },
  {
    id: "purchases", name: "Compras / Proveedores", icon: ShoppingCart, href: "/compras_proveedores", badge: "12", children: [
      { id: "register-purcharse", name: "Registrar Compra", href: "/inventario/productos" },
      { id: "purchase-history", name: "Historial de Compras", href: "/inventario/categoria" },
      { id: "vendors", name: "Proveedores", href: "/inventario/categoria" }
    ]
  },
  { id: "clientes", name: "Clientes", icon: User, href: "/clientes" },
  { id: "settings", name: "Configuracion", icon: Settings, href: "/configuracion" },
];

export function Sidebar({ className = "" }: SidebarProps) {
  const { isCollapsed, setIsCollapsed, isOpen, setIsOpen } = useSidebar();
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
  }, [setIsOpen]);

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
          fixed md:static top-0 left-0 h-full md:h-auto bg-white border-r border-slate-200 z-40 transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-20" : "w-72"}
          md:translate-x-0
          ${className}
        `}
      >
        {/* Header with logo and collapse button */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/60">
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
    </>
  );
}

