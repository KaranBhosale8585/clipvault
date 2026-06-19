"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global crash:", error);
  }, [error]);

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col items-center justify-center bg-slate-950 text-slate-50 font-sans p-6 text-center">
        <div className="max-w-md w-full space-y-8">
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-6 shadow-inner animate-bounce">
              <AlertTriangle size={36} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter mb-4">
              System Crash
            </h1>
            <p className="text-slate-400 font-medium text-sm leading-relaxed mb-8">
              A critical error occurred while loading the application shell. Please click below to reload the platform.
            </p>
            <Button 
              onClick={() => reset()}
              className="h-12 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold uppercase tracking-widest text-xs gap-2 px-6"
            >
              <RotateCcw size={16} /> Recover Platform
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
