"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, History, LayoutDashboard, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
});

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  isProAccess: boolean;
}

export default function UserDashboard() {
  const { data: user, isLoading } = useSWR<UserData | null>("/api/get-me", fetcher);


  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background py-24">
        <div className="max-w-5xl mx-auto px-6 space-y-8 animate-pulse">
          <Skeleton className="h-16 w-64 bg-muted rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-40 bg-muted rounded-[2rem]" />
            <Skeleton className="h-40 bg-muted rounded-[2rem]" />
            <Skeleton className="h-40 bg-muted rounded-[2rem]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2">
              Hey, {user?.name.split(' ')[0]}!
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Welcome back to your ClipVault dashboard.
            </p>
          </div>
          <Link href="/">
            <Button size="lg" className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 gap-2">
              <Zap className="w-4 h-4" /> Start Extracting
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <DashboardCard 
            icon={<History className="w-6 h-6 text-indigo-500" />}
            title="Collection"
            value="View History"
            link="/history"
          />
          <DashboardCard 
            icon={<ShieldCheck className={`w-6 h-6 ${user?.isProAccess ? "text-emerald-500" : "text-muted-foreground"}`} />}
            title="Account"
            value={user?.isProAccess ? "Verified Pro" : "Free Tier"}
            link="/unlimited-access"
          />
          {user?.role === "admin" && (
            <DashboardCard 
              icon={<LayoutDashboard className="w-6 h-6 text-rose-500" />}
              title="Control"
              value="Admin Panel"
              link="/admin"
            />
          )}
        </div>

        <Card className="p-10 border-border rounded-[3rem] bg-card/50 backdrop-blur-sm border-dashed">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-3xl font-black text-white">
              {user?.name.charAt(0)}
            </div>
            <div>
              <p className="text-2xl font-black">{user?.name}</p>
              <p className="text-muted-foreground font-medium">{user?.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-500 px-2 py-1 rounded-md border border-indigo-500/20">
                  {user?.role}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-md border border-emerald-500/20">
                  Verified
                </span>
                {user?.isProAccess && (
                  <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 px-2 py-1 rounded-md border border-amber-500/20">
                    PRO ACCESS
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function DashboardCard({ icon, title, value, link }: { icon: React.ReactNode; title: string; value: string; link: string }) {
  return (
    <Link href={link}>
      <Card className="p-8 border-border rounded-[2.5rem] bg-card hover:shadow-xl hover:-translate-y-1 transition-all group">
        <div className="mb-6 p-3 bg-muted rounded-2xl w-fit group-hover:bg-indigo-500/5 transition-colors">
          {icon}
        </div>
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">{title}</p>
        <p className="text-xl font-bold text-foreground">{value}</p>
      </Card>
    </Link>
  );
}
