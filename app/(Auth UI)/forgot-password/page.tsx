"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");

  const [step, setStep] = useState<"email" | "verify">("email");

  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async () => {
    if (!email) return toast.error("Enter email");

    try {
      setSendingOtp(true);

      const res = await fetch("/api/send-frgt-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) return toast.error(data.message);

      toast.success("OTP sent 📩");
      setStep("verify");
      setTimer(60);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async () => {
    const userOtp = otp.join("");

    if (userOtp.length !== 6) {
      return toast.error("Enter complete OTP");
    }

    if (!newPassword) {
      return toast.error("Enter new password");
    }

    try {
      setLoading(true);

      const res = await fetch("/api/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email,
          userOtp,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) return toast.error(data.message);

      toast.success("Password updated 🎉");
      router.push("/");
      setStep("email");
      setOtp(Array(6).fill(""));
      setNewPassword("");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background transition-colors duration-300 px-4 py-12">
      <div className="w-full max-w-[440px]">
        <Card className="rounded-[32px] shadow-2xl border-border bg-card overflow-hidden transition-all shadow-black/5 dark:shadow-none">
          <CardHeader className="p-10 sm:p-12 text-center pb-0">
            <div className="mb-10 flex flex-col items-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-background dark:bg-slate-800 border border-border dark:border-slate-700 rounded-[22px] text-indigo-500 mb-8 shadow-inner">
                <ShieldCheck size={32} />
              </div>
              <CardTitle className="text-3xl font-extrabold text-foreground mb-3 tracking-tight">
                {step === "email" ? "Reset Access" : "Secure Reset"}
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium">
                {step === "email"
                  ? "Enter your email to receive a secure recovery code"
                  : "Enter the code and define your new password"}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-10 sm:p-12 pt-0 text-center">
            {step === "email" && (
              <div className="space-y-6 text-left">
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 rounded-2xl border-border focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSendOtp}
                  disabled={sendingOtp}
                  className="w-full h-14 bg-foreground text-background font-bold rounded-2xl shadow-lg shadow-slate-900/10 dark:shadow-none hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 text-sm"
                >
                  {sendingOtp ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Requesting...
                    </>
                  ) : (
                    "Send Reset Code"
                  )}
                </Button>
              </div>
            )}

            {step === "verify" && (
              <div className="space-y-8">
                <div className="flex justify-between gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      value={digit}
                      maxLength={1}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleBackspace(e, index)}
                      className="w-full h-14 text-center text-xl font-bold bg-background dark:bg-slate-800/50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-foreground"
                    />
                  ))}
                </div>

                <div className="space-y-2 text-left">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1" htmlFor="password">
                    New Secure Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-indigo-500 transition-colors z-10" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-11 h-12 rounded-2xl border-border focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full h-14 bg-foreground text-background font-bold rounded-2xl shadow-lg shadow-slate-900/10 dark:shadow-none hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>

                <div className="mt-8">
                  {timer > 0 ? (
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      Resend code in <span className="text-foreground">{timer}s</span>
                    </p>
                  ) : (
                    <Button
                      variant="link"
                      onClick={handleSendOtp}
                      className="h-auto p-0 text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
                    >
                      Resend secure code
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="mt-12 pt-10 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground">
                Back to security?{" "}
                <Link
                  href="/login"
                  className="font-bold text-foreground hover:text-indigo-500 dark:hover:text-indigo-400 transition"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
