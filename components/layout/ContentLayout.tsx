"use client";

import React from 'react';
import { useSidebar } from '../SidebarContext';

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="transition-all duration-300 ease-in-out flex-1 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">{children}</div>
    </div>
  );
}
