"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { ShieldCheck, ExternalLink } from "lucide-react";
import ReelDownloader from "@/components/ReelDownloader";
import DownloadHistory from "@/components/DownloadHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Structured Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Vault Downloader",
    "url": "https://vault-downloader.com",
    "description": "Download high-quality Instagram Reels instantly and securely.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
            <Card className="flex items-center gap-4 border-border p-2 rounded-2xl pr-6 bg-card shadow-sm">
              <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-indigo-500/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{user.name}</p>
                <p className="text-xs font-medium text-muted-foreground">{user.email}</p>
              </div>
            </Card>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-64 rounded-3xl" />
              <Skeleton className="h-96 rounded-3xl" />
            </div>
            <div className="space-y-8">
              <Skeleton className="h-64 rounded-3xl" />
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
              <Card className="group relative overflow-hidden border-border rounded-3xl p-8 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/20">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-lg font-bold text-foreground">Profile Security</CardTitle>
                </CardHeader>
                
                <CardContent className="p-0 space-y-6">
                  <div className="flex items-center gap-4">
                    {user.isVerified ? (
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-3 py-1 font-bold text-xs uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2 inline-block"></div>
                        Identity Verified
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 px-3 py-1 font-bold text-xs uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse mr-2 inline-block"></div>
                        Verification Required
                      </Badge>
                    )}
                  </div>

                  <div className="p-4 bg-background rounded-2xl border border-border">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Account ID</p>
                    <p className="text-xs font-mono font-medium text-foreground">{user.id}</p>
                  </div>

                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="flex items-center justify-between p-4 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/20 rounded-2xl transition-all group/admin"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500 rounded-lg text-white group-hover/admin:scale-110 transition-transform">
                          <ShieldCheck size={16} />
                        </div>
                        <span className="text-sm font-bold text-indigo-500">Admin Control</span>
                      </div>
                      <ExternalLink size={14} className="text-indigo-500" />
                    </Link>
                  )}
                </CardContent>
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>
              </Card>

              <Card className="border-border rounded-3xl p-8 transition-all hover:shadow-2xl hover:shadow-indigo-500/5 hover:border-indigo-500/20">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg font-bold text-foreground">Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                  <Button
                    variant="outline"
                    disabled
                    className="w-full h-12 rounded-xl font-bold text-xs uppercase tracking-widest justify-start border-border cursor-not-allowed opacity-50"
                  >
                    Edit Profile
                  </Button>
                  <Button
                    onClick={handleLogout}
                    className="w-full h-12 bg-foreground text-background rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98]"
                  >
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
              <ReelDownloader />
            </div>
            <div className="space-y-8">
              <Card className="border-border rounded-3xl p-8 bg-indigo-50 dark:bg-indigo-500/5 text-center">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl font-black text-indigo-600 dark:text-indigo-400">Unlock Unlimited Downloads</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-muted-foreground font-medium mb-6">
                    You have 1 free download available. Sign up now to get unlimited downloads, save your history, and manage all your Reels in one secure workspace.
                  </p>
                  <Link
                    href="/signup"
                    className="flex w-full h-14 items-center justify-center bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 active:scale-[0.98] transition-all"
                  >
                    Create Free Account
                  </Link>
                  <div className="mt-4">
                    <Link href="/login" className="text-xs font-bold text-muted-foreground hover:text-foreground">
                      Already have an account? Log in
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
