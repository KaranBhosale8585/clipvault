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
  title: "Vault • Secure Authentication",
  description: "A professional-grade authentication system with a minimalist aesthetic.",
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
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-50 selection:bg-indigo-100 dark:selection:bg-indigo-900/30 transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
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
