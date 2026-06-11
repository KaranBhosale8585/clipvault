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
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white hover:opacity-80 transition"
        >
          <div className="bg-black dark:bg-white p-1.5 rounded-lg text-white dark:text-black">
            <Sparkles size={18} fill="currentColor" />
          </div>
          Auth
        </Link>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-all disabled:opacity-50"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button 
            className="p-2 text-gray-600 dark:text-gray-400" 
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-top-1">
          <div className="px-6 py-6 space-y-4">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
