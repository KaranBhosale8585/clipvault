"use client";

import { motion } from "framer-motion";
import { 
  Zap, ArrowRight, ShieldCheck, 
  History, Mail, Sparkles, MessageSquare
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DailyLimitReached() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-12"
    >
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-rose-500/10 rounded-2xl mb-4">
          <Zap className="w-8 h-8 text-rose-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tighter text-foreground leading-tight">
          Daily Limit Reached
        </h2>
        <p className="text-sm sm:text-base md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto px-2">
          You&apos;ve reached your limit of 10 extractions for today. To maintain engine performance for all users, we limit daily usage on the free tier.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <Link href="/unlimited-access" className="w-full">
          <Button size="lg" className="w-full h-14 md:h-20 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl md:rounded-[2rem] font-black text-base md:text-xl shadow-2xl shadow-indigo-500/20 gap-3 group">
            Request Unlimited Access <Sparkles className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
          </Button>
        </Link>
        <Link href="/contact" className="w-full">
          <Button variant="outline" size="lg" className="w-full h-14 md:h-20 border-border rounded-2xl md:rounded-[2rem] font-black text-base md:text-xl hover:bg-muted transition-all gap-3">
            <MessageSquare className="w-5 h-5 md:w-6 md:h-6" /> Contact Us
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pt-8">
        <InfoCard 
          icon={<History className="w-6 h-6 text-indigo-500" />}
          title="History Saved"
          desc="Your 10 downloads from today are already safe in your collection."
          label="Status"
        />
        <InfoCard 
          icon={<Zap className="w-6 h-6 text-amber-500" />}
          title="Auto Reset"
          desc="Your limit will automatically reset in 24 hours. Come back tomorrow!"
          label="Timer"
        />
        <InfoCard 
          icon={<ShieldCheck className="w-6 h-6 text-emerald-500" />}
          title="Priority Access"
          desc="Contact support if you need a higher daily quota for professional use."
          label="Support"
        />
      </div>

      <div className="pt-12 md:pt-20 border-t border-border">
        <h3 className="text-2xl md:text-4xl font-black tracking-tighter text-center mb-8 md:mb-16">Why do we have limits?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <BenefitItem 
            title="Fair Usage"
            desc="Limits ensure that no single user can overwhelm our high-speed extraction nodes, keeping the service fast for everyone."
          />
          <BenefitItem 
            title="Premium Infrastructure"
            desc="Every extraction consumes significant server resources. We offer 10 daily downloads for free as a commitment to the community."
          />
          <BenefitItem 
            title="Bot Prevention"
            desc="Daily quotas help us identify and prevent automated scraping, protecting the integrity of the platform."
          />
          <BenefitItem 
            title="Pro Support"
            desc="Need more? Our enterprise plans offer unlimited API access and higher concurrent extraction threads."
          />
        </div>
      </div>
    </motion.div>
  );
}

function InfoCard({ icon, title, desc, label }: { icon: React.ReactNode; title: string; desc: string; label: string }) {
  return (
    <Card className="p-6 md:p-8 border-border rounded-3xl md:rounded-[2.5rem] bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
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

function BenefitItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="space-y-2">
      <h4 className="text-lg font-black text-foreground">{title}</h4>
      <p className="text-sm text-muted-foreground font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
