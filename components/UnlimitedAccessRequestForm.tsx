"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Sparkles, Loader2, Send, 
  CheckCircle2, Clock,
  XCircle, ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface RequestData {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  useCase: string;
  expectedUsage: string;
  createdAt: string;
}

export default function UnlimitedAccessRequestForm() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [request, setRequest] = useState<RequestData | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    useCase: "",
    expectedUsage: "",
    notes: ""
  });

  const fetchRequestStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/unlimited-access/request");
      const data = await res.json();
      if (res.ok) {
        setRequest(data.data);
      }
    } catch {
      toast.error("Failed to load request status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRequestStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.useCase || !formData.expectedUsage) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/unlimited-access/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Request submitted successfully!");
        fetchRequestStatus();
      } else {
        toast.error(data.message || "Failed to submit request");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (request && request.status === "PENDING") {
    return (
      <StatusCard 
        icon={<Clock className="w-12 h-12 text-amber-500" />}
        title="Request Pending"
        description="Our team is currently reviewing your application for unlimited access."
        request={request}
      />
    );
  }

  if (request && request.status === "APPROVED") {
    return (
      <StatusCard 
        icon={<CheckCircle2 className="w-12 h-12 text-emerald-500" />}
        title="Access Granted"
        description="Your request for unlimited access has been approved! You can now enjoy unrestricted extractions."
        request={request}
      />
    );
  }

  if (request && request.status === "REJECTED") {
    return (
      <div className="space-y-6">
        <StatusCard 
          icon={<XCircle className="w-12 h-12 text-rose-500" />}
          title="Request Declined"
          description="Unfortunately, your request for unlimited access was not approved at this time."
          request={request}
        />
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setRequest(null)}
        >
          Submit New Request
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-border rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/5">
      <CardHeader className="bg-indigo-600 text-white p-8 md:p-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-xl">
            <Sparkles size={24} />
          </div>
          <CardTitle className="text-2xl md:text-3xl font-black tracking-tighter">Unlimited Access</CardTitle>
        </div>
        <CardDescription className="text-indigo-100 text-base md:text-lg font-medium leading-relaxed opacity-90">
          Apply for professional-grade access to the ClipVault engine. Perfect for creators and researchers.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 md:p-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest ml-1">Full Name</Label>
              <Input 
                id="name" 
                placeholder="Jane Doe" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-muted/50 border-transparent focus:bg-background transition-all" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest ml-1">Business Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="jane@company.com" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-muted/50 border-transparent focus:bg-background transition-all" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="useCase" className="text-xs font-black uppercase tracking-widest ml-1">Primary Use Case</Label>
            <Input 
              id="useCase" 
              placeholder="e.g., Social Media Management, Content Research" 
              required
              value={formData.useCase}
              onChange={(e) => setFormData({...formData, useCase: e.target.value})}
              className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-muted/50 border-transparent focus:bg-background transition-all" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedUsage" className="text-xs font-black uppercase tracking-widest ml-1">Expected Daily Usage</Label>
            <Input 
              id="expectedUsage" 
              placeholder="e.g., 50-100 reels per day" 
              required
              value={formData.expectedUsage}
              onChange={(e) => setFormData({...formData, expectedUsage: e.target.value})}
              className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-muted/50 border-transparent focus:bg-background transition-all" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-xs font-black uppercase tracking-widest ml-1">Additional Notes (Optional)</Label>
            <textarea 
              id="notes" 
              rows={4} 
              placeholder="Anything else we should know?" 
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full p-4 md:p-6 rounded-2xl md:rounded-[2rem] bg-muted/50 border-transparent focus:bg-background focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-sm font-medium resize-none"
            />
          </div>

          <Button 
            type="submit" 
            disabled={submitting}
            className="w-full h-14 md:h-16 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all gap-3"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" /> Submit Application
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function StatusCard({ icon, title, description, request }: { icon: React.ReactNode, title: string, description: string, request: RequestData }) {
  return (
    <Card className="border-border rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/5 p-8 md:p-12 text-center space-y-6">
      <div className="flex justify-center">
        <div className="p-4 bg-muted rounded-full">
          {icon}
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl md:text-4xl font-black tracking-tighter">{title}</h2>
        <p className="text-muted-foreground font-medium text-sm md:text-lg max-w-lg mx-auto leading-relaxed">
          {description}
        </p>
      </div>
      <div className="bg-muted/50 rounded-2xl p-6 text-left space-y-4 max-w-md mx-auto">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Use Case</p>
          <p className="text-sm font-bold text-foreground">{request.useCase}</p>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Expected Usage</p>
          <p className="text-sm font-bold text-foreground">{request.expectedUsage}</p>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Submitted On</p>
          <p className="text-sm font-bold text-foreground">{new Date(request.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <Link href="/" className="inline-block">
        <Button variant="ghost" className="gap-2 font-bold text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50">
          <ArrowLeft size={16} /> Back to Home
        </Button>
      </Link>
    </Card>
  );
}
