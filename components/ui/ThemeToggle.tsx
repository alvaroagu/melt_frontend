"use client"

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const ls = localStorage.getItem("theme");
      if (ls === "dark" || ls === "light") {
        const dark = ls === "dark";
        setIsDark(dark);
        document.documentElement.classList.toggle("dark", dark);
      } else {
        const prefersDark =
          typeof window !== "undefined" &&
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDark(!!prefersDark);
        document.documentElement.classList.toggle("dark", !!prefersDark);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  function toggleTheme() {
    try {
      const newIsDark = !document.documentElement.classList.contains("dark");
      document.documentElement.classList.toggle("dark", newIsDark);
      localStorage.setItem("theme", newIsDark ? "dark" : "light");
      setIsDark(newIsDark);
    } catch (e) {
      // ignore
    }
  }

  if (isDark === null) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleTheme} disabled>
        <Sun className="size-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={toggleTheme}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
