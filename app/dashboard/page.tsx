import type { Metadata } from "next";
import UserDashboard from "@/components/UserDashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your ClipVault account and access saved media.",
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

export default function DashboardPage() {
  return <UserDashboard />;
}
