import type { Metadata } from "next";
import { Scale, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Read the ClipVault Terms & Conditions to understand permitted usage, download limitations, intellectual property waivers, and termination policies.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms & Conditions | ClipVault",
    description: "Read the ClipVault Terms & Conditions to understand permitted usage, download limitations, intellectual property waivers, and termination policies.",
    url: "/terms",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms & Conditions | ClipVault",
    description: "Read the ClipVault Terms & Conditions to understand permitted usage, download limitations, intellectual property waivers, and termination policies.",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6">Terms &amp; Conditions</h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Please read these terms carefully before using ClipVault. By accessing our services, you agree to comply with them.
          </p>
        </div>

        <Card className="p-6 md:p-10 border-indigo-500/20 bg-indigo-500/5 rounded-3xl md:rounded-[2.5rem] mb-12 relative overflow-hidden">
          <div className="relative z-10 flex items-start gap-4">
            <Scale className="w-10 h-10 text-indigo-500 shrink-0 mt-1" />
            <div>
              <h2 className="text-xl md:text-2xl font-black mb-3 text-indigo-500">Crucial Disclaimer</h2>
              <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
                Users are solely responsible for ensuring they have the legal right or permission to download any content using ClipVault. ClipVault does not host, store, own, or redistribute third-party content and acts only as a tool for processing user-provided URLs.
              </p>
            </div>
          </div>
        </Card>

        <div className="prose prose-indigo dark:prose-invert max-w-none space-y-10">
          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              By accessing or using the ClipVault application, website, or API services (collectively, the &quot;Service&quot;), you agree to be bound by these Terms &amp; Conditions. If you do not agree to all of these terms, you must not access or use our Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">2. Permitted Usage &amp; Platform Support</h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              ClipVault is designed strictly as a utility tool for content creators, researchers, and consumers to backup, archive, or analyze their digital assets.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground font-medium">
              <li><strong>Instagram Reels Only:</strong> The Service currently supports the extraction of Instagram Reels metadata and media streams only. You agree not to attempt to submit URLs from unsupported platforms.</li>
              <li><strong>Personal Use:</strong> Content downloaded using the Service is intended solely for personal, non-commercial, and archival purposes.</li>
              <li><strong>No Automated Scraping:</strong> You are prohibited from using scripts, bots, or automated extraction tools to query our APIs, except as officially permitted for authorized integrations.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">3. User Responsibilities &amp; IP Rights</h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              ClipVault respects intellectual property rights and expects its users to do the same. By using this Service, you warrant that:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground font-medium">
              <li>You own the copyright or have obtained explicit permission from the copyright owner of the content associated with the URL you provide.</li>
              <li>You will not use the Service to download copyrighted movies, music, or materials for unauthorized commercial distribution.</li>
              <li>You assume full liability for any intellectual property violations arising from the misuse of media files retrieved through the Service.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">4. Service Limitations &amp; Usage Restraints</h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              ClipVault is provided on a best-effort basis. We reserve the right to limit access to control server costs and ensure reliability:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground font-medium">
              <li><strong>Usage Caps:</strong> Unauthenticated guests are capped at a total of 3 downloads. Authenticated free tier users are capped at 10 downloads per day.</li>
              <li><strong>PRO Bypass:</strong> Registered users approved for PRO Access status are exempt from these daily limits, subject to compliance with fair-use policies.</li>
              <li><strong>Extraction Availability:</strong> Content availability depends on external networks. Private profiles, restricted accounts, or geographic blocks imposed by Instagram may make certain Reels unavailable.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0" />
              5. Account Termination Policy
            </h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              We reserve the right, without notice and at our sole discretion, to terminate or suspend your account, access to the Service, or revoke your PRO status if we detect activities including, but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground font-medium">
              <li>Attempting to bypass daily download limits, IP bans, or rate limits.</li>
              <li>Hacking, reverse-engineering, or deploying DDoS attacks against ClipVault infrastructure.</li>
              <li>Misrepresenting yourself during the PRO access request process.</li>
            </ul>
          </section>

          <section className="space-y-4 border-t border-border pt-10">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">6. Limitation of Liability</h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              ClipVault, its developers, and contributors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the services; (ii) any conduct or content of any third party on the services; or (iii) unauthorized access, use, or alteration of your content.
            </p>
          </section>

          <section className="space-y-4 border-t border-border pt-10">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">7. Changes to Terms &amp; Service</h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. Changes will be posted on this page with an updated modification date. Your continued use of the Service following any modifications constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="space-y-4 border-t border-border pt-10">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">8. Contact Us</h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              If you have any questions about these Terms, please contact support at:
            </p>
            <p className="text-indigo-500 font-bold text-lg">
              <a href="mailto:support@clipvault.com" className="hover:underline">support@clipvault.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
