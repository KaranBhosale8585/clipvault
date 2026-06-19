"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, FileQuestion, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-12 md:py-24 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <span className="text-[12rem] font-black tracking-tighter select-none">404</span>
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="h-16 w-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-6 shadow-inner">
              <FileQuestion size={36} />
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground mb-4">
              Page Not Found
            </h1>
            <p className="text-muted-foreground font-medium text-sm md:text-base leading-relaxed">
              We couldn&apos;t find the page you were looking for. It might have been moved, deleted, or never existed in the first place.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold uppercase tracking-widest text-xs gap-2 px-6">
              <Home size={16} /> Go Home
            </Button>
          </Link>
          <Link href="/contact" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full h-12 border-border rounded-xl font-bold uppercase tracking-widest text-xs gap-2 px-6 hover:bg-muted">
              <HelpCircle size={16} /> Contact Support
            </Button>
          </Link>
        </div>

        <div className="border-t border-border pt-8 text-xs text-muted-foreground font-medium">
          If you think this is a bug, please let us know. You can explore our <Link href="/features" className="text-indigo-500 hover:underline">Features</Link> or view our <Link href="/pricing" className="text-indigo-500 hover:underline">Pricing</Link>.
        </div>
      </motion.div>
    </div>
  );
}
