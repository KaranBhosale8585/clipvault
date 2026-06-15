"use client";

import { motion } from "framer-motion";
import { 
  Lock, Zap, ShieldCheck, 
  History, ArrowRight, CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface LimitReachedProps {
  url?: string;
}

export default function LimitReached({ url }: LimitReachedProps) {
  const loginUrl = url ? `/login?callbackUrl=/?url=${encodeURIComponent(url)}` : "/login";
  const signupUrl = url ? `/signup?callbackUrl=/?url=${encodeURIComponent(url)}` : "/signup";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-12"
    >
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-amber-500/10 rounded-2xl mb-4">
          <Lock className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tighter text-foreground leading-tight">
          Free Download Limit Reached
        </h2>
        <p className="text-sm sm:text-base md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto px-2">
          You&apos;ve used all 3 free trial extractions. Join the ClipVault community to unlock unlimited high-speed downloads.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <Link href={signupUrl} className="w-full">
          <Button size="lg" className="w-full h-14 md:h-20 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl md:rounded-[2rem] font-black text-base md:text-xl shadow-2xl shadow-indigo-500/20 gap-3 group">
            Create Free Account <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        <Link href={loginUrl} className="w-full">
          <Button variant="outline" size="lg" className="w-full h-14 md:h-20 border-border rounded-2xl md:rounded-[2rem] font-black text-base md:text-xl hover:bg-muted transition-all">
            Sign In
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pt-8">
        <InfoCard 
          icon={<Zap className="w-6 h-6 text-amber-500" />}
          title="Unlimited Access"
          desc="Extract as many Reels as you want without any restrictions."
          label="Benefit"
        />
        <InfoCard 
          icon={<History className="w-6 h-6 text-indigo-500" />}
          title="Collection Sync"
          desc="Access your download history from any device, anytime."
          label="Feature"
        />
        <InfoCard 
          icon={<ShieldCheck className="w-6 h-6 text-emerald-500" />}
          title="Pro Extraction"
          desc="Priority processing on our fastest premium engine nodes."
          label="Feature"
        />
      </div>

      <div className="pt-12 md:pt-20 border-t border-border">
        <h3 className="text-2xl md:text-4xl font-black tracking-tighter text-center mb-8 md:mb-16">Premium Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureItem title="1080p Support" desc="High resolution source extraction" />
          <FeatureItem title="No Watermarks" desc="Pure video content from Instagram" />
          <FeatureItem title="Secure Proxy" desc="Bypass all geographic restrictions" />
          <FeatureItem title="Mobile Ready" desc="Optimized for iOS and Android" />
        </div>
      </div>

      <div className="pt-12 md:pt-20 border-t border-border">
        <h3 className="text-2xl md:text-4xl font-black tracking-tighter text-center mb-8 md:mb-16">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <FaqItem 
            q="Why is there a limit?"
            a="To maintain high speeds for all users, we limit anonymous access. Accounts help us prevent abuse and provide personalized history."
          />
          <FaqItem 
            q="Is it really free?"
            a="Yes! Registered users get unlimited access during our beta phase. No credit card required."
          />
          <FaqItem 
            q="Will my history be saved?"
            a="Only if you have an account. Once logged in, every extraction is securely stored in your personal vault."
          />
          <FaqItem 
            q="Can I download 4K video?"
            a="We always fetch the highest quality source available from Instagram's servers, including 1080p and higher where available."
          />
        </div>
      </div>
    </motion.div>
  );
}

function InfoCard({ icon, title, desc, label }: { icon: React.ReactNode; title: string; desc: string; label: string }) {
  return (
    <Card className="p-6 md:p-8 border-border rounded-[2rem] md:rounded-[2.5rem] bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
      <div className="absolute top-4 right-6 text-[8px] font-black uppercase tracking-widest text-muted-foreground/30 group-hover:text-indigo-500/30 transition-colors">
        {label}
      </div>
      <div className="mb-4 md:mb-6 p-3 bg-muted rounded-2xl w-fit">
        {icon}
      </div>
      <h4 className="text-base md:text-lg font-black mb-2">{title}</h4>
      <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed">{desc}</p>
    </Card>
  );
}

function FeatureItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-5 bg-muted/30 rounded-2xl border border-transparent hover:border-border transition-all">
      <h5 className="text-xs font-black uppercase tracking-widest text-foreground mb-1">{title}</h5>
      <p className="text-[10px] text-muted-foreground font-medium">{desc}</p>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="space-y-2 md:space-y-4">
      <h4 className="text-base md:text-lg font-bold flex items-center gap-3">
        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-indigo-500 shrink-0" />
        {q}
      </h4>
      <p className="text-muted-foreground font-medium leading-relaxed pl-7 md:pl-8 text-xs md:text-sm">
        {a}
      </p>
    </div>
  );
}
