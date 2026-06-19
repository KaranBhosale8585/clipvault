import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "ClipVault administrative control center.",
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/favicon.svg?v=2",
    shortcut: "/favicon.svg?v=2",
    apple: "/favicon.svg?v=2",
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
