import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the ClipVault support team for technical inquiries, bug reports, and business questions.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | ClipVault",
    description: "Get in touch with the ClipVault support team for technical inquiries, bug reports, and business questions.",
    url: "/contact",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Us | ClipVault",
    description: "Get in touch with the ClipVault support team for technical inquiries, bug reports, and business questions.",
  },
  icons: {
    icon: "/icon.svg?v=2",
    shortcut: "/icon.svg?v=2",
    apple: "/icon.svg?v=2",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <ContactForm />
      </div>
    </div>
  );
}
