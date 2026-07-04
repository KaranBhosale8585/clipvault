import type { Metadata } from "next";
import { Shield, Lock, Eye, Trash2, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how ClipVault handles account data, session cookies, visitor tracking, rate limits, and 30-day retention policies.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | ClipVault",
    description: "Learn how ClipVault handles account data, session cookies, visitor tracking, rate limits, and 30-day retention policies.",
    url: "/privacy",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | ClipVault",
    description: "Learn how ClipVault handles account data, session cookies, visitor tracking, rate limits, and 30-day retention policies.",
  },
  icons: {
    icon: "/favicon.svg?v=2",
    shortcut: "/favicon.svg?v=2",
    apple: "/favicon.svg?v=2",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6">Privacy Policy</h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            ClipVault is committed to transparency. Here is exactly how we handle your data, keep your information secure, and protect your privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16">
          <Card className="p-6 md:p-8 border-border rounded-2xl md:rounded-[2rem] bg-card">
            <Lock className="w-10 h-10 text-indigo-500 mb-6" />
            <h2 className="text-xl md:text-2xl font-black mb-4">Encryption & Security</h2>
            <p className="text-muted-foreground font-medium text-sm md:text-base leading-relaxed">
              We encrypt passwords using secure hashing algorithms and protect session tokens using secure, HTTP-only JWT cookies.
            </p>
          </Card>
          <Card className="p-6 md:p-8 border-border rounded-2xl md:rounded-[2rem] bg-card">
            <Trash2 className="w-10 h-10 text-rose-500 mb-6" />
            <h2 className="text-xl md:text-2xl font-black mb-4">30-Day Auto-Cleanup</h2>
            <p className="text-muted-foreground font-medium text-sm md:text-base leading-relaxed">
              System logs and download history data are automatically purged from our servers after 30 days to minimize data footprint.
            </p>
          </Card>
        </div>

        <div className="prose prose-indigo dark:prose-invert max-w-none space-y-10">
          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
              <Shield className="w-6 h-6 text-indigo-500 shrink-0" />
              1. Information We Collect
            </h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              We collect information directly from you when you register an account or interact with our extraction tools:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground font-medium">
              <li><strong>Account Registration:</strong> When you create an account, we collect your name, email address, and a secure hash of your password. This information is required for authentication and account management.</li>
              <li><strong>Authentication Data:</strong> We use JSON Web Token (JWT) cookies stored in your browser to maintain your session. These cookies are marked HTTP-only and secure.</li>
              <li><strong>Download History:</strong> Registered users have their download logs (Instagram Reel URL, video title, thumbnail path, video source link, and status) saved in our database to populate the &quot;History&quot; tab.</li>
              <li><strong>Anonymous Usage Data:</strong> For visitors who do not log in, we track the count of free downloads (up to 3 total) using a hybrid approach combining the client&apos;s IP address and a signed, secure <code className="text-indigo-500 font-mono">visitor_id</code> cookie.</li>
            </ul>
            <p className="text-muted-foreground font-semibold leading-relaxed border-l-2 border-amber-500 pl-4 py-1 my-4 bg-amber-500/5 text-amber-600 dark:text-amber-400 text-xs md:text-sm">
              <strong>Important Security & Privacy Notice:</strong> ClipVault does NOT collect, store, process, transmit, or accept Instagram session cookies, account credentials, or browser session files. We process publicly available Instagram content only. Under no circumstances should users attempt to supply account credentials or session cookies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
              <Eye className="w-6 h-6 text-indigo-500 shrink-0" />
              2. Cookies &amp; Visitor Tracking
            </h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              We employ cookie tracking for essential application functionality only. We do not use third-party advertiser cookies, tracking pixels, or invasive behavioral profiling tools.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground font-medium">
              <li><strong>Session Cookies:</strong> Used to securely maintain your logged-in state.</li>
              <li><strong>Visitor Limit Cookies:</strong> A signed, secure cookie containing an anonymous visitor identifier is used solely to enforce the 3-download free trial limit for unauthenticated guests.</li>
              <li><strong>Analytics:</strong> We do not run external tracking scripts. We analyze server-side application logs in aggregate to monitor error rates, performance, and server load.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-indigo-500 shrink-0" />
              3. IP Address Handling &amp; Rate Limiting
            </h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              To defend our infrastructure against automated scrapers, denial-of-service attempts, and abuse, we implement a multi-layered security checking system:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground font-medium">
              <li><strong>Global IP Rate Limiting:</strong> All extraction and API endpoints are rate-limited to 100 requests per 15 minutes per IP address.</li>
              <li><strong>Burst Rate Limiting:</strong> Authenticated users are subject to limit checks to manage backend workload concurrency.</li>
              <li><strong>IP Logging:</strong> We record the IP address of each download request to enforce free trial constraints (anonymous limit of 3 downloads) and for security auditing.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
              <Trash2 className="w-6 h-6 text-indigo-500 shrink-0" />
              4. User Rights &amp; Data Retention
            </h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              You retain full ownership and control of your information. Your rights include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground font-medium">
              <li><strong>Clear Download History:</strong> Authenticated users can clear their download history records at any time using the &quot;Delete&quot; or &quot;Clear History&quot; button on the History panel. This permanently deletes the logs from our active database.</li>
              <li><strong>Account Deletion:</strong> You have the right to request full account deletion. Upon verification, your profile and history will be permanently deleted from our servers.</li>
              <li><strong>Automated Data Expiry:</strong> To protect your privacy, all extraction logs and download history logs older than 30 days are automatically and permanently deleted from our database.</li>
            </ul>
          </section>

          <section className="space-y-4 border-t border-border pt-10">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">5. Security Practices</h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              ClipVault runs on a security-hardened environment. We use media proxying to fetch video thumbnails and download streams, which acts as a shield between you and third-party content distribution networks. All communication is encrypted over HTTPS.
            </p>
          </section>

          <section className="space-y-4 border-t border-border pt-10">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">6. Contact Information</h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              For any questions, privacy inquiries, or data deletion requests, please contact us at:
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
