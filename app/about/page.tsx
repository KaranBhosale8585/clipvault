import type { Metadata } from "next";
import { ShieldCheck, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us | ClipVault",
  description: "Learn about ClipVault, the world's most reliable Instagram Reel extraction engine.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6">Our Mission</h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium">
            At ClipVault, we believe that saving your favorite digital memories should be seamless, secure, and lightning-fast.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16">
          <Card className="p-5 md:p-8 border-border rounded-2xl md:rounded-[2rem] bg-card">
            <ShieldCheck className="w-10 h-10 text-indigo-500 mb-6" />
            <h2 className="text-xl md:text-2xl font-black mb-4">Privacy First</h2>
            <p className="text-muted-foreground font-medium text-sm md:text-base">
              We never track your individual downloads or sell your data. Your extraction history is private and encrypted.
            </p>
          </Card>
          <Card className="p-5 md:p-8 border-border rounded-2xl md:rounded-[2rem] bg-card">
            <Zap className="w-10 h-10 text-amber-500 mb-6" />
            <h2 className="text-xl md:text-2xl font-black mb-4">Pure Performance</h2>
            <p className="text-muted-foreground font-medium text-sm md:text-base">
              By using custom extraction engines instead of standard scrapers, we deliver 99.9% success rates.
            </p>
          </Card>
        </div>

        <div className="prose prose-indigo dark:prose-invert max-w-none px-2 md:px-0">
          <p className="text-base md:text-lg leading-relaxed mb-6">
            ClipVault started in 2026 as a small project to help creators and fans archive their favorite Instagram Reels without the clutter and unreliability of existing tools. Today, it serves thousands of users daily across the globe.
          </p>
          <p className="text-base md:text-lg leading-relaxed">
            Our team is dedicated to staying ahead of platform changes, ensuring that you always have access to the content that matters to you.
          </p>
        </div>
      </div>
    </div>
  );
}
