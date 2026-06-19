import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "ClipVault administrative control center.",
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
