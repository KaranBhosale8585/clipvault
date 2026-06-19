import type { Metadata } from "next";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for ClipVault users. Use our core Instagram Reel Downloader for free during beta.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing | ClipVault",
    description: "Simple, transparent pricing for ClipVault users. Use our core Instagram Reel Downloader for free during beta.",
    url: "/pricing",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Pricing | ClipVault",
    description: "Simple, transparent pricing for ClipVault users. Use our core Instagram Reel Downloader for free during beta.",
  },
  icons: {
    icon: "/favicon.svg?v=2",
    shortcut: "/favicon.svg?v=2",
    apple: "/favicon.svg?v=2",
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter mb-6">Simple Pricing.</h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Choose the plan that fits your content saving needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          <Card className="p-6 md:p-12 border-border rounded-3xl md:rounded-[3rem] bg-card relative overflow-hidden group">
            <div className="relative z-10">
              <h2 className="text-xl md:text-2xl font-black mb-2">Guest</h2>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl md:text-5xl font-black">$0</span>
                <span className="text-muted-foreground font-bold text-xs md:text-sm">/forever</span>
              </div>
              <ul className="space-y-3 md:space-y-4 mb-10">
                <PricingFeature text="3 Free Extractions" />
                <PricingFeature text="High Quality Video" />
                <PricingFeature text="Anonymous Access" />
                <PricingFeature text="Global Proxy Support" strike />
                <PricingFeature text="History Sync" strike />
              </ul>
              <Link href="/">
                <Button variant="outline" className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl font-bold text-sm md:text-base">Try for Free</Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6 md:p-12 border-indigo-500/20 rounded-3xl md:rounded-[3rem] bg-indigo-600 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl md:text-2xl font-black">Pro User</h2>
                <span className="bg-white/20 text-white text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-widest">Active</span>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl md:text-5xl font-black">$0</span>
                <span className="text-indigo-200 font-bold text-xs md:text-sm">/beta</span>
              </div>
              <ul className="space-y-3 md:space-y-4 mb-10">
                <PricingFeature text="Unlimited Extractions" white />
                <PricingFeature text="Highest Resolution" white />
                <PricingFeature text="Full History Sync" white />
                <PricingFeature text="Premium Proxy Network" white />
                <PricingFeature text="Priority Extraction Engine" white />
              </ul>
              <Link href="/signup">
                <Button className="w-full h-12 md:h-14 bg-white text-indigo-600 hover:bg-indigo-50 rounded-xl md:rounded-2xl font-black text-sm md:text-lg">Create Account</Button>
              </Link>
            </div>
            <Sparkles className="absolute -top-12 -right-12 w-32 h-32 md:w-48 md:h-48 text-white/5 -rotate-12" />
          </Card>
        </div>
      </div>
    </div>
  );
}

function PricingFeature({ text, strike, white }: { text: string; strike?: boolean; white?: boolean }) {
  return (
    <li className={`flex items-center gap-3 font-medium ${strike ? "text-muted-foreground/50 line-through" : white ? "text-indigo-100" : "text-foreground"}`}>
      <Check className={`w-5 h-5 ${strike ? "text-muted-foreground/30" : white ? "text-white" : "text-indigo-500"}`} />
      {text}
    </li>
  );
}
