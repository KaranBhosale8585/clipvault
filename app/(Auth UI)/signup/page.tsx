"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newErrors = {
      name: !form.name.trim(),
      email: !form.email.trim(),
      password: !form.password.trim(),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || data.error);
        return;
      }

      if (res.ok) {
        toast.success(data.message || "Registration successful!");
        router.push(`/login${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`);
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
            Join ClipVault
          </CardTitle>

          <CardDescription className="text-muted-foreground font-medium">
            Join ClipVault to save your digital presence
          </CardDescription>
        </CardHeader>
        <CardContent className="p-10 sm:p-12 pt-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1" htmlFor="name">
                Full Name
              </Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-indigo-500 transition-colors z-10" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    setErrors({ ...errors, name: false });
                  }}
                  className={`pl-11 h-12 rounded-2xl ${
                    errors.name ? "border-red-500" : "border-border"
                  } focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all font-medium`}
                />
              </div>
              {errors.name && (
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter ml-1">Name is required</p>
              )}
            </div>

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
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1" htmlFor="password">
                Password
              </Label>
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
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="text-center mt-10">
            <p className="text-xs font-medium text-muted-foreground">
              Already have an account?{" "}
              <Link
                href={`/login${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
                className="font-bold text-foreground hover:text-indigo-500 dark:hover:text-indigo-400 transition"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Register() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background transition-colors duration-300 px-4 py-12">
      <Suspense fallback={
        <div className="w-full max-w-[440px] animate-pulse">
          <Card className="h-[600px] rounded-[32px] bg-muted" />
        </div>
      }>
        <SignupForm />
      </Suspense>
    </div>
  );
}
