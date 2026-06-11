"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download, Link as LinkIcon, Loader2, Play } from "lucide-react";

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

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Please enter a Reel URL");
      return;
    }

    setLoading(true);
    setMetadata(null);

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
      <div className="bg-card border border-border rounded-3xl p-8 transition-all hover:shadow-2xl hover:shadow-indigo-500/5">
        <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Download className="w-5 h-5 text-indigo-500" />
          Instagram Reel Downloader
        </h3>

        <form onSubmit={handleExtract} className="space-y-4">
          <div className="relative group">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Paste Instagram Reel URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-11 pr-4 py-4 bg-background border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-foreground text-background font-bold rounded-2xl shadow-lg shadow-black/5 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Extracting...
              </>
            ) : (
              "Analyze Reel"
            )}
          </button>
        </form>
      </div>

      {metadata && (
        <div className="bg-card border border-border rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="md:flex">
            <div className="md:w-1/3 relative group">
              <img
                src={metadata.thumbnailUrl}
                alt={metadata.title}
                className="w-full h-48 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-12 h-12 text-white fill-current" />
              </div>
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
              <button
                onClick={handleDownload}
                className="mt-6 w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download High Quality Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
