import type { Metadata } from "next";
import UnlimitedAccessRequestForm from "@/components/UnlimitedAccessRequestForm";

export const metadata: Metadata = {
  title: "Request Unlimited Access | ClipVault",
  description: "Apply for unlimited, professional-grade access to the ClipVault extraction engine.",
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

export default function UnlimitedAccessPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <UnlimitedAccessRequestForm />
      </div>
    </div>
  );
}
