"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { 
  Users, Download, ShieldCheck, Activity, ArrowLeft, 
  ExternalLink, ListTree, AlertCircle, AlertTriangle, 
  Info, Trash2, Zap, Globe, BarChart3, Search,
  RefreshCcw, Database, ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface AdminData {
  stats: {
    totalUsers: number;
    totalDownloads: number;
    downloadsToday: number;
    anonDownloads: number;
    regDownloads: number;
  };
  topUrls: Array<{
    url: string;
    title: string | null;
    count: number;
  }>;
  recentDownloads: Array<{
    id: string;
    title: string | null;
    reelUrl: string;
    createdAt: string;
    userName: string | null;
  }>;
  latestLogs: Array<{
    id: string;
    level: string;
    message: string;
    metadata: string | null;
    source: string | null;
    createdAt: string;
  }>;
}

function safeJsonFormat(jsonStr: string | null): string {
  if (!jsonStr) return "";
  try {
    const parsed = JSON.parse(jsonStr);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return jsonStr;
  }
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchSearchQuery] = useState("");

  const fetchAdminData = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.message || "Failed to fetch admin data.");
      } else {
        setData(json.data);
      }
    } catch {
      toast.error("Network error fetching admin stats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAdminData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleAction = async (action: "clear-logs" | "clear-downloads" | "clear-cache") => {
    if (!confirm(`Are you sure you want to proceed with this destructive action?`)) return;
    
    setActionLoading(action);
    try {
      const res = await fetch(`/api/admin/actions/${action}`, { method: "POST" });
      if (res.ok) {
        toast.success("Action completed successfully");
        fetchAdminData();
      } else {
        toast.error("Action failed");
      }
    } catch {
      toast.error("Network error performing action");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredLogs = useMemo(() => {
    if (!data) return [];
    return data.latestLogs.filter(log => 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.source && log.source.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [data, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
          </div>
          <Skeleton className="h-[600px] rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 px-6 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
                <ShieldCheck size={24} />
              </div>
              <h1 className="text-3xl font-black tracking-tighter">Control Center</h1>
            </div>
            <p className="text-muted-foreground font-medium">Monitor platform health and manage resources.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={fetchAdminData} className="rounded-xl border-border">
              <RefreshCcw size={16} className="mr-2" /> Refresh
            </Button>
            <Link href="/">
              <Button variant="outline" className="rounded-xl border-border">
                <ArrowLeft size={16} className="mr-2" /> Back to App
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            title="Total Users" 
            value={data?.stats.totalUsers || 0} 
            icon={<Users className="text-indigo-500" />} 
            subtitle="Registered accounts"
          />
          <StatCard 
            title="Downloads Today" 
            value={data?.stats.downloadsToday || 0} 
            icon={<Zap className="text-amber-500" />} 
            subtitle="Processed in last 24h"
          />
          <StatCard 
            title="Success Rate" 
            value="98.4%" 
            icon={<Activity className="text-emerald-500" />} 
            subtitle="System reliability"
          />
          <StatCard 
            title="Anonymous Ratio" 
            value={`${Math.round((data?.stats.anonDownloads || 0) / (data?.stats.totalDownloads || 1) * 100)}%`} 
            icon={<Globe className="text-sky-500" />} 
            subtitle="Free tier usage"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="downloads" className="w-full">
              <TabsList className="bg-muted/50 p-1 mb-6 rounded-2xl border border-border">
                <TabsTrigger value="downloads" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Recent Downloads
                </TabsTrigger>
                <TabsTrigger value="logs" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  System Logs
                </TabsTrigger>
                <TabsTrigger value="analytics" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Top Content
                </TabsTrigger>
              </TabsList>

              <TabsContent value="downloads">
                <Card className="border-border rounded-3xl overflow-hidden">
                  <CardHeader className="border-b border-border bg-muted/20 px-8 py-6">
                    <CardTitle className="text-xl font-black">Download Stream</CardTitle>
                    <CardDescription>Live feed of processing requests.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent border-border">
                            <TableHead className="px-8 py-4 font-bold text-xs uppercase tracking-widest">Reel Title</TableHead>
                            <TableHead className="py-4 font-bold text-xs uppercase tracking-widest">User</TableHead>
                            <TableHead className="py-4 font-bold text-xs uppercase tracking-widest">Time</TableHead>
                            <TableHead className="px-8 py-4 font-bold text-xs uppercase tracking-widest text-right">Link</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data?.recentDownloads.map((dl) => (
                            <TableRow key={dl.id} className="border-border hover:bg-muted/30 transition-colors group">
                              <TableCell className="px-8 py-4 font-medium max-w-[200px] truncate">
                                {dl.title || "Untitled Reel"}
                              </TableCell>
                              <TableCell className="py-4">
                                {dl.userName ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                                    {dl.userName}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground text-xs font-medium italic">Anonymous</span>
                                )}
                              </TableCell>
                              <TableCell className="py-4 text-xs font-medium text-muted-foreground">
                                {new Date(dl.createdAt).toLocaleTimeString()}
                              </TableCell>
                              <TableCell className="px-8 py-4 text-right">
                                <a href={dl.reelUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-indigo-500 hover:underline">
                                  <ExternalLink size={14} />
                                </a>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="logs">
                <Card className="border-border rounded-3xl overflow-hidden">
                  <CardHeader className="border-b border-border bg-muted/20 px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl font-black">System Audit</CardTitle>
                        <CardDescription>Search and filter system events.</CardDescription>
                      </div>
                      <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input 
                          placeholder="Search logs..." 
                          className="pl-10 rounded-xl bg-background border-border"
                          value={searchQuery}
                          onChange={(e) => setSearchSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                    <AnimatePresence mode="popLayout">
                      {filteredLogs.map((log) => (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          key={log.id} 
                          className="p-5 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all group"
                        >
                          <div className="flex items-start gap-4">
                            <div className={`mt-1 p-2 rounded-lg ${
                              log.level === "error" ? "bg-red-500/10 text-red-500" :
                              log.level === "warn" ? "bg-amber-500/10 text-amber-500" :
                              "bg-sky-500/10 text-sky-500"
                            }`}>
                              {log.level === "error" ? <AlertCircle size={16} /> :
                               log.level === "warn" ? <AlertTriangle size={16} /> :
                               <Info size={16} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-4 mb-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                  {log.source || "System"} • {new Date(log.createdAt).toLocaleString()}
                                </span>
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  log.level === "error" ? "bg-red-500/10 text-red-500" :
                                  log.level === "warn" ? "bg-amber-500/10 text-amber-500" :
                                  "bg-sky-500/10 text-sky-500"
                                }`}>
                                  {log.level}
                                </span>
                              </div>
                              <p className="text-sm font-bold text-foreground mb-3 leading-relaxed">{log.message}</p>
                              {log.metadata && (
                                <div className="bg-background/50 border border-border p-4 rounded-xl overflow-hidden">
                                  <pre className="text-[10px] text-muted-foreground overflow-x-auto whitespace-pre-wrap font-mono custom-scrollbar">
                                    {safeJsonFormat(log.metadata)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {filteredLogs.length === 0 && (
                      <div className="p-12 text-center text-muted-foreground font-medium italic">
                        No matches found.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <Card className="border-border rounded-3xl overflow-hidden">
                  <CardHeader className="border-b border-border bg-muted/20 px-8 py-6">
                    <CardTitle className="text-xl font-black">Top Content</CardTitle>
                    <CardDescription>Most frequently downloaded Reels.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      {data?.topUrls.map((item, idx) => (
                        <div key={item.url} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border group transition-all hover:bg-muted/50">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-black text-xs">
                              #{idx + 1}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold truncate group-hover:text-indigo-500 transition-colors">
                                {item.title || "Untitled Reel"}
                              </p>
                              <p className="text-[10px] text-muted-foreground truncate">{item.url}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-xs font-black">{item.count}</p>
                              <p className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold">hits</p>
                            </div>
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-background rounded-lg text-muted-foreground hover:text-indigo-500 transition-colors">
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-8">
            <Card className="border-border rounded-3xl p-8 bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 overflow-hidden relative">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <BarChart3 size={20} /> Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-6 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1 text-[9px]">Registered</p>
                    <p className="text-2xl font-black">{data?.stats.regDownloads || 0}</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1 text-[9px]">Anonymous</p>
                    <p className="text-2xl font-black">{data?.stats.anonDownloads || 0}</p>
                  </div>
                </div>
                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                  <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1 text-[9px]">Lifetime Activity</p>
                  <p className="text-3xl font-black">{data?.stats.totalDownloads || 0}</p>
                </div>
              </CardContent>
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
            </Card>

            <Card className="border-border rounded-3xl p-8 bg-card shadow-sm border border-red-500/10">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-lg font-black text-foreground flex items-center gap-2">
                  <Database size={18} className="text-red-500" /> Maintenance
                </CardTitle>
                <CardDescription>Destructive administrative actions.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <AdminActionButton 
                  label="Clear Logs" 
                  icon={<ShieldAlert size={16} />}
                  isLoading={actionLoading === "clear-logs"}
                  onClick={() => handleAction("clear-logs")}
                  variant="destructive-soft"
                />
                <AdminActionButton 
                  label="Purge Downloads" 
                  icon={<Trash2 size={16} />}
                  isLoading={actionLoading === "clear-downloads"}
                  onClick={() => handleAction("clear-downloads")}
                  variant="destructive-soft"
                />
                <AdminActionButton 
                  label="Flush Cache" 
                  icon={<Zap size={16} />}
                  isLoading={actionLoading === "clear-cache"}
                  onClick={() => handleAction("clear-cache")}
                  variant="outline"
                />
              </CardContent>
            </Card>

            <Card className="border-border rounded-3xl p-8 bg-muted/30 border-dashed">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Activity size={14} /> System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <HealthItem label="API Status" status="Online" color="bg-emerald-500" />
                <HealthItem label="Database" status="Optimal" color="bg-emerald-500" />
                <HealthItem label="Downloader" status="Idle" color="bg-sky-500" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, subtitle }: { title: string; value: string | number; icon: React.ReactNode; subtitle: string }) {
  return (
    <Card className="border-border rounded-3xl p-6 bg-card shadow-sm hover:shadow-lg transition-all border border-indigo-500/5 group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 bg-muted rounded-xl group-hover:bg-indigo-500/5 transition-colors">
          {icon}
        </div>
        <BarChart3 className="text-muted-foreground/20 group-hover:text-indigo-500/20 transition-colors" size={18} />
      </div>
      <div>
        <h3 className="text-sm font-bold text-muted-foreground mb-1">{title}</h3>
        <p className="text-3xl font-black text-foreground tracking-tighter mb-1">{value}</p>
        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{subtitle}</p>
      </div>
    </Card>
  );
}

function AdminActionButton({ label, icon, onClick, isLoading, variant }: { label: string; icon: React.ReactNode; onClick: () => void; isLoading: boolean; variant: "destructive-soft" | "outline" }) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={isLoading}
      className={`w-full h-12 rounded-xl font-bold text-xs uppercase tracking-widest justify-start border-border gap-3 transition-all ${
        variant === "destructive-soft" 
          ? "text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500" 
          : "hover:bg-indigo-600 hover:text-white hover:border-indigo-600"
      }`}
    >
      {isLoading ? <RefreshCcw size={16} className="animate-spin" /> : icon}
      {label}
    </Button>
  );
}

function HealthItem({ label, status, color }: { label: string; status: string; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black uppercase text-foreground">{status}</span>
        <div className={`w-2 h-2 rounded-full ${color} animate-pulse`}></div>
      </div>
    </div>
  );
}
