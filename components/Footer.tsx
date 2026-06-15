"use client";

import Link from "next/link";
import { Sparkles, Mail } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border text-muted-foreground transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 flex flex-col md:flex-row items-start justify-between gap-12">
        
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="flex items-center gap-2.5 text-foreground font-black text-xl tracking-tighter">
            <div className="bg-foreground p-1.5 rounded-xl text-background shadow-lg shadow-indigo-500/5">
              <Sparkles size={16} fill="currentColor" />
            </div>
            ClipVault
          </div>
          <p className="text-sm leading-relaxed font-medium">
            Fast, secure, and reliable content extraction powered by premium technology.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-20">
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Platform</h4>
            <div className="flex flex-col gap-3 text-sm font-medium">
              <Link href="/" className="hover:text-indigo-500 transition-colors">Workspace</Link>
              <Link href="/login" className="hover:text-indigo-500 transition-colors">Sign In</Link>
              <Link href="/signup" className="hover:text-indigo-500 transition-colors">Join ClipVault</Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Connect</h4>
            <div className="flex flex-col gap-3 text-sm font-medium">
              <a href="https://github.com/KaranBhosale8585" target="_blank" className="hover:text-indigo-500 transition-colors">GitHub</a>
              <a href="mailto:karanbhosale8586@email.com" className="hover:text-indigo-500 transition-colors">Email</a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground border-t border-border pt-10">
        <p suppressHydrationWarning>
          © {new Date().getFullYear()} ClipVault Infrastructure
        </p>
        <p className="flex items-center gap-1">
          Designed by <span className="text-foreground">Karan Bhosale</span>
        </p>
      </div>
    </footer>
  );
}
