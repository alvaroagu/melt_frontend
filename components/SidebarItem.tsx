"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  badge?: string;
  children?: NavigationItem[];
}

type Props = {
  item: NavigationItem;
  isCollapsed: boolean;
  activeItem: string;
  onActivate: (id: string) => void;
};

export default function SidebarItem({ item, isCollapsed, activeItem, onActivate }: Props) {
  const [open, setOpen] = useState(false);
  const [hoverOpen, setHoverOpen] = useState(false);
  const liRef = useRef<HTMLLIElement | null>(null);

  const hasChildren = !!item.children && item.children.length > 0;
  const isActive = activeItem === item.id || (hasChildren && item.children!.some(c => c.id === activeItem));

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (liRef.current && !liRef.current.contains(e.target as Node)) {
        setHoverOpen(false);
      }
    };
    if (hoverOpen) {
      document.addEventListener('mousedown', onClickOutside);
    }
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [hoverOpen]);

  const handleMainClick = (e?: React.MouseEvent) => {
    if (hasChildren) {
      setOpen(prev => !prev);
    } else {
      onActivate(item.id);
    }
  };

  const handleChildClick = (childId: string) => {
    onActivate(childId);
    setOpen(false);
    setHoverOpen(false);
  };

  const Icon = item.icon;

  return (
    <li ref={liRef} className="relative">
      <button
        onClick={handleMainClick}
        onMouseEnter={() => isCollapsed && hasChildren && setHoverOpen(true)}
        onMouseLeave={() => isCollapsed && hasChildren && setHoverOpen(false)}
        className={`
          w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-md text-left transition-all duration-200 group
          ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
          ${isCollapsed ? 'justify-center px-2' : ''}
        `}
        title={isCollapsed ? item.name : undefined}
        aria-expanded={hasChildren ? open : undefined}
        aria-controls={hasChildren ? `${item.id}-submenu` : undefined}
      >
        <div className="flex items-center justify-center min-w-[24px]">
          <Icon className={`h-4.5 w-4.5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'}`} />
        </div>

        {!isCollapsed && (
          <div className="flex items-center justify-between w-full">
            <span className={`text-sm ${isActive ? 'font-medium' : 'font-normal'}`}>{item.name}</span>
            <div className="flex items-center space-x-2">
              {item.badge && (
                <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                  {item.badge}
                </span>
              )}
              {hasChildren && (
                open ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </div>
          </div>
        )}

        {isCollapsed && item.badge && (
          <div className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded-full bg-blue-100 border border-white">
            <span className="text-[10px] font-medium text-blue-700">
              {parseInt(item.badge) > 9 ? '9+' : item.badge}
            </span>
          </div>
        )}

        {isCollapsed && !hasChildren && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
            {item.name}
            {item.badge && (
              <span className="ml-1.5 px-1 py-0.5 bg-slate-700 rounded-full text-[10px]">
                {item.badge}
              </span>
            )}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-slate-800 rotate-45" />
          </div>
        )}
      </button>

      {/* Expanded submenu (non-collapsed) */}
      {!isCollapsed && hasChildren && (
        <ul id={`${item.id}-submenu`} className={`mt-1 pl-8 pr-2 space-y-1 ${open ? 'block' : 'hidden'}`} role="menu" aria-label={`${item.name} submenu`}>
          {item.children!.map((child) => {
            const childActive = activeItem === child.id;
            const ChildIcon = child.icon;
            return (
              <li key={child.id}>
                <button
                  onClick={() => handleChildClick(child.id)}
                  className={`w-full flex items-center space-x-2.5 px-2 py-2 rounded-md text-sm transition-colors duration-150 ${childActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <div className="flex items-center justify-center min-w-[20px]">
                    <ChildIcon className={`h-3.5 w-3.5 ${childActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  </div>
                  <span className="truncate">{child.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Flyout submenu for collapsed state */}
      {isCollapsed && hasChildren && hoverOpen && (
        <div
          className="absolute left-full top-0 ml-2 w-52 bg-white border border-slate-200 rounded-md shadow-lg z-50 p-2"
          onMouseEnter={() => setHoverOpen(true)}
          onMouseLeave={() => setHoverOpen(false)}
        >
          <div className="px-2 py-1 text-xs text-slate-500 font-medium border-b border-slate-100 mb-2">{item.name}</div>
          <ul className="space-y-1">
            {item.children!.map((child) => {
              const childActive = activeItem === child.id;
              const ChildIcon = child.icon;
              return (
                <li key={child.id}>
                  <button
                    onClick={() => handleChildClick(child.id)}
                    className={`w-full flex items-center space-x-2.5 px-2 py-2 rounded-md text-sm transition-colors duration-150 ${childActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                  >
                    <div className="flex items-center justify-center min-w-[20px]">
                      <ChildIcon className={`h-3.5 w-3.5 ${childActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    </div>
                    <span className="truncate">{child.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-white border border-slate-200 rotate-45" />
        </div>
      )}
    </li>
  );
}
