import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Vault • Fast & Secure Instagram Reel Downloader",
    template: "%s | Vault Downloader",
  },
  description: "Download high-quality Instagram Reels instantly. Vault is a secure, fast, and completely free tool with no hidden limits. Try it now without logging in.",
  keywords: ["Instagram Downloader", "Reel Downloader", "Download Instagram Video", "Save Reels", "Vault Downloader"],
  authors: [{ name: "Vault Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vault-downloader.com",
    title: "Vault • Fast & Secure Instagram Reel Downloader",
    description: "Download high-quality Instagram Reels instantly. Vault is a secure, fast, and completely free tool.",
    siteName: "Vault Downloader",
    images: [
      {
        url: "https://vault-downloader.com/og-image.jpg", // Placeholder for actual OG image
        width: 1200,
        height: 630,
        alt: "Vault Downloader Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vault • Fast & Secure Instagram Reel Downloader",
    description: "Download high-quality Instagram Reels instantly. Secure and fast.",
    images: ["https://vault-downloader.com/twitter-image.jpg"],
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
        </ThemeProvider>
      </body>
    </html>
  );
}
