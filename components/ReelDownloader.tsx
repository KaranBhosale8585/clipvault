"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download, Link as LinkIcon, Loader2, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ReelMetadata {
  id: string;
  reelUrl: string;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
}

export default function ReelDownloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<ReelMetadata | null>(null);
  const [showPreview, setShowPreview] = useState(false);

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
      console.log(`[UI] Initiating extraction for: ${url}`);
      const res = await fetch("/api/reel/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          toast.error(data.message || "Too many requests. Please wait.");
        } else {
          console.error(`[UI] Extraction failed: ${data.error} - ${data.message}`);
          toast.error(data.message || "Failed to extract Reel");
        }
      } else {
        console.log(`[UI] Extraction successful. Final Video URL: ${data.data.videoUrl}`);
        setMetadata(data.data);
        toast.success("Reel metadata extracted!");
        // Notify DownloadHistory to refresh
        window.dispatchEvent(new CustomEvent("refresh-history"));
      }
    } catch (error) {
      console.error(`[UI] Network or unexpected error:`, error);
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
          <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
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
                className="pl-11 h-14 bg-background border-border rounded-2xl focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all text-sm font-medium"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-foreground text-background font-bold rounded-2xl shadow-lg shadow-black/5 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
          <div className="md:flex">
            <div className="md:w-1/3 relative group bg-black flex items-center justify-center min-h-[200px]">
              {!showPreview ? (
                <>
                  <img
                    src={`/api/download-proxy?url=${encodeURIComponent(metadata.thumbnailUrl)}&download=false`}
                    alt={metadata.title}
                    className="w-full h-48 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
            <div className="md:w-2/3 p-8 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                  {metadata.title}
                </h4>
                <p className="text-sm text-muted-foreground break-all">
                  {metadata.reelUrl}
                </p>
              </div>
              <div className="flex flex-col gap-3 mt-6">
                <Button
                  onClick={handleDownload}
                  size="lg"
                  className="w-full h-14 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download High Quality Video
                </Button>
                {showPreview && (
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(false)}
                    className="w-full h-12 rounded-xl border-border text-muted-foreground hover:text-foreground transition-all"
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
