"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
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
          window.location.replace("/");
        }, 100);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 dark:bg-[#020617] transition-colors duration-300 px-4 py-12">
      <div className="w-full max-w-[440px]">
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[32px] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-all">
          <div className="p-10 sm:p-12">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
                Sign in to Vault
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Enter your credentials to access your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      setErrors({ ...errors, email: false });
                    }}
                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border ${
                      errors.email ? "border-red-500" : "border-slate-200 dark:border-slate-800"
                    } rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter ml-1">Email is required</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest" htmlFor="password">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[10px] font-bold text-slate-400 hover:text-indigo-500 uppercase tracking-widest transition"
                  >
                    Reset?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => {
                      setForm({ ...form, password: e.target.value });
                      setErrors({ ...errors, password: false });
                    }}
                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border ${
                      errors.password ? "border-red-500" : "border-slate-200 dark:border-slate-800"
                    } rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium`}
                  />
                </div>
                {errors.password && (
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter ml-1">Password is required</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl shadow-lg shadow-slate-900/10 dark:shadow-none hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 text-sm mt-2"
                disabled={loading}
              >
                {loading ? "Authenticating..." : "Sign in"}
              </button>
            </form>

            <div className="text-center mt-10">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                New to Vault?{" "}
                <Link
                  href="/signup"
                  className="font-bold text-slate-900 dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400 transition"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
