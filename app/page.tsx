"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { 
  ShieldCheck, ExternalLink, Zap, Lock, 
  Download, History, LayoutDashboard, Sparkles,
  ArrowRight, CheckCircle2, Globe
} from "lucide-react";
import ReelDownloader from "@/components/ReelDownloader";
import DownloadHistory from "@/components/DownloadHistory";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

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
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] overflow-hidden -z-10 opacity-30 pointer-events-none">
          <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/30 blur-[120px] rounded-full" />
          <div className="absolute top-[20%] left-1/4 w-[600px] h-[400px] bg-sky-400/20 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 font-black text-[10px] uppercase tracking-widest shadow-sm">
              <Sparkles className="w-3 h-3 mr-2 inline-block animate-pulse" />
              Next-Gen Instagram Extraction
            </Badge>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60 leading-[0.9]">
              Instagram Reels,<br />Fast & Secure.
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-medium mb-12 leading-relaxed">
              Experience the web's most reliable Reel downloader. No ads, no tracking, just premium extraction technology.
            </p>
          </motion.div>

          {/* Core Downloader */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="border-border bg-card/50 backdrop-blur-2xl rounded-[2.5rem] p-4 md:p-8 shadow-2xl shadow-indigo-500/10 overflow-hidden relative group">
              <div className="relative z-10">
                <ReelDownloader />
              </div>
              {/* Decorative Glow */}
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl group-hover:bg-indigo-600/10 transition-colors duration-500" />
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Main Content Workspace */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-12">
            <AnimatePresence mode="wait">
              {user ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-12"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-black tracking-tighter">Your Collection</h2>
                      <p className="text-muted-foreground font-medium">Recently saved media and history.</p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl border-border hidden md:flex">
                      <History className="w-4 h-4 mr-2" /> Full History
                    </Button>
                  </div>
                  <DownloadHistory />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-12"
                >
                  <div className="text-center md:text-left">
                    <h2 className="text-3xl font-black tracking-tighter mb-4">Why use Vault?</h2>
                    <p className="text-muted-foreground font-medium max-w-xl">
                      Standard downloaders are slow, ad-heavy, and compromise your privacy. Vault built a better way.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FeatureCard 
                      icon={<Zap className="w-6 h-6 text-amber-500" />}
                      title="Instant Extraction"
                      desc="Direct-to-server metadata extraction means you get your content in seconds, not minutes."
                    />
                    <FeatureCard 
                      icon={<ShieldCheck className="w-6 h-6 text-indigo-500" />}
                      title="Privacy First"
                      desc="We don't track your downloads or store your data. Your extraction history is encrypted and private."
                    />
                    <FeatureCard 
                      icon={<Globe className="w-6 h-6 text-sky-500" />}
                      title="Global CDN"
                      desc="Bypass regional blocks and local restrictions with our distributed proxy network."
                    />
                    <FeatureCard 
                      icon={<Lock className="w-6 h-6 text-emerald-500" />}
                      title="100% Free"
                      desc="One free anonymous download, then unlimited usage for registered users. No hidden costs."
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {user ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  <Card className="border-border rounded-[2rem] p-8 bg-card shadow-sm border border-indigo-500/5 group">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-lg font-black text-foreground">{user.name}</p>
                        <p className="text-sm font-medium text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {user.role === "admin" && (
                        <Link href="/admin">
                          <Button className="w-full h-12 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 active:scale-[0.98] transition-all gap-3">
                            <LayoutDashboard className="w-4 h-4" /> Admin Control
                          </Button>
                        </Link>
                      )}
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full h-12 border-border rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-muted active:scale-[0.98] transition-all"
                      >
                        Sign Out
                      </Button>
                    </div>
                  </Card>

                  <Card className="border-border rounded-[2rem] p-8 bg-indigo-50 dark:bg-indigo-500/5 border-dashed relative overflow-hidden">
                    <div className="relative z-10">
                      <h4 className="text-sm font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">Pro Status</h4>
                      <p className="text-2xl font-black text-foreground mb-4">Unlimited Access</p>
                      <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
                        <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                        <span>Lifetime active license</span>
                      </div>
                    </div>
                    <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-indigo-500/10 -rotate-12" />
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="border-border rounded-[2rem] p-10 bg-indigo-600 text-white shadow-2xl shadow-indigo-500/20 text-center relative overflow-hidden group">
                    <div className="relative z-10">
                      <h3 className="text-3xl font-black tracking-tighter mb-4 leading-tight">Ready for more?</h3>
                      <p className="text-indigo-100 font-medium mb-8 leading-relaxed opacity-90">
                        Create a free account to unlock unlimited downloads, history sync, and premium features.
                      </p>
                      <Link href="/signup">
                        <Button size="lg" className="w-full h-16 bg-white text-indigo-600 rounded-2xl font-black text-md hover:bg-indigo-50 active:scale-[0.98] transition-all shadow-xl shadow-black/20 group-hover:gap-4 gap-2">
                          Start Saving Now <ArrowRight className="w-5 h-5" />
                        </Button>
                      </Link>
                      <div className="mt-6">
                        <Link href="/login" className="text-xs font-bold text-indigo-200 hover:text-white transition-colors">
                          Already have an account? Log in
                        </Link>
                      </div>
                    </div>
                    {/* Background Animation Element */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-700 -z-10" />
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="border-border bg-card rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all border border-indigo-500/0 hover:border-indigo-500/5 group">
      <div className="mb-6 p-3 bg-muted rounded-2xl w-fit group-hover:bg-indigo-500/5 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-black tracking-tight text-foreground mb-3">{title}</h3>
      <p className="text-sm font-medium text-muted-foreground leading-relaxed">{desc}</p>
    </Card>
  );
}

