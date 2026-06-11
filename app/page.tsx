"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import ReelDownloader from "@/components/ReelDownloader";
import DownloadHistory from "@/components/DownloadHistory";

type User = {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/get-me", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Failed to fetch user");
        } else {
          setUser(data);
          toast.success(`Welcome back, ${data.name} 👋`);
        }
      } catch {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Logout failed");
      } else {
        toast.success("Logged out successfully");
        window.location.href = "/login";
      }
    } catch {
      toast.error("Logout error");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background transition-colors duration-300 px-6 py-12 md:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-foreground mb-3">
              Workspace
            </h1>
            <p className="text-muted-foreground font-medium text-lg">
              Download, manage, and track your favorite Instagram Reels.
            </p>
          </div>
          
          {user && (
            <div className="flex items-center gap-4 bg-card border border-border p-2 rounded-2xl pr-6">
              <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-indigo-500/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{user.name}</p>
                <p className="text-xs font-medium text-muted-foreground">{user.email}</p>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 animate-pulse">
              <div className="h-64 bg-card border border-border rounded-3xl"></div>
              <div className="h-96 bg-card border border-border rounded-3xl"></div>
            </div>
            <div className="space-y-8 animate-pulse">
              <div className="h-64 bg-card border border-border rounded-3xl"></div>
            </div>
          </div>
        ) : user ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Main Section: Downloader */}
            <div className="lg:col-span-2 space-y-8">
              <ReelDownloader />
              <DownloadHistory />
            </div>

            {/* Sidebar: Profile & Settings */}
            <div className="space-y-8">
              <div className="group relative overflow-hidden bg-card border border-border rounded-3xl p-8 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/20">
                <h3 className="text-lg font-bold text-foreground mb-6">Profile Security</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    {user.isVerified ? (
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        Identity Verified
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                        Verification Required
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-background rounded-2xl border border-border">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Account ID</p>
                    <p className="text-xs font-mono font-medium text-foreground">{user.id}</p>
                  </div>
                </div>

                {/* Background Decor */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>
              </div>

              <div className="bg-card border border-border rounded-3xl p-8 transition-all hover:shadow-2xl hover:shadow-indigo-500/5 hover:border-indigo-500/20">
                <h3 className="text-lg font-bold text-foreground mb-4">Account Settings</h3>
                <div className="space-y-3">
                  <button
                    disabled
                    className="w-full py-3 px-4 bg-background text-muted-foreground rounded-xl font-bold text-xs uppercase tracking-widest text-left border border-border cursor-not-allowed"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 px-4 bg-foreground text-background rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98]"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-card border border-border rounded-3xl">
            <p className="text-muted-foreground font-medium mb-6 text-lg">Session expired or not found.</p>
            <Link
              href="/login"
              className="inline-flex h-14 items-center justify-center px-10 bg-foreground text-background rounded-2xl font-bold text-sm uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
