import type { Metadata } from "next";
import { ShieldCheck, Zap, Lock, Smartphone, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about ClipVault, our mission, vision, and our commitment to providing a secure and private content extraction engine.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | ClipVault",
    description: "Learn about ClipVault, our mission, vision, and our commitment to providing a secure and private content extraction engine.",
    url: "/about",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About Us | ClipVault",
    description: "Learn about ClipVault, our mission, vision, and our commitment to providing a secure and private content extraction engine.",
  }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6">Our Mission</h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Providing content creators, digital archivists, and fans with a clean, high-speed, and secure tool for archiving media.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16">
          <Card className="p-6 md:p-8 border-border rounded-2xl md:rounded-[2rem] bg-card">
            <ShieldCheck className="w-10 h-10 text-indigo-500 mb-6" />
            <h2 className="text-xl md:text-2xl font-black mb-4">Privacy First</h2>
            <p className="text-muted-foreground font-medium text-sm md:text-base leading-relaxed">
              We do not track individual downloads or sell user data. Your download history is kept private, secured, and automatically purged after 30 days.
            </p>
          </Card>
          <Card className="p-6 md:p-8 border-border rounded-2xl md:rounded-[2rem] bg-card">
            <Zap className="w-10 h-10 text-amber-500 mb-6" />
            <h2 className="text-xl md:text-2xl font-black mb-4">Pure Performance</h2>
            <p className="text-muted-foreground font-medium text-sm md:text-base leading-relaxed">
              Using a python-driven extraction node bridge instead of standard HTML scraping, we deliver high success rates and reliable processing speeds.
            </p>
          </Card>
        </div>

        <div className="prose prose-indigo dark:prose-invert max-w-none space-y-8 px-2 md:px-0">
          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">What is ClipVault?</h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              ClipVault is a premium content extraction engine built specifically for downloading high-definition media. Our architecture separates marketing landing experiences from a high-performance backend.
            </p>
            <p className="text-muted-foreground font-medium leading-relaxed font-bold text-indigo-500">
              Current Supported Platform: Instagram Reels only.
            </p>
            <p className="text-muted-foreground font-medium leading-relaxed">
              We focus entirely on perfecting metadata extraction and high-resolution downloads for Instagram Reels. We do not support, host, or advertise features for other social media networks, ensuring our tools remain compliant and highly optimized for our specific target.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">Why ClipVault Was Created</h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              Archiving content from the web is often frustrating due to broken links, invasive advertisements, redirect scams, and unreliable browser extensions that break whenever platform layouts update.
            </p>
            <p className="text-muted-foreground font-medium leading-relaxed">
              ClipVault was created to solve these issues. By leveraging a robust service bridge coupled with server-side caching (which keeps successful queries active for 12 hours) and secure proxying, we created a tool that just works—reliably, cleanly, and safely.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">Our Commitments</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="space-y-2">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Lock className="w-5 h-5 text-indigo-500 shrink-0" /> Security
                </h3>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  HTTPS-only communication, secure credentials handling, and media proxies that shield client IP addresses.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500 shrink-0" /> User Experience
                </h3>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  A beautiful dark and light layout, zero popups or redirect links, and a fluid responsive design optimized for mobile and desktop.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-500 shrink-0" /> Privacy
                </h3>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  Minimum necessary log retention, no third-party trackers, and instant manual collection clearing in your Dashboard.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4 border-t border-border pt-10">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">Future Roadmap</h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              We continue to iterate on ClipVault to improve performance. Our current engineering roadmap includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground font-medium">
              <li>Optimizing the Python-Node bridge concurrency for even faster download proxy throughput.</li>
              <li>Implementing edge-based metadata caching to reduce database read latencies.</li>
              <li>Expanding self-service admin maintenance tools to optimize storage auto-cleanups.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
