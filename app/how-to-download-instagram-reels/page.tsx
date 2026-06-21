import type { Metadata } from "next";
import HowToDownloadReelsClient from "./client";

export const metadata: Metadata = {
  title: "How to Download Instagram Reels: A Complete Guide",
  description: "Learn how to download Instagram Reels onto iPhone, Android, PC, or Mac. Get step-by-step instructions to save Instagram Reels for offline viewing using our free tools.",
  alternates: {
    canonical: "/how-to-download-instagram-reels",
  },
  openGraph: {
    title: "How to Download Instagram Reels: A Complete Guide | ClipVault",
    description: "Learn how to download Instagram Reels onto iPhone, Android, PC, or Mac. Get step-by-step instructions to save Instagram Reels for offline viewing using our free tools.",
    url: "/how-to-download-instagram-reels",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Download Instagram Reels: A Complete Guide | ClipVault",
    description: "Learn how to download Instagram Reels onto iPhone, Android, PC, or Mac. Get step-by-step instructions to save Instagram Reels for offline viewing using our free tools.",
  },
};

export default function HowToDownloadReelsPage() {
  return <HowToDownloadReelsClient />;
}
