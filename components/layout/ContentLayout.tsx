"use client";

import React from 'react';

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 w-full min-w-0 bg-background transition-all duration-300 ease-in-out">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
    </div>
  );
}
