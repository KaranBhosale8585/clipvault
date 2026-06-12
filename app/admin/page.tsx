"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Users, Download, ShieldCheck, Activity, ArrowLeft, ExternalLink, ListTree, AlertCircle, AlertTriangle, Info } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

/**
 * Safely parses and formats JSON strings.
 * Returns the original string if parsing fails.
 */
function safeJsonFormat(jsonStr: string | null): string {
  if (!jsonStr) return "";
  try {
    const parsed = JSON.parse(jsonStr);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return jsonStr;
  }
}

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
      <div className="min-h-screen bg-background p-6 md:p-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-12 w-48" />
            </div>
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-32 rounded-3xl" />
            <Skeleton className="h-32 rounded-3xl" />
          </div>
          <Skeleton className="h-[500px] rounded-3xl" />
        </div>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <ShieldCheck className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-3xl font-black text-foreground mb-2">Access Restricted</h1>
        <p className="text-muted-foreground mb-8">You do not have the required permissions to view this page.</p>
        <Button asChild className="rounded-xl font-bold h-12 px-8">
          <Link href="/">
            <ArrowLeft size={18} className="mr-2" />
            Back to Workspace
          </Link>
        </Button>
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
          <Button variant="outline" asChild className="rounded-xl font-bold border-border hover:border-indigo-500/50">
            <Link href="/">
              <ArrowLeft size={16} className="mr-2" />
              Workspace
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="rounded-3xl p-8 flex items-center gap-6 border-border shadow-none">
            <div className="h-16 w-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500">
              <Users size={32} />
            </div>
            <div>
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Total Users</p>
              <p className="text-4xl font-black text-foreground">{data?.stats.totalUsers}</p>
            </div>
          </Card>
          <Card className="rounded-3xl p-8 flex items-center gap-6 border-border shadow-none">
            <div className="h-16 w-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
              <Download size={32} />
            </div>
            <div>
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Extractions</p>
              <p className="text-4xl font-black text-foreground">{data?.stats.totalDownloads}</p>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-2xl h-auto gap-2">
            <TabsTrigger 
              value="activity"
              className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background shadow-none"
            >
              User Activity
            </TabsTrigger>
            <TabsTrigger 
              value="logs"
              className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background shadow-none"
            >
              System Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activity">
            <Card className="border-border rounded-3xl overflow-hidden shadow-xl shadow-black/5 animate-in fade-in duration-300">
              <CardHeader className="p-8 border-b border-border flex flex-row items-center justify-between bg-muted/30">
                <CardTitle className="text-xl font-black text-foreground flex items-center gap-3">
                  <Activity className="text-indigo-500" />
                  Live Feed
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/10">
                    <TableRow>
                      <TableHead className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">User</TableHead>
                      <TableHead className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">Reel Title</TableHead>
                      <TableHead className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.recentDownloads.map((item) => (
                      <TableRow key={item.id} className="group">
                        <TableCell className="p-6">
                          <p className="text-sm font-bold text-foreground">{item.userName}</p>
                          <p className="text-[10px] text-muted-foreground font-medium">{new Date(item.createdAt).toLocaleString()}</p>
                        </TableCell>
                        <TableCell className="p-6">
                          <p className="text-sm font-medium text-foreground line-clamp-1 max-w-md">
                            {item.title || "Unknown Reel"}
                          </p>
                        </TableCell>
                        <TableCell className="p-6 text-center">
                          <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-indigo-500 hover:bg-indigo-500/5 rounded-lg">
                            <a href={item.reelUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink size={18} />
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {data?.recentDownloads.length === 0 && (
                  <div className="p-12 text-center text-muted-foreground font-medium">
                    No recent activity recorded.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card className="border-border rounded-3xl overflow-hidden shadow-xl shadow-black/5 animate-in fade-in duration-300">
              <CardHeader className="p-8 border-b border-border flex flex-row items-center justify-between bg-muted/30">
                <CardTitle className="text-xl font-black text-foreground flex items-center gap-3">
                  <ListTree className="text-indigo-500" />
                  System Audit
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-border">
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
                              {safeJsonFormat(log.metadata)}
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
