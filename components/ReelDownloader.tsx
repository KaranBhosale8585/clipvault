"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Download, Link as LinkIcon, Loader2, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

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

  // Still keep an effect if the user navigates to a new URL with a different ?url param
  useEffect(() => {
    const queryUrl = searchParams.get("url");
    if (queryUrl && queryUrl !== url) {
      // Use setTimeout to avoid synchronous setState in effect (linter error)
      const timeout = setTimeout(() => setUrl(queryUrl), 0);
      return () => clearTimeout(timeout);
    }
  }, [searchParams, url]);

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Please enter a Reel URL");
      return;
    }

    setLoading(true);
    setMetadata(null);
    setShowPreview(false);

    try {
      const res = await fetch("/api/reel/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401 && data.error === "Limit Exceeded") {
          onLimitReached?.(url);
          return;
        }

        if (res.status === 403 && data.error === "Daily Limit Reached") {
          onDailyLimitReached?.();
          return;
        }
        
        if (res.status === 429) {
          toast.error(data.message || "Too many requests. Please wait.");
        } else {
          toast.error(data.message || "Failed to extract Reel");
        }
      } else {
        setMetadata(data.data);
        toast.success("Reel metadata extracted!");
        // Notify DownloadHistory to refresh
        window.dispatchEvent(new CustomEvent("refresh-history"));
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!metadata) return;
    
    // Use the download proxy to bypass CORS and force download
    const proxyUrl = `/api/download-proxy?url=${encodeURIComponent(metadata.videoUrl)}&filename=${encodeURIComponent(`reel-${metadata.id}.mp4`)}`;
    window.location.href = proxyUrl;
    toast.success("Starting download...");
  };

  return (
    <div className="space-y-6">
      <Card className="border-border transition-all hover:shadow-2xl hover:shadow-indigo-500/5 overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-500" />
            ClipVault Extraction Engine
          </CardTitle>
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
                  <img
                    src={`/api/download-proxy?url=${encodeURIComponent(metadata.thumbnailUrl)}&download=false`}
                    alt={metadata.title}
                    className="w-full h-64 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
    </div>
  );
}
