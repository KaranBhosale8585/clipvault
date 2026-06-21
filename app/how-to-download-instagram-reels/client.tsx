"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Zap, Lock, ShieldCheck, ArrowLeft, Video, ChevronRight, HelpCircle, Laptop, Smartphone, HelpCircle as HelpIcon } from "lucide-react";
import dynamic from "next/dynamic";

const ReelDownloader = dynamic(() => import("@/components/ReelDownloader"), {
  ssr: false,
  loading: () => <div className="h-48 w-full animate-pulse bg-muted rounded-2xl" />,
});
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function HowToDownloadReelsClient() {
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
                  Comprehensive Guide
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter mt-4 mb-2 leading-tight">
                  How to Download Instagram Reels
                </h1>
                <p className="text-muted-foreground font-medium text-base md:text-xl max-w-xl">
                  Step-by-step instructions to save Instagram Reels on any device. Download videos offline on iOS, Android, PC, or Mac.
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

            {/* SEO Content Sections */}
            <div className="space-y-12 border-t border-border pt-12">
              
              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                  Step-by-Step: Copying and Pasting Reel Links
                </h2>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                  Before you can <strong>download instagram reels</strong>, you need to grab the source link from Instagram:
                </p>
                <div className="space-y-3 font-medium text-sm text-muted-foreground">
                  <p className="flex gap-2">
                    <span className="text-indigo-500 font-bold">Step 1:</span>
                    <span>Open the Instagram application on your device or access it through a web browser.</span>
                  </p>
                  <p className="flex gap-2">
                    <span className="text-indigo-500 font-bold">Step 2:</span>
                    <span>Locate the Reel you wish to save. Press the share button (paper airplane icon) or the menu icon (three dots) on the Reel.</span>
                  </p>
                  <p className="flex gap-2">
                    <span className="text-indigo-500 font-bold">Step 3:</span>
                    <span>Tap on <strong>'Copy Link'</strong>. The link will be copied directly to your clipboard.</span>
                  </p>
                  <p className="flex gap-2">
                    <span className="text-indigo-500 font-bold">Step 4:</span>
                    <span>Open ClipVault, paste the copied link into the input field above, and click 'Analyze Reel'.</span>
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                  How to Save Instagram Reels on iPhone / iOS
                </h2>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                  If you are using Safari or Chrome on iOS (iPhone or iPad), saving videos can sometimes feel restricted due to Apple's sandbox environment. Here is how to do it:
                </p>
                <div className="space-y-3 font-medium text-sm text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>Copy the Reel link from Instagram and visit ClipVault using the Safari browser.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>Paste the link into our tool and tap Analyze. Once loaded, click the 'Download High Quality Video' button.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>Safari will prompt you with a download confirmation. Agree to download. You can monitor progress using the Safari download manager icon at the bottom-left or top-right.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>Open the iOS Files app, locate your download folder, and tap the downloaded video to play or save it directly to your iOS Photos gallery.</span>
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                  How to Save Instagram Reels on Android Devices
                </h2>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                  Android is extremely flexible, allowing you to <strong>save instagram reels</strong> to your native gallery in seconds:
                </p>
                <div className="space-y-3 font-medium text-sm text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>Copy the link to the Reel and open ClipVault on your browser (Chrome, Firefox, or Samsung Internet).</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>Paste the URL and press Analyze. Once extracted, hit the Download button.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>The MP4 file will be downloaded directly to your 'Downloads' folder and will immediately show up in your Google Photos or Gallery application.</span>
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                  How to Download Reels on PC and Mac
                </h2>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                  For desktop platforms, using our <strong>instagram reel downloader</strong> is a breeze:
                </p>
                <div className="space-y-3 font-medium text-sm text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>On your browser, navigate to the Instagram website, find the Reel you want to download, and copy the browser URL.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>Paste it into ClipVault and press Analyze. Click Download and select your destination folder on your hard drive.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>The file is saved as a generic MP4, allowing seamless viewing on VLC media player, QuickTime, or Windows Media Player.</span>
                  </p>
                </div>
              </section>

            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-28">
            <Card className="p-6 md:p-8 border-border bg-card shadow-sm space-y-6">
              <h3 className="text-base font-black tracking-tight uppercase tracking-widest text-foreground">
                Quick Navigation
              </h3>
              <div className="flex flex-col gap-3">
                <Link href="/instagram-reel-downloader" className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted border border-border text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-indigo-500 transition-all">
                  <span className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" /> Reel Downloader
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link href="/instagram-video-downloader" className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted border border-border text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-indigo-500 transition-all">
                  <span className="flex items-center gap-2">
                    <Video className="w-4 h-4" /> Video Downloader
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link href="/faq" className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted border border-border text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-indigo-500 transition-all">
                  <span className="flex items-center gap-2">
                    <HelpIcon className="w-4 h-4" /> FAQ Page
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </Card>

            <Card className="p-6 md:p-8 border-border bg-card shadow-sm space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Usage Safety</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Compliant Extraction</h4>
                    <p className="text-[11px] text-muted-foreground font-medium">We parse public Instagram API nodes to secure content without breaking platform rules.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Laptop className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Cross-Platform</h4>
                    <p className="text-[11px] text-muted-foreground font-medium">100% compatible with Chrome, Safari, Edge, Firefox, and mobile engines.</p>
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
