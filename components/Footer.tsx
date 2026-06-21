"use client";

import Link from "next/link";
import { Globe, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function Footer() {
  const currentYear = new Date().getFullYear();
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

  return (
    <footer className="bg-background border-t border-border text-muted-foreground transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-12 md:py-16 flex flex-col lg:flex-row items-start justify-between gap-12">
        
        <div className="flex flex-col gap-6 max-w-sm w-full">
          <div className="flex items-center gap-2.5 text-foreground font-black text-xl tracking-tighter">
            <div className="flex items-center justify-center w-7 h-7">
              <img 
                src="/icon.svg?v=2" 
                alt="ClipVault Logo" 
                className="w-7 h-7 object-contain" 
                style={isDark ? { filter: "invert(1) brightness(1.2)" } : undefined}
              />
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12 lg:gap-20 w-full lg:w-auto">
          <div className="flex flex-col gap-4 text-center sm:text-left">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Platform</h4>
            <div className="flex flex-col gap-3 text-sm font-medium">
              <Link href="/" className="hover:text-indigo-500 transition-colors">Downloader</Link>
              <Link href="/features" className="hover:text-indigo-500 transition-colors">Features</Link>
              <Link href="/pricing" className="hover:text-indigo-500 transition-colors">Pricing</Link>
              <Link href="/about" className="hover:text-indigo-500 transition-colors">About Us</Link>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-center sm:text-left">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Resources</h4>
            <div className="flex flex-col gap-3 text-sm font-medium">
              <Link href="/instagram-reel-downloader" className="hover:text-indigo-500 transition-colors">Reel Downloader</Link>
              <Link href="/instagram-video-downloader" className="hover:text-indigo-500 transition-colors">Video Downloader</Link>
              <Link href="/how-to-download-instagram-reels" className="hover:text-indigo-500 transition-colors">How-to Guide</Link>
              <Link href="/faq" className="hover:text-indigo-500 transition-colors">FAQ Page</Link>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-center sm:text-left">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Account</h4>
            <div className="flex flex-col gap-3 text-sm font-medium">
              <Link href="/dashboard" className="hover:text-indigo-500 transition-colors">Dashboard</Link>
              <Link href="/history" className="hover:text-indigo-500 transition-colors">History</Link>
              <Link href="/login" className="hover:text-indigo-500 transition-colors">Sign In</Link>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-center sm:text-left">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Support & Legal</h4>
            <div className="flex flex-col gap-3 text-sm font-medium">
              <Link href="/contact" className="hover:text-indigo-500 transition-colors">Contact Us</Link>
              <Link href="/privacy" className="hover:text-indigo-500 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-indigo-500 transition-colors">Terms & Conditions</Link>
              <a href="mailto:support@clipvault.com" className="hover:text-indigo-500 transition-colors">Email Support</a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 pb-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground border-t border-border pt-10 text-center md:text-left">
        <p suppressHydrationWarning>
          © {currentYear} ClipVault Infrastructure • All Rights Reserved
        </p>
        <p className="flex items-center justify-center md:justify-end gap-1 w-full md:w-auto">
          Developed by <span className="text-foreground">Karan Bhosale</span>
        </p>
      </div>
    </footer>
  );
}
