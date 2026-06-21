"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Zap, Lock, ShieldCheck, ArrowLeft, Play, ChevronRight, HelpCircle } from "lucide-react";
import dynamic from "next/dynamic";

const ReelDownloader = dynamic(() => import("@/components/ReelDownloader"), {
  ssr: false,
  loading: () => <div className="h-48 w-full animate-pulse bg-muted rounded-2xl" />,
});
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function InstagramVideoDownloaderClient() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500/30 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-12 md:py-24">
        
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-indigo-500 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-16 items-start">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12 md:space-y-16">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-500 px-3 py-1 rounded-full border border-indigo-500/20">
                  HD Media Extractor
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter mt-4 mb-2 leading-tight">
                  Instagram Video Downloader
                </h1>
                <p className="text-muted-foreground font-medium text-base md:text-xl max-w-xl">
                  Easily save Instagram videos and Reels. Extract high-quality MP4 files in a single click, completely free of charge.
                </p>
              </div>

              {/* Downloader Card */}
              <Card className="border-border bg-card/50 backdrop-blur-2xl rounded-3xl md:rounded-[3rem] p-4 md:p-10 shadow-2xl shadow-indigo-500/5 relative overflow-hidden group">
                <div className="relative z-10">
                  <Suspense fallback={<div className="h-32 w-full animate-pulse bg-muted rounded-2xl" />}>
                    <ReelDownloader />
                  </Suspense>
                </div>
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl" />
              </Card>
            </motion.div>

            {/* SEO Content Section */}
            <div className="space-y-10 border-t border-border pt-12">
              
              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                  How to Use the Instagram Video Downloader
                </h2>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                  ClipVault makes it simple to <strong>save instagram reels</strong> and videos to any device. Just follow these quick instructions:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                  <div className="p-5 bg-card/40 border border-border rounded-2xl space-y-2">
                    <div className="text-2xl font-black text-indigo-500/20">01</div>
                    <h3 className="font-bold text-sm">Copy Link</h3>
                    <p className="text-xs text-muted-foreground font-medium">Find the video on Instagram and copy its link to your clipboard.</p>
                  </div>
                  <div className="p-5 bg-card/40 border border-border rounded-2xl space-y-2">
                    <div className="text-2xl font-black text-indigo-500/20">02</div>
                    <h3 className="font-bold text-sm">Insert Link</h3>
                    <p className="text-xs text-muted-foreground font-medium">Open ClipVault, paste the link in the input box and tap Analyze.</p>
                  </div>
                  <div className="p-5 bg-card/40 border border-border rounded-2xl space-y-2">
                    <div className="text-2xl font-black text-indigo-500/20">03</div>
                    <h3 className="font-bold text-sm">Download MP4</h3>
                    <p className="text-xs text-muted-foreground font-medium">Click the download button to grab the high definition video.</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                  Why Choose ClipVault for Instagram Video Downloads?
                </h2>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                  ClipVault is a specialized <strong>instagram video downloader</strong> built for power users, creators, and curators:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span><strong>Full MP4 Support:</strong> Save videos in high compatibility MP4 format playable on any media player.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span><strong>Download Instagram Reels:</strong> Works seamlessly with Reels, standard videos, and video posts.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span><strong>No Installation Required:</strong> Run it in any browser without installing extensions or apps.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span><strong>Proxy Shield Security:</strong> Your browser request is protected, keeping your identity secure.</span>
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                  Fast and Secure Video Saving
                </h2>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                  Don't let platform layout changes or slow websites slow down your research. Our <strong>instagram video downloader</strong> is constantly updated to bypass limits, giving you instant access to public Instagram videos. Check out our downloader tool today!
                </p>
              </section>

            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-28">
            <Card className="p-6 md:p-8 border-border bg-card shadow-sm space-y-6">
              <h3 className="text-base font-black tracking-tight uppercase tracking-widest text-foreground">
                Alternative Tools
              </h3>
              <div className="flex flex-col gap-3">
                <Link href="/instagram-reel-downloader" className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted border border-border text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-indigo-500 transition-all">
                  <span className="flex items-center gap-2">
                    <Play className="w-4 h-4" /> Reel Downloader
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link href="/how-to-download-instagram-reels" className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted border border-border text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-indigo-500 transition-all">
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4" /> How to Download
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link href="/faq" className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted border border-border text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-indigo-500 transition-all">
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" /> FAQ Page
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </Card>

            <Card className="p-6 md:p-8 border-border bg-card shadow-sm space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Quality Guarantee</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-foreground">1080p Resolution</h4>
                    <p className="text-[11px] text-muted-foreground font-medium">Extract the original stream file in its native resolution without compression.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Lock className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Secure Downloads</h4>
                    <p className="text-[11px] text-muted-foreground font-medium">Media streams are buffered via proxy servers, preventing tracking scripts.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
