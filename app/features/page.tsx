import type { Metadata } from "next";
import { Zap, Globe, Lock, Download, Sparkles, Smartphone } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Features",
  description: "Explore the advanced technical features of ClipVault's high-speed content extraction engine.",
  alternates: {
    canonical: "/features",
  },
  openGraph: {
    title: "Features | ClipVault",
    description: "Explore the advanced technical features of ClipVault's high-speed content extraction engine.",
    url: "/features",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Features | ClipVault",
    description: "Explore the advanced technical features of ClipVault's high-speed content extraction engine.",
  }
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 md:mb-20">
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter mb-6">Built for Creators.</h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            We&apos;ve packed ClipVault with industry-leading features to make content saving effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <FeatureItem 
            icon={<Zap className="w-8 h-8 text-amber-500" />}
            title="Instant Extraction"
            desc="Our custom Python backend processes URLs in under 500ms."
          />
          <FeatureItem 
            icon={<Globe className="w-8 h-8 text-sky-500" />}
            title="Global Proxy Network"
            desc="Extract content from any region without being blocked by local restrictions."
          />
          <FeatureItem 
            icon={<Lock className="w-8 h-8 text-indigo-500" />}
            title="Secure Vault"
            desc="All downloads are proxied through our servers, keeping your IP address hidden."
          />
          <FeatureItem 
            icon={<Download className="w-8 h-8 text-emerald-500" />}
            title="High Resolution"
            desc="Always fetches the highest quality 1080p source file available."
          />
          <FeatureItem 
            icon={<Sparkles className="w-8 h-8 text-purple-500" />}
            title="History Sync"
            desc="Access your past extractions from any device with a secure account."
          />
          <FeatureItem 
            icon={<Smartphone className="w-8 h-8 text-rose-500" />}
            title="Mobile Ready"
            desc="Perfectly optimized for iOS and Android browsers. No app install needed."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="p-5 md:p-10 border-border rounded-3xl md:rounded-[2.5rem] bg-card hover:shadow-xl transition-all">
      <div className="mb-6 md:mb-8 p-3 md:p-4 bg-muted rounded-2xl md:rounded-3xl w-fit">
        {icon}
      </div>
      <h3 className="text-xl md:text-2xl font-black mb-4">{title}</h3>
      <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed">{desc}</p>
    </Card>
  );
}
