import type { Metadata } from "next";
import DownloadHistory from "@/components/DownloadHistory";

export const metadata: Metadata = {
  title: "Download History | ClipVault",
  description: "View and manage your ClipVault extraction history.",
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

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Your Collection</h1>
          <p className="text-lg text-muted-foreground font-medium">
            Manage and re-download your previous extractions.
          </p>
        </div>
        
        <DownloadHistory />
      </div>
    </div>
  );
}
