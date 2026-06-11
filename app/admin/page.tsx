"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Users, Download, ShieldCheck, Activity, ArrowLeft, ExternalLink, Loader2, ListTree, AlertCircle, AlertTriangle, Info } from "lucide-react";
import Link from "next/link";

interface AdminData {
  stats: {
    totalUsers: number;
    totalDownloads: number;
  };
  recentDownloads: {
    id: string;
    title: string | null;
    reelUrl: string;
    createdAt: string;
    userName: string;
  }[];
  latestLogs: {
    id: string;
    level: string;
    message: string;
    metadata: string | null;
    source: string | null;
    createdAt: string;
  }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [activeTab, setActiveTab] = useState<"activity" | "logs">("activity");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const json = await res.json();

        if (res.status === 403) {
          setForbidden(true);
          toast.error("Access denied. Admins only.");
        } else if (!res.ok) {
          toast.error(json.message || "Failed to fetch admin data.");
        } else {
          setData(json.data);
        }
      } catch {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <ShieldCheck className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-3xl font-black text-foreground mb-2">Access Restricted</h1>
        <p className="text-muted-foreground mb-8">You do not have the required permissions to view this page.</p>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl font-bold transition-all hover:opacity-90"
        >
          <ArrowLeft size={18} />
          Back to Workspace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-[0.2em] mb-2">
              <ShieldCheck size={14} />
              Admin Control Center
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-foreground">
              Analytics
            </h1>
          </div>
          <Link 
            href="/" 
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-sm font-bold text-foreground hover:border-indigo-500/50 transition-all"
          >
            <ArrowLeft size={16} />
            Workspace
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-card border border-border rounded-3xl p-8 flex items-center gap-6">
            <div className="h-16 w-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500">
              <Users size={32} />
            </div>
            <div>
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Total Users</p>
              <p className="text-4xl font-black text-foreground">{data?.stats.totalUsers}</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-3xl p-8 flex items-center gap-6">
            <div className="h-16 w-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
              <Download size={32} />
            </div>
            <div>
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Extractions</p>
              <p className="text-4xl font-black text-foreground">{data?.stats.totalDownloads}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setActiveTab("activity")}
            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "activity" 
              ? "bg-foreground text-background shadow-lg shadow-black/5" 
              : "bg-card border border-border text-muted-foreground hover:border-indigo-500/30"
            }`}
          >
            User Activity
          </button>
          <button 
            onClick={() => setActiveTab("logs")}
            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "logs" 
              ? "bg-foreground text-background shadow-lg shadow-black/5" 
              : "bg-card border border-border text-muted-foreground hover:border-indigo-500/30"
            }`}
          >
            System Logs
          </button>
        </div>

        {activeTab === "activity" ? (
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl shadow-black/5 animate-in fade-in duration-300">
            <div className="p-8 border-b border-border flex items-center justify-between bg-muted/30">
              <h3 className="text-xl font-black text-foreground flex items-center gap-3">
                <Activity className="text-indigo-500" />
                Live Feed
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/10">
                    <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">User</th>
                    <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">Reel Title</th>
                    <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data?.recentDownloads.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/10 transition-colors group">
                      <td className="p-6">
                        <p className="text-sm font-bold text-foreground">{item.userName}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">{new Date(item.createdAt).toLocaleString()}</p>
                      </td>
                      <td className="p-6">
                        <p className="text-sm font-medium text-foreground line-clamp-1 max-w-md">
                          {item.title || "Unknown Reel"}
                        </p>
                      </td>
                      <td className="p-6 text-center">
                        <a 
                          href={item.reelUrl} 
                          target="_blank" 
                          className="inline-flex p-2 text-muted-foreground hover:text-indigo-500 hover:bg-indigo-500/5 rounded-lg transition-all"
                        >
                          <ExternalLink size={18} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data?.recentDownloads.length === 0 && (
              <div className="p-12 text-center text-muted-foreground font-medium">
                No recent activity recorded.
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl shadow-black/5 animate-in fade-in duration-300">
             <div className="p-8 border-b border-border flex items-center justify-between bg-muted/30">
              <h3 className="text-xl font-black text-foreground flex items-center gap-3">
                <ListTree className="text-indigo-500" />
                System Audit
              </h3>
            </div>
            <div className="divide-y divide-border">
              {data?.latestLogs.map((log) => (
                <div key={log.id} className="p-6 hover:bg-muted/5 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 p-2 rounded-lg ${
                      log.level === "error" ? "bg-red-500/10 text-red-500" :
                      log.level === "warn" ? "bg-amber-500/10 text-amber-500" :
                      "bg-blue-500/10 text-blue-500"
                    }`}>
                      {log.level === "error" && <AlertCircle size={16} />}
                      {log.level === "warn" && <AlertTriangle size={16} />}
                      {log.level === "info" && <Info size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <p className="text-xs font-black uppercase tracking-wider text-foreground">
                          {log.source || "System"}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium">
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-foreground mb-2">{log.message}</p>
                      {log.metadata && (
                        <div className="bg-background/50 border border-border p-3 rounded-xl">
                          <pre className="text-[10px] text-muted-foreground overflow-x-auto whitespace-pre-wrap font-mono">
                            {JSON.stringify(JSON.parse(log.metadata), null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {data?.latestLogs.length === 0 && (
                <div className="p-12 text-center text-muted-foreground font-medium">
                  No logs available.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
