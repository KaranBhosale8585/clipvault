import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThirdPartyScripts from "@/components/ThirdPartyScripts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://clipvault.online";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Free Instagram Reel Downloader Online | ClipVault",
    template: "%s | ClipVault",
  },
  description: "Download Instagram Reels, videos and public content online with ClipVault. Fast, secure and easy to use. No login required.",
  keywords: ["Instagram Downloader", "Reel Downloader", "Download Instagram Video", "Save Reels", "ClipVault", "instagram reel downloader", "instagram video downloader", "download instagram reels", "reel downloader online", "save instagram reels"],
  authors: [{ name: "ClipVault Team" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    title: "Free Instagram Reel Downloader Online | ClipVault",
    description: "Download Instagram Reels, videos and public content online with ClipVault. Fast, secure and easy to use. No login required.",
    siteName: "ClipVault",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ClipVault Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Instagram Reel Downloader Online | ClipVault",
    description: "Download Instagram Reels, videos and public content online with ClipVault. Fast, secure and easy to use. No login required.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg?v=2",
    shortcut: "/favicon.svg?v=2",
    apple: "/favicon.svg?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://scontent.cdninstagram.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://scontent.cdninstagram.com" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-indigo-500/30 transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={["light", "dark", "pitch-dark"]}
        >
          <main className="flex-1 flex flex-col">
            <Header />
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </main>
          <Toaster 
            position="bottom-right" 
            richColors 
            closeButton 
            theme="system"
          />
          <ThirdPartyScripts />
        </ThemeProvider>
      </body>
    </html>
  );
}
