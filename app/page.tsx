"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, Download, ShieldCheck, Zap, 
  Globe, Lock, Sparkles, CheckCircle2, History,
  LayoutDashboard, Play, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  name: string;
  email: string;
  role: string | null;
  isVerified: boolean | null;
}

export default function LandingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/get-me");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch {
        // Silently handle
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-40 md:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] overflow-hidden -z-10 opacity-40 pointer-events-none">
          <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-indigo-500/30 blur-[140px] rounded-full" />
          <div className="absolute top-[20%] left-1/4 w-[700px] h-[500px] bg-sky-400/20 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="outline" className="mb-8 px-5 py-2 rounded-full bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 font-black text-[10px] uppercase tracking-widest shadow-sm">
              <Sparkles className="w-3.5 h-3.5 mr-2 inline-block animate-pulse" />
              ClipVault v2.0 is now live
            </Badge>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60 leading-[0.85] py-2">
              Save Everything.<br />Securely.
            </h1>
            <p className="max-w-2xl mx-auto text-xl md:text-2xl text-muted-foreground font-medium mb-12 leading-relaxed">
              The world&apos;s most reliable Instagram Reel extraction engine. 
              Built for speed, designed for privacy.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/download">
                <Button size="lg" className="h-16 px-10 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-105 active:scale-[0.98] transition-all">
                  Start Downloading <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              {!user && !loading && (
                <div className="flex items-center gap-4">
                  <Link href="/signup">
                    <Button variant="outline" size="lg" className="h-16 px-10 border-border rounded-2xl font-black text-lg hover:bg-muted hover:scale-105 active:scale-[0.98] transition-all">
                      Sign Up Free
                    </Button>
                  </Link>
                  <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors px-4">
                    Login
                  </Link>
                </div>
              )}
            </div>

            {/* Stats Section */}
            <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-border pt-12">
               <div className="text-center">
                 <p className="text-3xl font-black text-foreground">1M+</p>
                 <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Extractions</p>
               </div>
               <div className="text-center">
                 <p className="text-3xl font-black text-foreground">99.9%</p>
                 <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Uptime</p>
               </div>
               <div className="text-center">
                 <p className="text-3xl font-black text-foreground">50k+</p>
                 <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Users</p>
               </div>
               <div className="text-center">
                 <p className="text-3xl font-black text-foreground">0.2s</p>
                 <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Avg Speed</p>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-foreground">How It Works</h2>
            <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
              Three simple steps to save your favorite content forever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <StepCard 
              num="01"
              title="Copy Link"
              desc="Copy the URL of the Instagram Reel you want to save from your browser or app."
            />
            <StepCard 
              num="02"
              title="Paste & Analyze"
              desc="Paste the link into the ClipVault extractor and let our engine process the metadata."
            />
            <StepCard 
              num="03"
              title="Download"
              desc="Choose your quality and save the file directly to your device in seconds."
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-foreground">Engineered for Performance.</h2>
            <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
              We replaced standard web scraping with advanced extraction logic to ensure your downloads never fail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-amber-500" />}
              title="Instant Metadata"
              desc="Real-time extraction of titles, thumbnails, and high-quality video streams in milliseconds."
            />
            <FeatureCard 
              icon={<Globe className="w-8 h-8 text-sky-500" />}
              title="Region Bypass"
              desc="Distributed extraction network allows you to bypass local restrictions and regional blocks."
            />
            <FeatureCard 
              icon={<Lock className="w-8 h-8 text-indigo-500" />}
              title="Privacy Vault"
              desc="Your data is your business. We don't store your history unless you create a secure account."
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-muted/20 border-t border-border">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-black tracking-tighter text-center mb-16">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <FaqItem 
              q="Is ClipVault free to use?" 
              a="Yes. Anonymous users get up to 3 free downloads. Registered users enjoy unlimited extractions and full history sync." 
            />
            <FaqItem 
              q="Does it support 4K resolution?" 
              a="Absolutely. We extract the highest possible resolution available directly from Instagram's content servers." 
            />
            <FaqItem 
              q="Is my data secure?" 
              a="We use enterprise-grade encryption. Your personal details and extraction history are never shared or sold." 
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-5xl mx-auto px-6">
          <Card className="border-border bg-indigo-600 text-white rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden shadow-3xl">
            <div className="relative z-10">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9]">
                Join the future of<br />content saving.
              </h2>
              <p className="text-indigo-100 text-xl font-medium mb-12 max-w-xl mx-auto opacity-90">
                Stop using outdated scrapers. Switch to ClipVault for the fastest extraction experience on the web.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/signup">
                  <Button size="lg" className="h-16 px-10 bg-white text-indigo-600 rounded-2xl font-black text-lg hover:bg-indigo-50 hover:scale-105 active:scale-[0.98] transition-all">
                    Sign Up Free
                  </Button>
                </Link>
                <Link href="/download">
                  <Button variant="outline" size="lg" className="h-16 px-10 border-white/20 bg-white/10 backdrop-blur-md text-white rounded-2xl font-black text-lg hover:bg-white/20 hover:scale-105 active:scale-[0.98] transition-all">
                    Try the Demo
                  </Button>
                </Link>
              </div>
            </div>
            <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]" />
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[100px]" />
          </Card>
        </div>
      </section>

    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="border-border bg-card rounded-[2.5rem] p-10 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500 border border-indigo-500/0 hover:border-indigo-500/10 group">
      <div className="mb-8 p-4 bg-muted rounded-3xl w-fit group-hover:bg-indigo-500/5 transition-colors duration-500">
        {icon}
      </div>
      <h3 className="text-2xl font-black tracking-tight text-foreground mb-4">{title}</h3>
      <p className="text-muted-foreground font-medium leading-relaxed">{desc}</p>
    </Card>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <Card className="border-border bg-card rounded-[2rem] p-8 shadow-sm hover:border-indigo-500/20 transition-all group">
      <h4 className="text-lg font-black mb-3 flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-indigo-500 opacity-50 group-hover:opacity-100" />
        {q}
      </h4>
      <p className="text-muted-foreground font-medium leading-relaxed pl-8">{a}</p>
    </Card>
  );
}

function StepCard({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="relative p-8 rounded-[2.5rem] bg-muted/50 border border-border hover:border-indigo-500/20 transition-all group">
      <span className="text-5xl font-black text-indigo-500/10 absolute top-4 right-8 group-hover:text-indigo-500/20 transition-colors">{num}</span>
      <h3 className="text-xl font-black mb-4 flex items-center gap-3">
        {title}
      </h3>
      <p className="text-muted-foreground font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
