"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { 
  ArrowLeft, ShieldCheck, RefreshCcw, Search, 
  CheckCircle2, XCircle, Clock,
  Info, Check, X, Loader2
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

interface UnlimitedAccessRequest {
  id: string;
  userId: string;
  name: string;
  email: string;
  useCase: string;
  expectedUsage: string;
  notes: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminUnlimitedAccess() {
  const [requests, setRequests] = useState<UnlimitedAccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    requestId: string;
    action: "approve" | "reject";
  }>({
    isOpen: false,
    requestId: "",
    action: "approve",
  });

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/unlimited-access?status=${statusFilter}`);
      const json = await res.json();

      if (res.ok) {
        setRequests(json.data);
      } else {
        toast.error(json.message || "Failed to fetch requests.");
      }
    } catch {
      toast.error("Network error fetching requests.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRequests();
  }, [fetchRequests]);

  const handleAction = async () => {
    const { requestId, action } = confirmDialog;
    if (!requestId) return;

    setActionLoading(requestId);
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));

    try {
      const res = await fetch(`/api/admin/unlimited-access/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });

      const json = await res.json();

      if (res.ok) {
        toast.success(json.message);
        fetchRequests();
      } else {
        toast.error(json.message || `Failed to ${action} request.`);
      }
    } catch {
      toast.error(`Network error during ${action}.`);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(req => 
      req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.useCase.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [requests, searchQuery]);

  if (loading && requests.length === 0) {
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
                <ShieldCheck size={24} />
              </div>
              <h1 className="text-3xl font-black tracking-tighter">Unlimited Access Requests</h1>
            </div>
            <p className="text-muted-foreground font-medium">Review and manage PRO access applications.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={fetchRequests} className="rounded-xl border-border">
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
                    <TabsTrigger value="PENDING" className="rounded-lg font-bold px-4">Pending</TabsTrigger>
                    <TabsTrigger value="APPROVED" className="rounded-lg font-bold px-4">Approved</TabsTrigger>
                    <TabsTrigger value="REJECTED" className="rounded-lg font-bold px-4">Rejected</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="relative w-full lg:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input 
                    placeholder="Search by name, email, or use case..." 
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
                      <TableHead className="px-8 py-4 font-bold text-xs uppercase tracking-widest">User</TableHead>
                      <TableHead className="py-4 font-bold text-xs uppercase tracking-widest">Details</TableHead>
                      <TableHead className="py-4 font-bold text-xs uppercase tracking-widest">Usage</TableHead>
                      <TableHead className="py-4 font-bold text-xs uppercase tracking-widest text-center">Status</TableHead>
                      <TableHead className="px-8 py-4 font-bold text-xs uppercase tracking-widest text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {filteredRequests.map((req) => (
                        <TableRow key={req.id} className="border-border hover:bg-muted/30 transition-colors group">
                          <TableCell className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-sm">
                                {req.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-foreground">{req.name}</p>
                                <p className="text-xs text-muted-foreground">{req.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-6 max-w-xs">
                            <div className="space-y-1">
                              <p className="text-sm font-medium line-clamp-2">{req.useCase}</p>
                              {req.notes && (
                                <p className="text-[10px] text-muted-foreground italic truncate">
                                  Note: {req.notes}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-6">
                            <div className="space-y-1">
                              <p className="text-sm font-bold">{req.expectedUsage}</p>
                              <p className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold">
                                Applied: {new Date(req.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="py-6 text-center">
                            <StatusBadge status={req.status} />
                          </TableCell>
                          <TableCell className="px-8 py-6 text-right">
                            {req.status === "PENDING" ? (
                              <div className="flex items-center justify-end gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="rounded-lg h-9 border-green-500/20 text-green-600 hover:bg-green-500 hover:text-white"
                                  onClick={() => setConfirmDialog({ isOpen: true, requestId: req.id, action: "approve" })}
                                  disabled={actionLoading === req.id}
                                >
                                  {actionLoading === req.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={16} />}
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="rounded-lg h-9 border-red-500/20 text-red-600 hover:bg-red-500 hover:text-white"
                                  onClick={() => setConfirmDialog({ isOpen: true, requestId: req.id, action: "reject" })}
                                  disabled={actionLoading === req.id}
                                >
                                  {actionLoading === req.id ? <Loader2 size={14} className="animate-spin" /> : <X size={16} />}
                                </Button>
                              </div>
                            ) : (
                              <div className="text-xs text-muted-foreground font-medium italic">
                                Reviewed {new Date(req.reviewedAt || "").toLocaleDateString()}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
                
                {filteredRequests.length === 0 && (
                  <div className="p-20 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <Info size={32} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-black tracking-tight mb-2">No Requests Found</h3>
                    <p className="text-muted-foreground font-medium max-w-xs mx-auto">
                      There are no unlimited access requests matching your current filter.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Custom Confirmation Dialog */}
      <AlertDialog 
        open={confirmDialog.isOpen} 
        onOpenChange={(open: boolean) => setConfirmDialog(prev => ({ ...prev, isOpen: open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.action === "approve" ? "Approve PRO Access" : "Reject PRO Access Request"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.action === "approve" 
                ? "This will grant unlimited downloads to the user and update their account tier to professional status." 
                : "The user will remain on the standard free plan with their current daily limits."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                handleAction();
              }}
              className={confirmDialog.action === "approve" 
                ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                : "bg-red-600 hover:bg-red-700 text-white"}
              disabled={!!actionLoading}
            >
              {actionLoading ? (
                <Loader2 size={16} className="animate-spin mr-2" />
              ) : null}
              {confirmDialog.action === "approve" ? "Approve Access" : "Reject Request"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatusBadge({ status }: { status: "PENDING" | "APPROVED" | "REJECTED" }) {
  switch (status) {
    case "PENDING":
      return (
        <Badge variant="outline" className="rounded-full px-3 py-1 border-amber-500/20 bg-amber-500/10 text-amber-600 font-black text-[10px] uppercase tracking-wider gap-1.5">
          <Clock size={12} /> Pending
        </Badge>
      );
    case "APPROVED":
      return (
        <Badge variant="outline" className="rounded-full px-3 py-1 border-emerald-500/20 bg-emerald-500/10 text-emerald-600 font-black text-[10px] uppercase tracking-wider gap-1.5">
          <CheckCircle2 size={12} /> Approved
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge variant="outline" className="rounded-full px-3 py-1 border-red-500/20 bg-red-500/10 text-red-600 font-black text-[10px] uppercase tracking-wider gap-1.5">
          <XCircle size={12} /> Rejected
        </Badge>
      );
    default:
      return null;
  }
}
