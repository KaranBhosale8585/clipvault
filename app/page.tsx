"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { 
  Zap, Lock, LayoutDashboard, Sparkles,
  ArrowRight, CheckCircle2, ChevronDown
} from "lucide-react";
import ReelDownloader from "@/components/ReelDownloader";
import DownloadHistory from "@/components/DownloadHistory";
import LimitReached from "@/components/LimitReached";
import DailyLimitReached from "@/components/DailyLimitReached";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  isProAccess: boolean;
};

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
});

export default function DownloadDashboard() {
  const { data: user, isLoading, mutate } = useSWR<User | null>("/api/get-me", fetcher);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [isDailyLimitReached, setIsDailyLimitReached] = useState(false);
  const [lastUrl, setLastUrl] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);


  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://clipvault.com";

  // Structured Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ClipVault",
    "url": `${baseUrl}/`,
    "description": "Download high-quality Instagram Reels instantly and securely.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ClipVault",
    "url": `${baseUrl}/`,
    "logo": `${baseUrl}/icon.svg?v=2`,
    "sameAs": [
      "https://twitter.com/clipvault_app",
      "https://github.com/clipvault"
    ]
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${baseUrl}/`
      }
    ]
  };



  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });

      if (res.ok) {
        toast.success("Logged out successfully");
        mutate(null);
        window.location.href = "/login";
      }
    } catch {
      toast.error("Logout error");
    }
  };

  const handleLimitReached = (url: string) => {
    setLastUrl(url);
    setIsLimitReached(true);
  };

  const handleDailyLimitReached = () => {
    setIsDailyLimitReached(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-4xl space-y-8 animate-pulse">
          <div className="h-16 w-64 bg-muted rounded-2xl mx-auto" />
          <div className="h-64 w-full bg-muted rounded-[3rem]" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted rounded-3xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500/30 overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-24">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 md:gap-16 items-start">
          
          {/* Main Feed */}
          <div className="xl:col-span-2 space-y-8 md:space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 md:space-y-10"
            >
              {!isLimitReached && !isDailyLimitReached ? (
                <>
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                      <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter mb-2 leading-tight">
                        {user ? `Welcome, ${user.name.split(' ')[0]}` : "Instagram Reel Downloader"}
                      </h1>
                      <p className="text-muted-foreground font-medium text-base md:text-xl max-w-xl">
                        {user ? "Manage your saved Reels and start new extractions." : "Download high-quality Instagram Reels instantly and securely with ClipVault."}
                      </p>
                    </div>
                  </div>

                  <Card className="border-border bg-card/50 backdrop-blur-2xl rounded-3xl md:rounded-[3rem] p-4 md:p-10 shadow-2xl shadow-indigo-500/5 relative overflow-hidden group">
                    <div className="relative z-10">
                      <ReelDownloader 
                        onLimitReached={handleLimitReached} 
                        onDailyLimitReached={handleDailyLimitReached}
                      />
                    </div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl" />
                  </Card>
                </>
              ) : isLimitReached ? (
                <LimitReached url={lastUrl} />
              ) : (
                <DailyLimitReached />
              )}

              <AnimatePresence mode="wait">
                {user ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8 pt-8"
                  >
                    <div className="flex items-center justify-between border-t border-border pt-12">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-black tracking-tighter">Your Collection</h2>
                        <p className="text-sm md:text-base text-muted-foreground font-medium">History of your recent extractions.</p>
                      </div>
                    </div>
                    <DownloadHistory />
                  </motion.div>
                ) : !isLimitReached && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="pt-12"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FeatureCard 
                        icon={<Zap className="w-6 h-6 text-amber-500" />}
                        title="Fast Extraction"
                        desc="Premium servers ensure your Reels are processed in seconds."
                      />
                      <FeatureCard 
                        icon={<Lock className="w-6 h-6 text-indigo-500" />}
                        title="Private & Secure"
                        desc="We don't sell your data. Your extraction history belongs to you."
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8 md:sticky md:top-28">
            <AnimatePresence mode="wait">
              {user ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  <Card className="border-border rounded-[2rem] p-6 md:p-8 bg-card shadow-sm border border-indigo-500/5 group">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-12 w-12 md:h-14 md:w-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black text-white shadow-xl shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-base md:text-lg font-black text-foreground truncate">{user.name}</p>
                        <p className="text-xs md:text-sm font-medium text-muted-foreground truncate mb-2">{user.email}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded-md border border-indigo-500/20">
                            {user.role}
                          </span>
                          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-md border border-emerald-500/20">
                            Verified
                          </span>
                          {user.isProAccess ? (
                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded-md border border-amber-500/20">
                              PRO ACCESS
                            </span>
                          ) : (
                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest bg-slate-500/10 text-slate-500 px-1.5 py-0.5 rounded-md border border-slate-500/20">
                              Free Tier
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {user.role === "admin" && (
                        <Link href="/admin">
                          <Button className="w-full h-11 md:h-12 bg-indigo-600 text-white rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 active:scale-[0.98] transition-all gap-3">
                            <LayoutDashboard className="w-4 h-4" /> Admin Control
                          </Button>
                        </Link>
                      )}
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full h-11 md:h-12 border-border rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest hover:bg-muted active:scale-[0.98] transition-all"
                      >
                        Sign Out
                      </Button>
                    </div>
                  </Card>

                  {user.isProAccess && (
                    <Card className="border-border rounded-[2rem] p-6 md:p-8 bg-indigo-50 dark:bg-indigo-500/5 border-dashed relative overflow-hidden">
                      <div className="relative z-10">
                        <h4 className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">Pro Status</h4>
                        <p className="text-xl md:text-2xl font-black text-foreground mb-4">Unlimited Access</p>
                        <div className="flex items-center gap-2 text-muted-foreground font-medium text-xs md:text-sm">
                          <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                          <span>Lifetime active license</span>
                        </div>
                      </div>
                      <Sparkles className="absolute -top-4 -right-4 w-20 h-20 md:w-24 md:h-24 text-indigo-500/10 -rotate-12" />
                    </Card>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="border-border rounded-3xl md:rounded-[2.5rem] p-6 md:p-12 bg-indigo-600 text-white shadow-2xl shadow-indigo-500/20 text-center relative overflow-hidden group">
                    <div className="relative z-10">
                      <h3 className="text-2xl sm:text-3xl font-black tracking-tighter mb-4 leading-tight">Ready for more?</h3>
                      <p className="text-indigo-100 font-medium mb-8 leading-relaxed opacity-90 text-sm md:text-base">
                        Create a free account to unlock unlimited downloads, history sync, and premium features.
                      </p>
                      <Link href="/signup">
                        <Button size="lg" className="w-full h-14 md:h-16 bg-white text-indigo-600 rounded-2xl font-black text-base hover:bg-indigo-50 active:scale-[0.98] transition-all shadow-xl shadow-black/20 group-hover:gap-4 gap-2">
                          Start Saving Now <ArrowRight className="w-5 h-5" />
                        </Button>
                      </Link>
                      <div className="mt-6">
                        <Link href="/login" className="text-xs font-bold text-indigo-200 hover:text-white transition-colors">
                          Already have an account? Log in
                        </Link>
                      </div>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-700 -z-10" />
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Guest SEO Content Sections */}
        {!user && !isLimitReached && !isDailyLimitReached && (
          <div className="mt-20 md:mt-32 space-y-20 md:space-y-32 border-t border-border pt-16 md:pt-24">
            
            {/* How It Works Section */}
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-2xl md:text-4xl font-black tracking-tighter">
                  How to Download Instagram Reels Online
                </h2>
                <p className="text-muted-foreground font-medium max-w-lg mx-auto text-xs md:text-sm leading-relaxed">
                  Save your favorite Instagram Reel videos directly to your mobile phone or desktop in three simple steps.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StepCard 
                  num="01" 
                  title="Copy the Reel Link" 
                  desc="Open Instagram, find the Reel you want to download, tap the options menu (three dots or share icon), and select 'Copy Link'." 
                />
                <StepCard 
                  num="02" 
                  title="Paste Link in ClipVault" 
                  desc="Return to ClipVault, paste the copied link into the URL input field at the top of the page, and press the download button." 
                />
                <StepCard 
                  num="03" 
                  title="Extract and Save" 
                  desc="Our premium extraction engine will process the link and generate a secure 1080p download URL instantly." 
                />
              </div>
            </div>

            {/* Why Use ClipVault / Benefits Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-2xl md:text-4xl font-black tracking-tighter leading-tight">
                  Why Use ClipVault to Download Instagram Reels?
                </h2>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                  ClipVault is engineered specifically as a premium Instagram Reel downloader. Unlike standard web scrapers that fail frequently, display intrusive ads, or redirect you to malware sites, ClipVault provides a secure, streamlined experience.
                </p>
                <div className="space-y-4">
                  <BenefitItem 
                    title="1080p High-Definition Resolution" 
                    desc="We extract the highest-quality source video stream direct from Instagram servers, ensuring crisp visuals on any screen." 
                  />
                  <BenefitItem 
                    title="No Watermarks or Logos" 
                    desc="Get clean video files without added watermarks, stickers, or brand overlays, perfect for offline archives and re-editing." 
                  />
                  <BenefitItem 
                    title="Secure Media Proxy Shield" 
                    desc="We fetch and proxy your video thumbnails and download streams, keeping your personal IP address completely hidden." 
                  />
                </div>
              </div>
              <div className="bg-card border border-border p-8 rounded-[2rem] md:rounded-[3rem] space-y-6">
                <h3 className="text-lg font-black tracking-tight">Benefits of Downloading Reels</h3>
                <ul className="space-y-4 text-xs md:text-sm text-muted-foreground font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="text-indigo-500 font-bold mt-0.5">•</span>
                    <span><strong>Offline Archiving:</strong> Back up content you love before it gets deleted or archived by the original creator.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-indigo-500 font-bold mt-0.5">•</span>
                    <span><strong>Creator Workflows:</strong> Easily compile clips, extract references, and analyze trending editing styles.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-indigo-500 font-bold mt-0.5">•</span>
                    <span><strong>Seamless Playback:</strong> Play video clips offline on airplanes, commutes, or areas with poor cellular connection.</span>
                  </li>
                </ul>
                <div className="border-t border-border pt-6 text-xs text-muted-foreground leading-relaxed">
                  Read our <Link href="/privacy" className="text-indigo-500 hover:underline">Privacy Policy</Link> to learn how we protect your information, and review our <Link href="/terms" className="text-indigo-500 hover:underline">Terms & Conditions</Link> for usage policies. If you have questions or encounter bugs, please reach out through our <Link href="/contact" className="text-indigo-500 hover:underline">Contact Page</Link>.
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-2xl md:text-4xl font-black tracking-tighter">
                  Advanced Features of Our Extraction Engine
                </h2>
                <p className="text-muted-foreground font-medium max-w-lg mx-auto text-xs md:text-sm leading-relaxed">
                  ClipVault combines server-side reliability with advanced protocols to deliver a world-class saver tool.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <FeatureDetailCard 
                  title="Dynamic Cache Bridge" 
                  desc="Successful extractions are cached for 12 hours in our database. This minimizes redundant server workload and guarantees 99.9% uptime." 
                />
                <FeatureDetailCard 
                  title="Bypass Bot Protection" 
                  desc="Instagram actively blocks basic bots. Our custom node-bridge handles authentication handshakes to ensure smooth processing." 
                />
                <FeatureDetailCard 
                  title="Fully Mobile Optimized" 
                  desc="Save Reels directly to iOS Camera Roll or Android files. Fully compatible with Safari, Chrome, and Samsung Internet browsers." 
                />
              </div>
            </div>

          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-20 md:mt-32 border-t border-border pt-16 md:pt-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-center mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-center font-medium mb-12 text-sm md:text-base max-w-lg mx-auto">
              Find answers to common questions about ClipVault&apos;s features, limitations, and security.
            </p>
            <div className="space-y-4">
              {FAQS.map((faq, index) => (
                <FaqAccordionItem
                  key={index}
                  question={faq.q}
                  answer={faq.a}
                  isOpen={openFaqIndex === index}
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="border-border bg-card rounded-2xl md:rounded-[2rem] p-5 md:p-8 shadow-sm hover:shadow-md transition-all border border-indigo-500/0 hover:border-indigo-500/5 group">
      <div className="mb-4 md:mb-6 p-3 bg-muted rounded-2xl w-fit group-hover:bg-indigo-500/5 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-base md:text-lg font-black tracking-tight text-foreground mb-3">{title}</h3>
      <p className="text-xs md:text-sm font-medium text-muted-foreground leading-relaxed">{desc}</p>
    </Card>
  );
}

function FaqAccordionItem({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border border-border rounded-2xl bg-card/40 backdrop-blur-sm overflow-hidden transition-all duration-300">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between text-left p-5 md:p-6 text-sm md:text-base font-bold text-foreground hover:text-indigo-500 transition-colors"
      >
        <span className="pr-4">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted-foreground shrink-0"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed px-5 md:px-6 pb-6 border-t border-border/50 pt-4 bg-muted/10">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const FAQS = [
  {
    q: "What is ClipVault?",
    a: "ClipVault is a premium content extraction tool designed to help you download Instagram Reels in high resolution (1080p) directly to your device."
  },
  {
    q: "How do I download Instagram Reels?",
    a: "Simply copy the link of the Instagram Reel you want to save, paste it into the downloader input field at the top of this page, and click the download button. The engine will extract the high-res file for you."
  },
  {
    q: "Do I need an account to use ClipVault?",
    a: "No. You can try ClipVault as a guest with 3 free trial downloads. To get more downloads and sync your collection across devices, you can create a free account."
  },
  {
    q: "How many free downloads do I get?",
    a: "Guests (unregistered users) receive 3 free trial downloads tracked by IP and cookie. Registered free users receive 10 downloads per day, which reset daily at midnight UTC."
  },
  {
    q: "Why should I create an account?",
    a: "Creating an account increases your daily limit to 10 downloads, unlocks the 'Your Collection' history sync feature, and allows you to request PRO unlimited access if you are a creator or power user."
  },
  {
    q: "Is ClipVault free to use?",
    a: "Yes. ClipVault is completely free to use during our beta phase. Creating an account is free and does not require any credit card information."
  },
  {
    q: "Does ClipVault store downloaded videos?",
    a: "No. ClipVault does not host, store, own, or redistribute third-party videos. We act only as a utility tool for processing user-provided URLs and proxying the download link directly from source servers."
  },
  {
    q: "Is my download history private?",
    a: "Yes. Your extraction history is stored securely and is only visible to you when logged in. Furthermore, all history and logs older than 30 days are automatically and permanently deleted from our servers."
  },
  {
    q: "Which Instagram links are supported?",
    a: "ClipVault currently supports standard public Instagram Reel URLs only (e.g. links starting with https://www.instagram.com/reel/). Private accounts or other content types (like Stories or Posts) are not supported."
  },
  {
    q: "Why is a Reel unavailable?",
    a: "Reels may be unavailable if the source account is set to private, the Reel has been deleted, or if Instagram's servers are temporarily blocking extraction. In such cases, the service will return an appropriate error message."
  },
  {
    q: "Is ClipVault secure?",
    a: "Yes. We use SSL encryption, hash all passwords, protect user sessions with secure HTTP-only cookies, and proxy media transfers to shield your IP address."
  },
  {
    q: "Can I use ClipVault on mobile devices?",
    a: "Absolutely. ClipVault is fully responsive and optimized for mobile web browsers on both iOS and Android. No app installation is required."
  },
  {
    q: "How do I clear my download history?",
    a: "You can clear individual entries or your entire extraction history at any time directly from the history panel when logged in. Once cleared, it is deleted instantly from our database."
  },
  {
    q: "Who is responsible for downloaded content?",
    a: "Users are solely responsible for ensuring they have the legal right or permission to download any content using ClipVault. ClipVault does not host, store, own, or redistribute third-party content."
  }
];

function StepCard({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <Card className="border-border bg-card/40 rounded-2xl md:rounded-[2rem] p-6 space-y-4 relative overflow-hidden group">
      <div className="text-5xl font-black text-indigo-500/10 group-hover:text-indigo-500/20 transition-colors">
        {num}
      </div>
      <h3 className="text-lg font-black tracking-tight">{title}</h3>
      <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed">{desc}</p>
    </Card>
  );
}

function BenefitItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="space-y-1">
      <h4 className="text-sm md:text-base font-bold text-foreground">{title}</h4>
      <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function FeatureDetailCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Card className="border-border bg-card p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm">
      <h3 className="text-base md:text-lg font-black mb-3">{title}</h3>
      <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed">{desc}</p>
    </Card>
  );
}
