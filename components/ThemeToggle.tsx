"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-10 h-10" />;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg hover:shadow-slate-500/5 active:scale-95"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <Sun 
          size={20} 
          className={`absolute inset-0 transform transition-all duration-500 ease-spring ${
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100 text-amber-500"
          }`} 
        />
        <Moon 
          size={20} 
          className={`absolute inset-0 transform transition-all duration-500 ease-spring ${
            isDark ? "rotate-0 scale-100 opacity-100 text-indigo-400" : "-rotate-90 scale-0 opacity-0"
          }`} 
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
