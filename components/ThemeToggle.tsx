"use client";

import * as React from "react";
import { Moon, Sun, Zap } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) return <div className="w-10 h-10" />;

  const cycleTheme = () => {
    const themes = ["light", "dark", "pitch-dark"];
    // Fallback to light if the current theme isn't in our list (e.g., 'system')
    const currentTheme = themes.includes(theme as string) ? theme : resolvedTheme;
    const currentIndex = themes.indexOf(currentTheme as string);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const currentActive = themes.includes(theme as string) ? theme : resolvedTheme;

  return (
    <button
      onClick={cycleTheme}
      className="group relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-card border border-border transition-all hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 active:scale-95"
      aria-label={`Toggle theme (Current: ${theme})`}
    >
      <div className="relative w-5 h-5">
        <Sun 
          size={20} 
          className={`absolute inset-0 transform transition-all duration-500 ease-spring ${
            currentActive === "light" ? "rotate-0 scale-100 opacity-100 text-amber-500" : "rotate-90 scale-0 opacity-0"
          }`} 
        />
        <Moon 
          size={20} 
          className={`absolute inset-0 transform transition-all duration-500 ease-spring ${
            currentActive === "dark" ? "rotate-0 scale-100 opacity-100 text-indigo-400" : "rotate-90 scale-0 opacity-0"
          }`} 
        />
        <Zap
          size={20}
          className={`absolute inset-0 transform transition-all duration-500 ease-spring ${
            currentActive === "pitch-dark" ? "rotate-0 scale-100 opacity-100 text-emerald-400" : "rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

const themes = ["light", "dark", "pitch-dark"];
