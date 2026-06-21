"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function ThirdPartyScripts() {
  const [loadScripts, setLoadScripts] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      setLoadScripts(true);
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };

    window.addEventListener("mousemove", handleInteraction, { passive: true });
    window.addEventListener("scroll", handleInteraction, { passive: true });
    window.addEventListener("touchstart", handleInteraction, { passive: true });
    window.addEventListener("keydown", handleInteraction, { passive: true });

    return cleanup;
  }, []);

  if (!loadScripts) return null;

  return (
    <>
      {/* Google AdSense */}
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4526812202141186"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-WDK075JXR8"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-WDK075JXR8');
        `}
      </Script>
    </>
  );
}
