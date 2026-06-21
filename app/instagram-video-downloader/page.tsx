import type { Metadata } from "next";
import InstagramVideoDownloaderClient from "./client";

export const metadata: Metadata = {
  title: "Instagram Video Downloader | Save Instagram Videos Free",
  description: "Download Instagram videos and Reels instantly. Our free Instagram video downloader extracts HD video files in MP4 format. Safe, easy to use, and no login required.",
  alternates: {
    canonical: "/instagram-video-downloader",
  },
  openGraph: {
    title: "Instagram Video Downloader | Save Instagram Videos Free | ClipVault",
    description: "Download Instagram videos and Reels instantly. Our free Instagram video downloader extracts HD video files in MP4 format. Safe, easy to use, and no login required.",
    url: "/instagram-video-downloader",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Video Downloader | Save Instagram Videos Free | ClipVault",
    description: "Download Instagram videos and Reels instantly. Our free Instagram video downloader extracts HD video files in MP4 format. Safe, easy to use, and no login required.",
  },
};

export default function InstagramVideoDownloaderPage() {
  return <InstagramVideoDownloaderClient />;
}
