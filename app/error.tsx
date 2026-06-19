"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

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
            <span className="text-[12rem] font-black tracking-tighter select-none text-rose-500">500</span>
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="h-16 w-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mb-6 shadow-inner animate-pulse">
              <AlertCircle size={36} />
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground mb-4">
              Something Went Wrong
            </h1>
            <p className="text-muted-foreground font-medium text-sm md:text-base leading-relaxed">
              An unexpected error occurred in our system. We have been notified and are working to resolve the issue as quickly as possible.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button 
            onClick={() => reset()}
            className="w-full sm:w-auto h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold uppercase tracking-widest text-xs gap-2 px-6"
          >
            <RotateCcw size={16} /> Try Again
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full h-12 border-border rounded-xl font-bold uppercase tracking-widest text-xs gap-2 px-6 hover:bg-muted">
              <Home size={16} /> Go Home
            </Button>
          </Link>
        </div>

        <div className="border-t border-border pt-8 text-xs text-muted-foreground font-medium">
          If you continue to experience this error, please reach out to us at <a href="mailto:support@clipvault.com" className="text-indigo-500 hover:underline">support@clipvault.com</a>.
        </div>
      </motion.div>
    </div>
  );
}
