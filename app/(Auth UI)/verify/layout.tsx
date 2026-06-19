import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Account",
  description: "Verify your email with a secure code to complete registration on ClipVault.",
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/icon.svg?v=2",
    shortcut: "/icon.svg?v=2",
    apple: "/icon.svg?v=2",
  },
};

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
