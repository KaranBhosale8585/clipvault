/**
 * ClipVault Companion Extension - Background Service Worker (Hardened Production)
 * Handles cross-origin requests to Instagram API and local downloads.
 * Uses externally_connectable for secure client-to-extension messaging.
 */

// Helper to extract the shortcode from a standard Instagram Reel/Post URL
function extractShortcode(url) {
  const match = url.match(/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
}

// Strategy A: Query the JSON API endpoint using standard browser cookies
async function extractViaJsonApi(shortcode) {
  const url = `https://www.instagram.com/p/${shortcode}/?__a=1&__d=dis`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "*/*",
      "X-Requested-With": "XMLHttpRequest"
    }
  });

  if (!response.ok) {
    throw new Error(`JSON API responded with HTTP status ${response.status}`);
  }

  const json = await response.json();
  if (!json || !json.items || json.items.length === 0) {
    throw new Error("Invalid response or post is private");
  }

  const item = json.items[0];
  const videoUrl = item.video_versions && item.video_versions.length > 0
    ? item.video_versions[0].url
    : null;
  const thumbnailUrl = item.image_versions2 && item.image_versions2.candidates && item.image_versions2.candidates.length > 0
    ? item.image_versions2.candidates[0].url
    : null;
  const title = item.caption ? item.caption.text : (item.title || "Instagram Reel");

  if (!videoUrl) {
    throw new Error("Video URL not found in JSON response");
  }

  return {
    id: shortcode,
    reelUrl: `https://www.instagram.com/reel/${shortcode}/`,
    videoUrl,
    thumbnailUrl,
    title
  };
}

// Strategy B: Fetch the Embed page and parse metadata from embedded JS objects
async function extractViaEmbedPage(shortcode) {
  const url = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Embed API responded with HTTP status ${response.status}`);
  }

  const html = await response.text();

  let videoUrl = null;
  let thumbnailUrl = null;
  let title = "Instagram Reel";

  const videoMatch = html.match(/"video_url"\s*:\s*"([^"]+)"/);
  if (videoMatch) {
    videoUrl = JSON.parse(`"${videoMatch[1]}"`);
  }

  const thumbMatch = html.match(/"display_url"\s*:\s*"([^"]+)"/);
  if (thumbMatch) {
    thumbnailUrl = JSON.parse(`"${thumbMatch[1]}"`);
  }

  const titleMatch = html.match(/"caption"\s*:\s*"([^"]+)"/);
  if (titleMatch) {
    title = JSON.parse(`"${titleMatch[1]}"`);
  }

  if (!videoUrl) {
    const backupVideoMatch = html.match(/<video[^>]*src="([^"]+)"/);
    if (backupVideoMatch) {
      videoUrl = backupVideoMatch[1].replace(/&amp;/g, "&");
    }
  }

  if (!videoUrl) {
    throw new Error("Could not extract video source from embed page HTML");
  }

  return {
    id: shortcode,
    reelUrl: `https://www.instagram.com/reel/${shortcode}/`,
    videoUrl,
    thumbnailUrl: thumbnailUrl || `https://www.instagram.com/p/${shortcode}/media/?size=l`,
    title: title || "Instagram Reel"
  };
}

// Strategy C: Scrape the public layout HTML and extract OpenGraph tags
async function extractViaOpenGraph(shortcode) {
  const url = `https://www.instagram.com/reel/${shortcode}/`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Public page responded with HTTP status ${response.status}`);
  }

  const html = await response.text();

  const ogVideoMatch = html.match(/<meta[^>]*property="og:video"[^>]*content="([^"]+)"/i) ||
                       html.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:video"/i);
  const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i) ||
                       html.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:image"/i);
  const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i) ||
                       html.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:title"/i);

  if (!ogVideoMatch) {
    throw new Error("og:video tag not found on public page");
  }

  const videoUrl = ogVideoMatch[1].replace(/&amp;/g, "&");
  const thumbnailUrl = ogImageMatch ? ogImageMatch[1].replace(/&amp;/g, "&") : null;
  const title = ogTitleMatch ? ogTitleMatch[1] : "Instagram Reel";

  return {
    id: shortcode,
    reelUrl: `https://www.instagram.com/reel/${shortcode}/`,
    videoUrl,
    thumbnailUrl,
    title
  };
}

// Listen for external messages (from whitelisted domains in externally_connectable)
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  // 1. Strict Sender Verification
  if (!sender.url) {
    sendResponse({ success: false, error: "Access Denied: Sender URL missing" });
    return;
  }

  try {
    const senderUrl = new URL(sender.url);
    const allowedOrigins = [
      "https://clipvault.online",
      "https://www.clipvault.online",
      "http://localhost:3000"
    ];
    
    if (!allowedOrigins.includes(senderUrl.origin)) {
      sendResponse({ success: false, error: `Access Denied: Origin ${senderUrl.origin} unauthorized` });
      return;
    }
  } catch (e) {
    sendResponse({ success: false, error: "Access Denied: Invalid sender origin structure" });
    return;
  }

  // 2. Handle Extension Actions
  if (message.action === "PING") {
    sendResponse({ success: true, version: "1.0.0" });
    return;
  }

  if (message.action === "EXTRACT") {
    const { url } = message;
    const shortcode = extractShortcode(url);

    if (!shortcode) {
      sendResponse({ success: false, error: "Invalid Instagram Reel URL structure" });
      return;
    }

    // Run extraction cascade
    (async () => {
      try {
        const data = await extractViaJsonApi(shortcode);
        sendResponse({ success: true, data });
      } catch (errA) {
        console.warn(`Strategy A failed: ${errA.message}. Trying Strategy B...`);
        try {
          const data = await extractViaEmbedPage(shortcode);
          sendResponse({ success: true, data });
        } catch (errB) {
          console.warn(`Strategy B failed: ${errB.message}. Trying Strategy C...`);
          try {
            const data = await extractViaOpenGraph(shortcode);
            sendResponse({ success: true, data });
          } catch (errC) {
            console.error(`All strategies failed: ${errC.message}`);
            sendResponse({
              success: false,
              error: `Extraction failed: ${errC.message}`
            });
          }
        }
      }
    })();
    return true; // Keep message channel open for async response
  }

  if (message.action === "DOWNLOAD") {
    const { videoUrl, filename } = message;
    if (!videoUrl) {
      sendResponse({ success: false, error: "Missing videoUrl parameters" });
      return;
    }

    // Trigger local download using Chrome Downloads API, bypassing server bandwidth
    chrome.downloads.download({
      url: videoUrl,
      filename: filename || `reel-${Date.now()}.mp4`,
      saveAs: true
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ success: true, downloadId });
      }
    });
    return true;
  }
});
