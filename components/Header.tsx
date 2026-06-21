"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, LogOut, LayoutDashboard, History, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/utils/cn";
import { useTheme } from "next-themes";

type NavLink = {
  name: string;
  href: string;
  icon?: React.ReactNode;
};

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
});

export default function Header() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: user, mutate } = useSWR<{ id: string; name: string; email: string; role: string } | null>("/api/get-me", fetcher);
  const pathname = usePathname();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && (
    theme === "dark" || 
    theme === "pitch-dark" || 
    resolvedTheme === "dark" || 
    resolvedTheme === "pitch-dark"
  );

  const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        toast.success("Logged out");
        mutate(null);
        window.location.href = "/login";
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const navLinks: NavLink[] = [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQ", href: "/faq" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const authLinks: NavLink[] = user ? [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={14} /> },
    { name: "History", href: "/history", icon: <History size={14} /> },
  ] : [
    { name: "Login", href: "/login" },
    { name: "Sign Up", href: "/signup" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-6 lg:gap-10 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="group-hover:scale-105 transition-transform duration-500 ease-spring flex items-center justify-center w-8 h-8">
              <img 
                src="/icon.svg?v=2" 
                alt="ClipVault Logo" 
                className="w-8 h-8 object-contain" 
                style={isDark ? { filter: "invert(1) brightness(1.2)" } : undefined}
              />
            </div>
            <span className="text-xl font-black tracking-tighter text-foreground group-hover:opacity-80 transition-opacity whitespace-nowrap">
              ClipVault
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-xs font-black uppercase tracking-widest transition-all hover:text-indigo-500",
                  pathname === link.href ? "text-indigo-600" : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden lg:flex items-center gap-6 mr-4">
            {authLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all hover:text-indigo-500",
                  pathname === link.href ? "text-indigo-600" : "text-muted-foreground"
                )}
              >
                {"icon" in link && link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          <ThemeToggle />
          
          {user && (
            <>
              <div className="h-6 w-px bg-border mx-2 hidden sm:block"></div>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="hidden sm:inline-flex items-center px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-rose-500 transition-colors disabled:opacity-50"
              >
                {loading ? "..." : "Sign Out"}
              </button>
            </>
          )}

          <button 
            className="p-3 -mr-2 text-muted-foreground lg:hidden rounded-xl hover:bg-muted transition-colors" 
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-background border-b border-border animate-in fade-in slide-in-from-top-2 duration-300 shadow-2xl">
          <div className="px-4 py-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {navLinks.concat(authLinks).map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between p-5 rounded-2xl border border-border text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98]",
                    pathname === link.href ? "bg-indigo-600 text-white border-indigo-600" : "bg-muted/30 text-foreground hover:bg-muted/50"
                  )}
                >
                  <span className="flex items-center gap-3">
                    {"icon" in link && link.icon}
                    {link.name}
                  </span>
                  <ArrowRight size={14} className={cn("opacity-50", pathname === link.href && "opacity-100")} />
                </Link>
              ))}
            </div>
            
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-full px-4 py-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs font-black uppercase tracking-widest text-rose-500 transition"
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
