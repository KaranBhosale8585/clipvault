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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300 px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden transition-all">
        <div className="p-8 sm:p-10 text-center">
          <div className="mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl text-black dark:text-white mb-6">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
              Verify OTP
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <div className="flex justify-between gap-2 mb-10">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                className="w-12 h-14 text-center text-xl font-bold bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-gray-900 dark:text-white"
              />
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 px-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="mt-8">
            {timer > 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Resend code in <span className="font-bold text-gray-900 dark:text-white">{timer}s</span>
              </p>
            ) : (
              <button
                onClick={handleSendOtp}
                disabled={sendingOtp}
                className="text-sm font-bold text-black dark:text-white hover:underline underline-offset-4"
              >
                {sendingOtp ? "Sending..." : "Resend code"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
