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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300 px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden transition-all">
        <div className="p-8 sm:p-10 text-center">
          <div className="mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl text-black dark:text-white mb-6">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
              {step === "email" ? "Reset Password" : "Confirm Reset"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {step === "email"
                ? "Enter your email to receive a recovery code"
                : "Enter the code and your new password"}
            </p>
          </div>

          {step === "email" && (
            <div className="space-y-6 text-left">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={sendingOtp}
                className="w-full py-3.5 px-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {sendingOtp ? "Sending code..." : "Send Reset Code"}
              </button>
            </div>
          )}

          {step === "verify" && (
            <div className="space-y-8">
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    value={digit}
                    maxLength={1}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleBackspace(e, index)}
                    className="w-10 h-12 text-center text-xl font-bold bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-gray-900 dark:text-white"
                  />
                ))}
              </div>

              <div className="space-y-2 text-left">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1" htmlFor="password">
                  New Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3.5 px-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? "Updating..." : "Reset Password"}
              </button>

              <div className="mt-6">
                {timer > 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Resend code in <span className="font-bold text-gray-900 dark:text-white">{timer}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleSendOtp}
                    className="text-sm font-bold text-black dark:text-white hover:underline underline-offset-4"
                  >
                    Resend code
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Remembered your password?{" "}
              <Link
                href="/login"
                className="font-bold text-black dark:text-white hover:underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
