"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, Video, Zap, Smartphone, HelpCircle, ChevronRight } from "lucide-react";
import ReelDownloader from "@/components/ReelDownloader";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { FaqItem } from "./page";

interface FaqPageClientProps {
  faqs: FaqItem[];
}

export default function FaqPageClient({ faqs }: FaqPageClientProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500/30 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-12 md:py-24">
        
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-indigo-500 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-16 items-start">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-500 px-3 py-1 rounded-full border border-indigo-500/20">
                  Help Center
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter mt-4 mb-2 leading-tight">
                  Frequently Asked Questions
                </h1>
                <p className="text-muted-foreground font-medium text-base md:text-xl max-w-xl">
                  Got questions about how to download Instagram Reels or videos? Find quick answers below.
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

            {/* Accordion list */}
            <div className="space-y-4 border-t border-border pt-12">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-6">General Queries</h2>
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-border rounded-2xl bg-card/40 backdrop-blur-sm overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    suppressHydrationWarning
                    className="w-full flex items-center justify-between text-left p-5 md:p-6 text-sm md:text-base font-bold text-foreground hover:text-indigo-500 transition-colors"
                  >
                    <span className="pr-4">{faq.q}</span>
                    <motion.span
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-muted-foreground shrink-0"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed px-5 md:px-6 pb-6 border-t border-border/50 pt-4 bg-muted/10">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Back link at the bottom */}
            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground font-medium">
                Can't find what you are looking for? Return to the <Link href="/" className="text-indigo-500 hover:underline font-bold">Homepage</Link> to test our downloader online, or contact us through our support channels.
              </p>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-28">
            <Card className="p-6 md:p-8 border-border bg-card shadow-sm space-y-6">
              <h3 className="text-base font-black tracking-tight uppercase tracking-widest text-foreground">
                Specialized Downloader Tools
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
                <Link href="/how-to-download-instagram-reels" className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted border border-border text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-indigo-500 transition-all">
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4" /> How to Download
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </Card>

            <Card className="p-6 md:p-8 border-border bg-card shadow-sm space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Usage Safety</h3>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                ClipVault runs entirely inside standard web containers. We do not demand desktop installation, administrative rights, or user authentication. Your downloads are anonymous.
              </p>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
