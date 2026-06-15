import type { Metadata } from "next";
import { Mail, Globe, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Contact Us | ClipVault",
  description: "Get in touch with the ClipVault team for support or feedback.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter mb-6 md:mb-8 text-center lg:text-left">Let&apos;s Talk.</h1>
            <p className="text-lg md:text-xl text-muted-foreground font-medium mb-10 md:mb-12 max-w-lg mx-auto lg:mx-0 leading-relaxed text-center lg:text-left">
              Have a question about our extraction engine? Found a bug? Or just want to say hi? We&apos;d love to hear from you.
            </p>

            <div className="space-y-4 md:space-y-6 max-w-md mx-auto lg:mx-0">
              <ContactLink icon={<Mail />} label="Email Us" value="support@clipvault.com" />
              <ContactLink icon={<Globe />} label="Twitter" value="@clipvault_app" />
              <ContactLink icon={<MessageSquare />} label="GitHub" value="github.com/clipvault" />
            </div>
          </div>

          <Card className="p-6 md:p-12 border-border rounded-3xl md:rounded-[3.5rem] bg-card shadow-2xl shadow-indigo-500/5 mt-8 lg:mt-0">
            <form className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1.5 md:space-y-2">
                  <Label htmlFor="name" className="text-[10px] md:text-xs font-black uppercase tracking-widest ml-1">Name</Label>
                  <Input id="name" placeholder="John Doe" className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-muted/50 border-transparent focus:bg-background transition-all text-sm" />
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <Label htmlFor="email" className="text-[10px] md:text-xs font-black uppercase tracking-widest ml-1">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-muted/50 border-transparent focus:bg-background transition-all text-sm" />
                </div>
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <Label htmlFor="message" className="text-[10px] md:text-xs font-black uppercase tracking-widest ml-1">Message</Label>
                <textarea 
                  id="message" 
                  rows={5} 
                  placeholder="How can we help?" 
                  className="w-full p-4 md:p-6 rounded-2xl md:rounded-[2rem] bg-muted/50 border-transparent focus:bg-background focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-sm font-medium resize-none"
                />
              </div>
              <Button className="w-full h-14 md:h-16 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black text-sm md:text-lg shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all">
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ContactLink({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 md:gap-6 group">
      <div className="w-12 h-12 md:w-14 md:h-14 bg-muted rounded-xl md:rounded-2xl flex items-center justify-center text-muted-foreground group-hover:bg-indigo-500/10 group-hover:text-indigo-500 transition-all">
        {icon}
      </div>
      <div>
        <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground mb-0.5 md:mb-1">{label}</p>
        <p className="text-base md:text-lg font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}
