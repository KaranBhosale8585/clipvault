"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      email: !form.email.trim(),
      password: !form.password.trim(),
    };
    setErrors(newErrors);

    if (newErrors.email || newErrors.password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || data.error);
        return;
      }

      if (res.ok) {
        setForm({ email: "", password: "" });
        toast.success(data.message || "Login successful!");
        setTimeout(() => {
          window.location.replace(callbackUrl);
        }, 100);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px]">
      <Card className="rounded-[32px] shadow-2xl border-border bg-card overflow-hidden transition-all shadow-black/5 dark:shadow-none">
        <CardHeader className="p-10 sm:p-12 text-center pb-0">
          <CardTitle className="text-3xl font-extrabold text-foreground mb-3 tracking-tight">
            Sign in to ClipVault
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="p-10 sm:p-12 pt-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1" htmlFor="email">
                Email Address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-indigo-500 transition-colors z-10" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    setErrors({ ...errors, email: false });
                  }}
                  className={`pl-11 h-12 rounded-2xl ${
                    errors.email ? "border-red-500" : "border-border"
                  } focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all font-medium`}
                />
              </div>
              {errors.email && (
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter ml-1">Email is required</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest" htmlFor="password">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-[10px] font-bold text-muted-foreground hover:text-indigo-500 uppercase tracking-widest transition"
                >
                  Reset?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-indigo-500 transition-colors z-10" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    setErrors({ ...errors, password: false });
                  }}
                  className={`pl-11 h-12 rounded-2xl ${
                    errors.password ? "border-red-500" : "border-border"
                  } focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all font-medium`}
                />
              </div>
              {errors.password && (
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter ml-1">Password is required</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-foreground text-background font-bold rounded-2xl shadow-lg shadow-slate-900/10 dark:shadow-none hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 text-sm mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="text-center mt-10">
            <p className="text-xs font-medium text-muted-foreground">
              New to ClipVault?{" "}
              <Link
                href={`/signup${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
                className="font-bold text-foreground hover:text-indigo-500 dark:hover:text-indigo-400 transition"
              >
                Create account
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Login() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background transition-colors duration-300 px-4 py-12">
      <Suspense fallback={
        <div className="w-full max-w-[440px] animate-pulse">
          <Card className="h-[500px] rounded-[32px] bg-muted" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
