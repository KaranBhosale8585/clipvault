"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Download, Link as LinkIcon, Loader2, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";

// Declare global chrome object for TypeScript compilation
declare const chrome: any;

interface ReelMetadata {
  id: string;
  reelUrl: string;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
}

interface ReelDownloaderProps {
  onLimitReached?: (url: string) => void;
  onDailyLimitReached?: () => void;
}

export default function ReelDownloader({ onLimitReached, onDailyLimitReached }: ReelDownloaderProps) {
  const searchParams = useSearchParams();
  const [url, setUrl] = useState(searchParams.get("url") || "");
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<ReelMetadata | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [extensionInstalled, setExtensionInstalled] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Read Extension ID with dynamic developer override support
  const getExtensionId = (): string => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("CLIPVAULT_EXTENSION_ID") || "lgpjmggeigcbeigpnmocgjgadljglcbf";
    }
    return "lgpjmggeigcbeigpnmocgjgadljglcbf";
  };

  // Detect Extension presence via externally_connectable runtime PING on interval
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkExtension = () => {
        if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
          const extensionId = getExtensionId();
          chrome.runtime.sendMessage(extensionId, { action: "PING" }, (response: any) => {
            if (chrome.runtime.lastError) {
              setExtensionInstalled(false);
            } else if (response && response.success) {
              setExtensionInstalled(true);
            } else {
              setExtensionInstalled(false);
            }
          });
        } else {
          setExtensionInstalled(false);
        }
      };

      checkExtension();
      const interval = setInterval(checkExtension, 3000);
      return () => clearInterval(interval);
    }
  }, []);

  // Still keep an effect if the user navigates to a new URL with a different ?url param
  useEffect(() => {
    const queryUrl = searchParams.get("url");
    if (queryUrl && queryUrl !== url) {
      const timeout = setTimeout(() => setUrl(queryUrl), 0);
      return () => clearTimeout(timeout);
    }
  }, [searchParams, url]);

  const performServerRegistration = async (extData?: any) => {
    const res = await fetch("/api/reel/metadata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, extensionData: extData }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401 && data.error === "Limit Exceeded") {
        onLimitReached?.(url);
        return false;
      }

      if (res.status === 403 && data.error === "Daily Limit Reached") {
        onDailyLimitReached?.();
        return false;
      }
      
      if (res.status === 429) {
        toast.error(data.message || "Too many requests. Please wait.");
      } else {
        toast.error(data.message || "Failed to extract Reel");
        if (res.status === 500 && !extensionInstalled) {
          setShowInstallModal(true);
        }
      }
      return false;
    } else {
      setMetadata(data.data);
      toast.success(extData ? "Reel extracted via ClipVault Companion!" : "Reel metadata extracted!");
      window.dispatchEvent(new CustomEvent("refresh-history"));
      return true;
    }
  };

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Please enter a Reel URL");
      return;
    }

    setLoading(true);
    setMetadata(null);
    setShowPreview(false);

    if (extensionInstalled && typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
      const extensionId = getExtensionId();
      chrome.runtime.sendMessage(extensionId, { action: "EXTRACT", url }, async (response: any) => {
        if (chrome.runtime.lastError) {
          console.error("Extension extraction failed:", chrome.runtime.lastError);
          toast.error("Extension communication failed. Trying server fallback...");
          await performServerRegistration();
          setLoading(false);
        } else if (response && response.success && response.data) {
          await performServerRegistration(response.data);
          setLoading(false);
        } else {
          const errMsg = response ? response.error : "Unknown extension error";
          toast.error(`Extension failed: ${errMsg}. Trying server fallback...`);
          await performServerRegistration();
          setLoading(false);
        }
      });
    } else {
      // Standard server extraction fallback
      try {
        await performServerRegistration();
      } catch {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDownload = () => {
    if (!metadata) return;
    
    if (extensionInstalled && typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
      toast("Triggering direct download...");
      const extensionId = getExtensionId();
      chrome.runtime.sendMessage(
        extensionId,
        {
          action: "DOWNLOAD",
          videoUrl: metadata.videoUrl,
          filename: `clipvault-reel-${metadata.id}.mp4`
        },
        (response: any) => {
          if (chrome.runtime.lastError) {
            console.error("Direct download failed, falling back to server:", chrome.runtime.lastError);
            triggerProxyDownload();
          } else if (response && response.success) {
            toast.success("Download started directly in your browser!");
          } else {
            console.warn("Direct download failed, falling back to server:", response?.error);
            triggerProxyDownload();
          }
        }
      );
    } else {
      triggerProxyDownload();
    }
  };

  const triggerProxyDownload = () => {
    if (!metadata) return;
    const proxyUrl = `/api/download-proxy?url=${encodeURIComponent(metadata.videoUrl)}&filename=${encodeURIComponent(`reel-${metadata.id}.mp4`)}`;
    window.location.href = proxyUrl;
    toast.success("Starting download...");
  };

  return (
    <div className="space-y-6">
      <Card className="border-border transition-all hover:shadow-2xl hover:shadow-indigo-500/5 overflow-hidden">
        <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-500" />
            ClipVault Extraction Engine
          </CardTitle>
          <div>
            {extensionInstalled ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Companion Active
              </span>
            ) : (
              <button 
                onClick={() => setShowInstallModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 hover:bg-indigo-500/20 transition-all cursor-pointer"
              >
                Install Helper Extension
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleExtract} className="space-y-4">
            <div className="relative group">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-indigo-500 transition-colors z-10" />
              <Input
                type="text"
                placeholder="Paste Instagram Reel URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-11 h-12 md:h-14 bg-background border-border rounded-xl md:rounded-2xl focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all text-sm font-medium"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 md:h-14 bg-foreground text-background font-bold rounded-xl md:rounded-2xl shadow-lg shadow-black/5 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Extracting...
                </>
              ) : (
                "Analyze Reel"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {metadata && (
        <Card className="border-border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 relative group bg-black flex items-center justify-center min-h-[200px]">
              {!showPreview ? (
                <>
                  <Image
                    src={`/api/download-proxy?url=${encodeURIComponent(metadata.thumbnailUrl)}&download=false`}
                    alt={metadata.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                  <div 
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => setShowPreview(true)}
                  >
                    <Play className="w-12 h-12 text-white fill-current" />
                  </div>
                </>
              ) : (
                <video
                  src={`/api/download-proxy?url=${encodeURIComponent(metadata.videoUrl)}&download=false`}
                  controls
                  autoPlay
                  className="w-full h-full max-h-[400px] object-contain"
                />
              )}
            </div>
            <div className="w-full md:w-2/3 p-4 md:p-8 flex flex-col justify-between">
              <div>
                <h4 className="text-base md:text-lg font-bold text-foreground mb-2 line-clamp-2 leading-snug">
                  {metadata.title}
                </h4>
                <p className="text-[10px] md:text-sm text-muted-foreground break-all opacity-70">
                  {metadata.reelUrl}
                </p>
              </div>
              <div className="flex flex-col gap-3 mt-6">
                <Button
                  onClick={handleDownload}
                  size="lg"
                  className="w-full h-12 md:h-14 bg-indigo-600 text-white font-bold rounded-xl md:rounded-2xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <Download className="w-4 h-4" />
                  Download High Quality Video
                </Button>
                {showPreview && (
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(false)}
                    className="w-full h-10 md:h-12 rounded-lg md:rounded-xl border-border text-muted-foreground hover:text-foreground transition-all text-xs md:text-sm"
                  >
                    Back to Thumbnail
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Extension Install Modal */}
      {showInstallModal && mounted && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-card border border-border rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
              Instagram Block Detected
            </h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Instagram's servers are blocking anonymous downloads from cloud datacenters. Fix this instantly by installing our free, open-source <strong>ClipVault Companion</strong> extension.
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Uses Your Residential Connection</h4>
                  <p className="text-xs text-muted-foreground">Performs the extraction locally using your own connection—completely free from blocks.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Privacy Guaranteed</h4>
                  <p className="text-xs text-muted-foreground">Does not collect, store, or transmit your Instagram password, cookies, or session data.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a 
                href="/extension/clipvault-companion.zip" 
                download
                className="w-full h-12 md:h-14 bg-indigo-600 text-white font-bold rounded-xl md:rounded-2xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
              >
                Download Extension (.zip)
              </a>
              <button
                onClick={() => setShowInstallModal(false)}
                className="w-full h-10 rounded-xl border border-border text-muted-foreground hover:text-foreground transition-all text-xs font-semibold"
              >
                Maybe Later
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <a 
                href="/faq#extension-install" 
                target="_blank"
                className="text-xs text-indigo-400 hover:underline"
              >
                Need help installing the unpacked extension? Read Guide
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
