"use client";

import { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function VerifyOTP() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [timer, setTimer] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async () => {
    try {
      setSendingOtp(true);

      const res = await fetch("/api/send-otp", { method: "POST" });
      const data = await res.json();

      if (!res.ok) return toast.error(data.message);

      toast.success("OTP sent 📩");
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

    try {
      setLoading(true);

      const res = await fetch("/api/verify-otp", {
        method: "POST",
        body: JSON.stringify({ userOtp }),
      });

      const data = await res.json();

      if (!res.ok) return toast.error(data.message);

      toast.success("Verified 🎉");
      router.push("/");
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
                Verify Identity
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                We've sent a 6-digit secure code to your email address
              </p>
            </div>

            <div className="flex justify-between gap-3 mb-10">
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

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl shadow-lg shadow-slate-900/10 dark:shadow-none hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 text-sm"
            >
              {loading ? "Verifying..." : "Confirm Code"}
            </button>

            <div className="mt-10">
              {timer > 0 ? (
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Resend available in <span className="text-slate-900 dark:text-white">{timer}s</span>
                </p>
              ) : (
                <button
                  onClick={handleSendOtp}
                  disabled={sendingOtp}
                  className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
                >
                  {sendingOtp ? "Requesting..." : "Resend secure code"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
