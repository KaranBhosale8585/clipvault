"use client";

import { useState } from "react";
import { Mail, Globe, MessageSquare, Loader2, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      toast.success("Message sent successfully!");
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-2">
        <Card className="max-w-md w-full p-8 md:p-12 text-center space-y-6 border-border rounded-3xl md:rounded-[3rem] bg-card shadow-2xl">
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight">Message Sent!</h2>
            <p className="text-muted-foreground font-medium text-sm md:text-base">
              Thank you for reaching out. Our support team will review your inquiry and respond as soon as possible.
            </p>
          </div>
          <Button 
            onClick={() => setSubmitted(false)}
            className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold"
          >
            Send Another Message
          </Button>
        </Card>
      </div>
    );
  }

  return (
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
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="name" className="text-[10px] md:text-xs font-black uppercase tracking-widest ml-1">Name</Label>
              <Input 
                id="name" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe" 
                className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-muted/50 border-transparent focus:bg-background transition-all text-sm" 
              />
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="email" className="text-[10px] md:text-xs font-black uppercase tracking-widest ml-1">Email</Label>
              <Input 
                id="email" 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com" 
                className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-muted/50 border-transparent focus:bg-background transition-all text-sm" 
              />
            </div>
          </div>
          <div className="space-y-1.5 md:space-y-2">
            <Label htmlFor="subject" className="text-[10px] md:text-xs font-black uppercase tracking-widest ml-1">Subject</Label>
            <Input 
              id="subject" 
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="How can we help?" 
              className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-muted/50 border-transparent focus:bg-background transition-all text-sm" 
            />
          </div>
          <div className="space-y-1.5 md:space-y-2">
            <Label htmlFor="message" className="text-[10px] md:text-xs font-black uppercase tracking-widest ml-1">Message</Label>
            <textarea 
              id="message" 
              rows={5} 
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us more..." 
              className="w-full p-4 md:p-6 rounded-2xl md:rounded-[2rem] bg-muted/50 border-transparent focus:bg-background focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-sm font-medium resize-none"
            />
          </div>
          <Button 
            disabled={loading}
            className="w-full h-14 md:h-16 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black text-sm md:text-lg shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              "Send Message"
            )}
          </Button>
        </form>
      </Card>
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
