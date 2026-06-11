"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 dark:bg-[#020617] transition-colors duration-300 px-4 py-12">
      <div className="w-full max-w-[440px]">
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[32px] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-all">
          <div className="p-10 sm:p-12 text-center">
            <div className="mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[22px] text-indigo-500 mb-8 shadow-inner">
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
                {step === "email" ? "Reset Access" : "Secure Reset"}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                {step === "email"
                  ? "Enter your email to receive a secure recovery code"
                  : "Enter the code and define your new password"}
              </p>
            </div>

            {step === "email" && (
              <div className="space-y-6 text-left">
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={sendingOtp}
                  className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl shadow-lg shadow-slate-900/10 dark:shadow-none hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 text-sm"
                >
                  {sendingOtp ? "Requesting..." : "Send Reset Code"}
                </button>
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
                      className="w-full h-14 text-center text-xl font-bold bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white"
                    />
                  ))}
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1" htmlFor="password">
                    New Secure Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl shadow-lg shadow-slate-900/10 dark:shadow-none hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 text-sm"
                >
                  {loading ? "Processing..." : "Update Password"}
                </button>

                <div className="mt-8">
                  {timer > 0 ? (
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Resend code in <span className="text-slate-900 dark:text-white">{timer}s</span>
                    </p>
                  ) : (
                    <button
                      onClick={handleSendOtp}
                      className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
                    >
                      Resend secure code
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="mt-12 pt-10 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Back to security?{" "}
                <Link
                  href="/login"
                  className="font-bold text-slate-900 dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400 transition"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
