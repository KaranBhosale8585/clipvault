import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Request a secure code to reset your ClipVault account password.",
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
