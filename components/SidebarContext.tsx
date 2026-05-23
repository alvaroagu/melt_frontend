"use client";

import React, { createContext, useContext, useState } from 'react';

type SidebarContextType = {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode; defaultCollapsed?: boolean }> = ({
  children,
  defaultCollapsed = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
}
