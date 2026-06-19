import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Account",
  description: "Verify your email with a secure code to complete registration on ClipVault.",
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

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
