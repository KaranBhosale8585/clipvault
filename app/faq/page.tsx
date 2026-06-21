import type { Metadata } from "next";
import FaqPageClient from "./client";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | ClipVault",
  description: "Find answers to common questions about ClipVault: Is it safe? Do I need an account? How to download Instagram Reels on mobile? Get all the details here.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions (FAQ) | ClipVault",
    description: "Find answers to common questions about ClipVault: Is it safe? Do I need an account? How to download Instagram Reels on mobile? Get all the details here.",
    url: "/faq",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions (FAQ) | ClipVault",
    description: "Find answers to common questions about ClipVault: Is it safe? Do I need an account? How to download Instagram Reels on mobile? Get all the details here.",
  },
};

export interface FaqItem {
  q: string;
  a: string;
}

export const faqs: FaqItem[] = [
  {
    q: "How do I download Instagram Reels using ClipVault?",
    a: "Copy the link of the Instagram Reel you want to save, navigate to ClipVault, paste the link into the URL input field at the top of the page, and click the analysis button. The downloader will extract the video and generate a secure download link."
  },
  {
    q: "Is ClipVault safe and secure to use?",
    a: "Yes. ClipVault is fully secure. We use SSL encryption to secure our web pages, we never ask for your Instagram password, and we route downloads through media proxies to safeguard your personal IP address from third-party tracking."
  },
  {
    q: "Do I need to create an account or sign up to download reels?",
    a: "No, you do not need an account. Guests receive 3 free downloads to try out our downloader online. If you need more daily extractions or want to save your history, you can register for a free account."
  },
  {
    q: "What types of Instagram content are supported by ClipVault?",
    a: "Currently, ClipVault specializes in public Instagram Reels. It extracts Reel videos in high definition (1080p). Private accounts, stories, and multiple image carousel posts are not supported."
  },
  {
    q: "Can I use ClipVault on mobile devices (iPhone and Android)?",
    a: "Yes. ClipVault is fully optimized for mobile devices. It works directly in mobile browsers like Safari, Chrome, and Samsung Internet. No installation of external apps or extensions is required."
  },
  {
    q: "How does ClipVault protect my personal privacy?",
    a: "We practice privacy by design. We do not store or host downloaded videos on our servers. Optional download logs for registered users are encrypted, visible only to the owner, and permanently deleted after 30 days."
  },
  {
    q: "Are there any download limits on ClipVault?",
    a: "Guests are limited to 3 trial downloads. Free registered accounts get 10 downloads per day, resetting at midnight UTC. Power users or content creators can request PRO unlimited access."
  },
  {
    q: "Is it legal to download Instagram Reels using ClipVault?",
    a: "Downloading content for personal offline viewing or archiving is generally fine, but you must respect copyright laws. Users are solely responsible for obtaining permission from content owners before reusing or republishing media."
  },
  {
    q: "Why does the extraction engine show an error for some links?",
    a: "An error can happen if the link is incorrect, the Reel is from a private Instagram account, the video was deleted by the creator, or Instagram servers are throttling requests. Double-check your URL and try again."
  },
  {
    q: "Does ClipVault add watermarks or logos to the downloaded videos?",
    a: "No. ClipVault extracts the clean source video stream without adding any watermarks, text, or logos. The exported files are original high-quality MP4 files."
  }
];

export default function FAQPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FaqPageClient faqs={faqs} />
    </>
  );
}
