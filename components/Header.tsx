"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, LogOut, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Logout failed");
        return;
      }

      toast.success("Logged out");
      router.push("/login");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
        >
          <div className="bg-foreground p-1.5 rounded-xl text-background shadow-lg shadow-indigo-500/10 group-hover:scale-105 transition-transform duration-500 ease-spring">
            <Sparkles size={18} fill="currentColor" />
          </div>
          <span className="text-xl font-black tracking-tighter text-foreground group-hover:opacity-80 transition-opacity">
            Vault
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="h-6 w-px bg-border mx-2 hidden sm:block"></div>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="hidden sm:inline-flex items-center px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Sign Out"}
          </button>
          <button 
            className="p-2 text-muted-foreground md:hidden" 
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="px-6 py-8 space-y-6">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-4 py-4 bg-background border border-border rounded-2xl text-sm font-bold text-foreground transition"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
