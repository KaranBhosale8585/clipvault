/**
 * ClipVault Companion Extension - Popup controller
 * Displays status inside the browser extension drop-down.
 */
document.addEventListener("DOMContentLoaded", () => {
  const statusBadge = document.getElementById("status-badge");
  
  // Simple check to display active tab connection state (if desired)
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab && activeTab.url) {
      const url = activeTab.url;
      if (url.includes("clipvault.online") || url.includes("localhost:3000")) {
        statusBadge.textContent = "Connected";
        statusBadge.className = "badge";
      } else {
        statusBadge.textContent = "Active";
        statusBadge.className = "badge";
      }
    }
  });
});
