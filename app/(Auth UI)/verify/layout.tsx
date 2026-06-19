import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Account",
  description: "Verify your email with a secure code to complete registration on ClipVault.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
