import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "ClipVault administrative control center.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
