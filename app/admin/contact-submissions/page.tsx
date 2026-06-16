"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { 
  ArrowLeft, Mail, RefreshCcw, Search, 
  CheckCircle2, Clock,
  Info, Check, Loader2, Trash2, Eye
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "NEW" | "READ" | "REPLIED";
  createdAt: string;
  updatedAt: string;
}

export default function AdminContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    submissionId: string;
    action: "delete" | null;
  }>({
    isOpen: false,
    submissionId: "",
    action: null,
  });

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contact-submissions");
      const json = await res.json();

      if (res.ok) {
        setSubmissions(json.data);
      } else {
        toast.error(json.error || "Failed to fetch submissions.");
      }
    } catch {
      toast.error("Network error fetching submissions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSubmissions();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchSubmissions]);

  const handleUpdateStatus = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/contact-submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast.success(`Marked as ${status}`);
        setSubmissions(prev => 
          prev.map(s => s.id === id ? { ...s, status: status as ContactSubmission["status"] } : s)
        );
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update status");
      }
    } catch {
      toast.error("Network error updating status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    const { submissionId } = confirmDialog;
    if (!submissionId) return;

    setActionLoading(submissionId);
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));

    try {
      const res = await fetch(`/api/admin/contact-submissions/${submissionId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Submission deleted");
        setSubmissions(prev => prev.filter(s => s.id !== submissionId));
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete submission");
      }
    } catch {
      toast.error("Network error during deletion");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      const matchesSearch = 
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.message.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "ALL" || sub.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchQuery, statusFilter]);

  if (loading && submissions.length === 0) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-10 w-48" />
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
                <Mail size={24} />
              </div>
              <h1 className="text-3xl font-black tracking-tighter">Contact Submissions</h1>
            </div>
            <p className="text-muted-foreground font-medium">Manage user inquiries and feedback.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={fetchSubmissions} className="rounded-xl border-border">
              <RefreshCcw size={16} className={`mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Link href="/admin">
              <Button variant="outline" className="rounded-xl border-border">
                <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <Card className="border-border rounded-3xl overflow-hidden">
            <CardHeader className="border-b border-border bg-muted/20 px-8 py-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full lg:w-auto">
                  <TabsList className="bg-background border border-border p-1 rounded-xl">
                    <TabsTrigger value="ALL" className="rounded-lg font-bold px-4">All</TabsTrigger>
                    <TabsTrigger value="NEW" className="rounded-lg font-bold px-4">New</TabsTrigger>
                    <TabsTrigger value="READ" className="rounded-lg font-bold px-4">Read</TabsTrigger>
                    <TabsTrigger value="REPLIED" className="rounded-lg font-bold px-4">Replied</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="relative w-full lg:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input 
                    placeholder="Search by name, email, or content..." 
                    className="pl-10 rounded-xl bg-background border-border"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border">
                      <TableHead className="px-8 py-4 font-bold text-xs uppercase tracking-widest">Submitter</TableHead>
                      <TableHead className="py-4 font-bold text-xs uppercase tracking-widest">Subject & Message</TableHead>
                      <TableHead className="py-4 font-bold text-xs uppercase tracking-widest text-center">Status</TableHead>
                      <TableHead className="px-8 py-4 font-bold text-xs uppercase tracking-widest text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {filteredSubmissions.map((sub) => (
                        <TableRow key={sub.id} className="border-border hover:bg-muted/30 transition-colors group">
                          <TableCell className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-sm">
                                {sub.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-foreground">{sub.name}</p>
                                <p className="text-xs text-muted-foreground">{sub.email}</p>
                                <p className="text-[10px] text-muted-foreground mt-1">
                                  {new Date(sub.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-6 max-w-md">
                            <div className="space-y-1">
                              <p className="text-sm font-bold truncate">{sub.subject}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                {sub.message}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="py-6 text-center">
                            <StatusBadge status={sub.status} />
                          </TableCell>
                          <TableCell className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {sub.status === "NEW" && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  title="Mark as Read"
                                  className="rounded-lg h-9 border-indigo-500/20 text-indigo-600 hover:bg-indigo-500 hover:text-white"
                                  onClick={() => handleUpdateStatus(sub.id, "READ")}
                                  disabled={actionLoading === sub.id}
                                >
                                  {actionLoading === sub.id ? <Loader2 size={14} className="animate-spin" /> : <Eye size={16} />}
                                </Button>
                              )}
                              {sub.status !== "REPLIED" && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  title="Mark as Replied"
                                  className="rounded-lg h-9 border-green-500/20 text-green-600 hover:bg-green-500 hover:text-white"
                                  onClick={() => handleUpdateStatus(sub.id, "REPLIED")}
                                  disabled={actionLoading === sub.id}
                                >
                                  {actionLoading === sub.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={16} />}
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="outline" 
                                title="Delete"
                                className="rounded-lg h-9 border-red-500/20 text-red-600 hover:bg-red-500 hover:text-white"
                                onClick={() => setConfirmDialog({ isOpen: true, submissionId: sub.id, action: "delete" })}
                                disabled={actionLoading === sub.id}
                              >
                                {actionLoading === sub.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={16} />}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
                
                {filteredSubmissions.length === 0 && (
                  <div className="p-20 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <Info size={32} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-black tracking-tight mb-2">No Submissions Found</h3>
                    <p className="text-muted-foreground font-medium max-w-xs mx-auto">
                      There are no contact submissions matching your current filter.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={confirmDialog.isOpen} 
        onOpenChange={(open: boolean) => setConfirmDialog(prev => ({ ...prev, isOpen: open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this contact submission? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={!!actionLoading}
            >
              {actionLoading ? (
                <Loader2 size={16} className="animate-spin mr-2" />
              ) : null}
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatusBadge({ status }: { status: "NEW" | "READ" | "REPLIED" }) {
  switch (status) {
    case "NEW":
      return (
        <Badge variant="outline" className="rounded-full px-3 py-1 border-indigo-500/20 bg-indigo-500/10 text-indigo-600 font-black text-[10px] uppercase tracking-wider gap-1.5">
          <Clock size={12} /> New
        </Badge>
      );
    case "READ":
      return (
        <Badge variant="outline" className="rounded-full px-3 py-1 border-sky-500/20 bg-sky-500/10 text-sky-600 font-black text-[10px] uppercase tracking-wider gap-1.5">
          <Eye size={12} /> Read
        </Badge>
      );
    case "REPLIED":
      return (
        <Badge variant="outline" className="rounded-full px-3 py-1 border-emerald-500/20 bg-emerald-500/10 text-emerald-600 font-black text-[10px] uppercase tracking-wider gap-1.5">
          <CheckCircle2 size={12} /> Replied
        </Badge>
      );
    default:
      return null;
  }
}
