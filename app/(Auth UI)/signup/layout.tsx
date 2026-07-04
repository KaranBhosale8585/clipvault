import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a free ClipVault account to sync download history and unlock 10 premium Reels downloads per day.",
  alternates: {
    canonical: "/signup",
  },
  openGraph: {
    title: "Sign Up | ClipVault",
    description: "Create a free ClipVault account to sync download history and unlock 10 premium Reels downloads per day.",
    url: "/signup",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sign Up | ClipVault",
    description: "Create a free ClipVault account to sync download history and unlock 10 premium Reels downloads per day.",
  },
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/favicon.svg?v=2",
    shortcut: "/favicon.svg?v=2",
    apple: "/favicon.svg?v=2",
  },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
