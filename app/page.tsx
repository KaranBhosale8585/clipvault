"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { 
  Zap, Lock, LayoutDashboard, Sparkles,
  ArrowRight, CheckCircle2
} from "lucide-react";
import ReelDownloader from "@/components/ReelDownloader";
import DownloadHistory from "@/components/DownloadHistory";
import LimitReached from "@/components/LimitReached";
import DailyLimitReached from "@/components/DailyLimitReached";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
};

export default function DownloadDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [isDailyLimitReached, setIsDailyLimitReached] = useState(false);
  const [lastUrl, setLastUrl] = useState("");

  // Structured Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ClipVault",
    "url": "https://clipvault.com/",
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

        if (res.ok) {
          setUser(data);
        }
      } catch {
        // Silently handle auth fetch errors
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

      if (res.ok) {
        toast.success("Logged out successfully");
        window.location.href = "/login";
      }
    } catch {
      toast.error("Logout error");
    }
  };

  const handleLimitReached = (url: string) => {
    setLastUrl(url);
    setIsLimitReached(true);
  };

  const handleDailyLimitReached = () => {
    setIsDailyLimitReached(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-4xl space-y-8 animate-pulse">
          <div className="h-16 w-64 bg-muted rounded-2xl mx-auto" />
          <div className="h-64 w-full bg-muted rounded-[3rem]" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted rounded-3xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500/30 overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-24">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 md:gap-16 items-start">
          
          {/* Main Feed */}
          <div className="xl:col-span-2 space-y-8 md:space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 md:space-y-10"
            >
              {!isLimitReached && !isDailyLimitReached ? (
                <>
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                      <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter mb-2 leading-tight">
                        {user ? `Welcome, ${user.name.split(' ')[0]}` : "ClipVault"}
                      </h1>
                      <p className="text-muted-foreground font-medium text-base md:text-xl max-w-xl">
                        {user ? "Manage your saved Reels and start new extractions." : "Start your free trial extraction below."}
                      </p>
                    </div>
                  </div>

                  <Card className="border-border bg-card/50 backdrop-blur-2xl rounded-3xl md:rounded-[3rem] p-4 md:p-10 shadow-2xl shadow-indigo-500/5 relative overflow-hidden group">
                    <div className="relative z-10">
                      <ReelDownloader 
                        onLimitReached={handleLimitReached} 
                        onDailyLimitReached={handleDailyLimitReached}
                      />
                    </div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl" />
                  </Card>
                </>
              ) : isLimitReached ? (
                <LimitReached url={lastUrl} />
              ) : (
                <DailyLimitReached />
              )}

              <AnimatePresence mode="wait">
                {user ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8 pt-8"
                  >
                    <div className="flex items-center justify-between border-t border-border pt-12">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-black tracking-tighter">Your Collection</h2>
                        <p className="text-sm md:text-base text-muted-foreground font-medium">History of your recent extractions.</p>
                      </div>
                    </div>
                    <DownloadHistory />
                  </motion.div>
                ) : !isLimitReached && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="pt-12"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FeatureCard 
                        icon={<Zap className="w-6 h-6 text-amber-500" />}
                        title="Fast Extraction"
                        desc="Premium servers ensure your Reels are processed in seconds."
                      />
                      <FeatureCard 
                        icon={<Lock className="w-6 h-6 text-indigo-500" />}
                        title="Private & Secure"
                        desc="We don't sell your data. Your extraction history belongs to you."
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8 md:sticky md:top-28">
            <AnimatePresence mode="wait">
              {user ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  <Card className="border-border rounded-[2rem] p-6 md:p-8 bg-card shadow-sm border border-indigo-500/5 group">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-12 w-12 md:h-14 md:w-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black text-white shadow-xl shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-base md:text-lg font-black text-foreground truncate">{user.name}</p>
                        <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {user.role === "admin" && (
                        <Link href="/admin">
                          <Button className="w-full h-11 md:h-12 bg-indigo-600 text-white rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 active:scale-[0.98] transition-all gap-3">
                            <LayoutDashboard className="w-4 h-4" /> Admin Control
                          </Button>
                        </Link>
                      )}
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full h-11 md:h-12 border-border rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest hover:bg-muted active:scale-[0.98] transition-all"
                      >
                        Sign Out
                      </Button>
                    </div>
                  </Card>

                  <Card className="border-border rounded-[2rem] p-6 md:p-8 bg-indigo-50 dark:bg-indigo-500/5 border-dashed relative overflow-hidden">
                    <div className="relative z-10">
                      <h4 className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">Pro Status</h4>
                      <p className="text-xl md:text-2xl font-black text-foreground mb-4">Unlimited Access</p>
                      <div className="flex items-center gap-2 text-muted-foreground font-medium text-xs md:text-sm">
                        <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                        <span>Lifetime active license</span>
                      </div>
                    </div>
                    <Sparkles className="absolute -top-4 -right-4 w-20 h-20 md:w-24 md:h-24 text-indigo-500/10 -rotate-12" />
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="border-border rounded-3xl md:rounded-[2.5rem] p-6 md:p-12 bg-indigo-600 text-white shadow-2xl shadow-indigo-500/20 text-center relative overflow-hidden group">
                    <div className="relative z-10">
                      <h3 className="text-2xl sm:text-3xl font-black tracking-tighter mb-4 leading-tight">Ready for more?</h3>
                      <p className="text-indigo-100 font-medium mb-8 leading-relaxed opacity-90 text-sm md:text-base">
                        Create a free account to unlock unlimited downloads, history sync, and premium features.
                      </p>
                      <Link href="/signup">
                        <Button size="lg" className="w-full h-14 md:h-16 bg-white text-indigo-600 rounded-2xl font-black text-base hover:bg-indigo-50 active:scale-[0.98] transition-all shadow-xl shadow-black/20 group-hover:gap-4 gap-2">
                          Start Saving Now <ArrowRight className="w-5 h-5" />
                        </Button>
                      </Link>
                      <div className="mt-6">
                        <Link href="/login" className="text-xs font-bold text-indigo-200 hover:text-white transition-colors">
                          Already have an account? Log in
                        </Link>
                      </div>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-700 -z-10" />
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="border-border bg-card rounded-2xl md:rounded-[2rem] p-5 md:p-8 shadow-sm hover:shadow-md transition-all border border-indigo-500/0 hover:border-indigo-500/5 group">
      <div className="mb-4 md:mb-6 p-3 bg-muted rounded-2xl w-fit group-hover:bg-indigo-500/5 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-base md:text-lg font-black tracking-tight text-foreground mb-3">{title}</h3>
      <p className="text-xs md:text-sm font-medium text-muted-foreground leading-relaxed">{desc}</p>
    </Card>
  );
}
