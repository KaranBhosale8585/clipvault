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
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
