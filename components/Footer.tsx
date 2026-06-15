"use client";

import Link from "next/link";
import { Sparkles, Globe, MessageSquare } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border text-muted-foreground transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 flex flex-col md:flex-row items-start justify-between gap-12">
        
        <div className="flex flex-col gap-6 max-w-sm">
          <div className="flex items-center gap-2.5 text-foreground font-black text-xl tracking-tighter">
            <div className="bg-foreground p-1.5 rounded-xl text-background shadow-lg shadow-indigo-500/5">
              <Sparkles size={16} fill="currentColor" />
            </div>
            ClipVault
          </div>
          <p className="text-sm leading-relaxed font-medium">
            ClipVault is the world&apos;s most reliable Instagram Reel extraction engine, engineered for speed, privacy, and high-resolution performance.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/KaranBhosale8585" target="_blank" className="p-2 bg-muted rounded-xl hover:bg-indigo-500/10 hover:text-indigo-500 transition-all">
              <MessageSquare size={18} />
            </a>
            <a href="#" className="p-2 bg-muted rounded-xl hover:bg-indigo-500/10 hover:text-indigo-500 transition-all">
              <Globe size={18} />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-20">
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Platform</h4>
            <div className="flex flex-col gap-3 text-sm font-medium">
              <Link href="/" className="hover:text-indigo-500 transition-colors">Downloader</Link>
              <Link href="/features" className="hover:text-indigo-500 transition-colors">Features</Link>
              <Link href="/pricing" className="hover:text-indigo-500 transition-colors">Pricing</Link>
              <Link href="/about" className="hover:text-indigo-500 transition-colors">About Us</Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Account</h4>
            <div className="flex flex-col gap-3 text-sm font-medium">
              <Link href="/dashboard" className="hover:text-indigo-500 transition-colors">Dashboard</Link>
              <Link href="/history" className="hover:text-indigo-500 transition-colors">History</Link>
              <Link href="/login" className="hover:text-indigo-500 transition-colors">Sign In</Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Support</h4>
            <div className="flex flex-col gap-3 text-sm font-medium">
              <Link href="/contact" className="hover:text-indigo-500 transition-colors">Contact</Link>
              <a href="mailto:support@clipvault.com" className="hover:text-indigo-500 transition-colors">Email Support</a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground border-t border-border pt-10">
        <p suppressHydrationWarning>
          © {currentYear} ClipVault Infrastructure • All Rights Reserved
        </p>
        <p className="flex items-center gap-1">
          Developed by <span className="text-foreground">Karan Bhosale</span>
        </p>
      </div>
    </footer>
  );
}
