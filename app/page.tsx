"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

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
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#020617] transition-colors duration-300 px-6 py-12 md:py-20">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
            Workspace
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Securely manage your personal identity and security settings.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            <div className="md:col-span-2 h-64 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl"></div>
            <div className="h-64 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl"></div>
          </div>
        ) : user ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Bento Tile: Profile */}
            <div className="md:col-span-2 group relative overflow-hidden bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/20">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-6 mb-8">
                    <div className="h-20 w-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-indigo-500/20">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                        {user.name}
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      Member ID: <span className="text-slate-900 dark:text-slate-200">{user.id.slice(0, 8)}...</span>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    {user.isVerified ? (
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        Identity Verified
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                        Verification Required
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Background Decor */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>
            </div>

            {/* Second Bento Tile: Actions */}
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col justify-between transition-all hover:shadow-2xl hover:shadow-slate-500/5 hover:border-slate-300 dark:hover:border-slate-700">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Account Settings
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                  Update your security preferences and session data.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  disabled
                  className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl font-bold text-sm text-left border border-slate-200 dark:border-slate-700 cursor-not-allowed"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-3 px-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl">
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">Session expired or not found.</p>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center px-8 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-bold transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
