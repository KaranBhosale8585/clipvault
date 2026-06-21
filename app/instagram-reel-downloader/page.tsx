import type { Metadata } from "next";
import InstagramReelDownloaderClient from "./client";

export const metadata: Metadata = {
  title: "Instagram Reel Downloader | Download Instagram Reels Free",
  description: "Download Instagram Reels online for free in high quality 1080p. The fastest Instagram Reel downloader online. Save Reels directly to iPhone, Android or PC.",
  alternates: {
    canonical: "/instagram-reel-downloader",
  },
  openGraph: {
    title: "Instagram Reel Downloader | Download Instagram Reels Free | ClipVault",
    description: "Download Instagram Reels online for free in high quality 1080p. The fastest Instagram Reel downloader online. Save Reels directly to iPhone, Android or PC.",
    url: "/instagram-reel-downloader",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Reel Downloader | Download Instagram Reels Free | ClipVault",
    description: "Download Instagram Reels online for free in high quality 1080p. The fastest Instagram Reel downloader online. Save Reels directly to iPhone, Android or PC.",
  },
};

export default function InstagramReelDownloaderPage() {
  return <InstagramReelDownloaderClient />;
}
