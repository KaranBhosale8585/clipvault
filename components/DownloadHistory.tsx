"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Download, History, Play, ExternalLink, Loader2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface DownloadRecord {
  id: string;
  reelUrl: string;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  title: string | null;
  status: string;
  createdAt: string;
}

export default function DownloadHistory() {
  const [history, setHistory] = useState<DownloadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/reel/history");
      const data = await res.json();
      if (res.ok) {
        setHistory(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    setClearing(true);
    try {
      const res = await fetch("/api/reel/history", {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("History cleared successfully");
        setHistory([]);
        setShowConfirm(false);
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to clear history");
      }
    } catch {
      toast.error("Network error clearing history");
    } finally {
      setClearing(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHistory();
    }, 0);
    
    // Refresh history when a new download is triggered (via custom event)
    const handleRefresh = () => fetchHistory();
    window.addEventListener("refresh-history", handleRefresh);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("refresh-history", handleRefresh);
    };
  }, []);

  if (loading) {
    return (
      <Card className="border-border rounded-3xl p-8 shadow-none bg-card">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-500" />
            Download History
          </CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-video h-40 rounded-2xl" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-border rounded-3xl p-5 md:p-8 shadow-none bg-card">
      <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-base md:text-lg font-bold text-foreground flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-500" />
          Recent Downloads
        </CardTitle>
        <div className="flex items-center gap-4">
           {history.length > 0 && !showConfirm && (
             <Button 
               variant="outline" 
               size="sm" 
               onClick={() => setShowConfirm(true)} 
               disabled={clearing}
               className="rounded-xl border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all gap-2 h-9 px-4"
             >
               <Trash2 className="w-3 h-3" />
               Clear
             </Button>
           )}
           {showConfirm && (
             <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleClearHistory} 
                  disabled={clearing}
                  className="rounded-xl h-9 px-4 text-xs font-bold"
                >
                  {clearing ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : null}
                  Confirm
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowConfirm(false)} 
                  disabled={clearing}
                  className="rounded-xl h-9 px-4 text-xs font-bold"
                >
                  Cancel
                </Button>
             </div>
           )}
           <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest hidden sm:inline-block">
             Last 10 Items
           </span>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {history.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground font-medium">Your recent downloads will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {history.map((item) => (
              <div 
                key={item.id} 
                className="group relative bg-background border border-border rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all hover:shadow-xl hover:shadow-black/5"
              >
                <div className="aspect-video relative overflow-hidden bg-muted">
                  {item.thumbnailUrl ? (
                    <img 
                      src={`/api/download-proxy?url=${encodeURIComponent(item.thumbnailUrl)}&download=false`} 
                      alt={item.title || "Reel"} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-muted-foreground opacity-20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <Button 
                      size="icon"
                      variant="secondary"
                      onClick={() => {
                        if (!item.videoUrl) return;
                        const proxyUrl = `/api/download-proxy?url=${encodeURIComponent(item.videoUrl)}&filename=${encodeURIComponent(`reel-${item.id}.mp4`)}`;
                        window.location.href = proxyUrl;
                        toast.success("Starting download...");
                      }}
                      className="rounded-full bg-white text-black hover:scale-110 transition-transform"
                      title="Download Again"
                     >
                       <Download size={20} />
                     </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-bold text-foreground line-clamp-1 mb-1">
                    {item.title || "Untitled Reel"}
                  </h4>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] text-muted-foreground font-medium truncate flex-1">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                    <a 
                      href={item.reelUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-indigo-500 transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
