import type { Metadata } from "next";
import UserDashboard from "@/components/UserDashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your ClipVault account and access saved media.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return <UserDashboard />;
}
