import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your ClipVault account to manage your collection history and request unlimited PRO access.",
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    title: "Login | ClipVault",
    description: "Sign in to your ClipVault account to manage your collection history and request unlimited PRO access.",
    url: "/login",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Login | ClipVault",
    description: "Sign in to your ClipVault account to manage your collection history and request unlimited PRO access.",
  },
  icons: {
    icon: "/favicon.svg?v=2",
    shortcut: "/favicon.svg?v=2",
    apple: "/favicon.svg?v=2",
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
