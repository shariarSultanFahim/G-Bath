"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Download, Share, X, PlusSquare } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if app is running in standalone mode (already installed)
    const checkStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    setIsStandalone(checkStandalone);
    if (checkStandalone) return;

    // Check if user dismissed prompt recently
    const dismissedAt = localStorage.getItem("pwa_prompt_dismissed");
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 1) return; // Don't annoy user for 1 day
    }

    // Detect mobile device only (iOS / Android phones & tablets)
    const ua = window.navigator.userAgent;
    const ios = /iPhone|iPad|iPod/.test(ua) && !(window as any).MSStream;
    const mobile = /Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);

    setIsIOS(ios);
    setIsMobile(mobile);

    // Strictly DO NOT show prompt on Desktop browsers
    if (!mobile) return;

    // On mobile devices, show prompt after a short delay
    const timer = setTimeout(() => setShowPrompt(true), 1500);

    // Listen for Android / Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else {
      alert("To install G-Bath:\n\nTap your browser's menu (3 dots at top-right) and select 'Add to Home screen' or 'Install App'.");
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa_prompt_dismissed", Date.now().toString());
  };

  // Rule 1: Do NOT show on Admin pages or login pages (only show on Seller views)
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/login")) {
    return null;
  }

  // Rule 2: Do NOT show on Desktop browsers or when already running in Standalone mode
  if (!isMobile || !showPrompt || isStandalone) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-in slide-in-from-bottom duration-300">
      <div className="flex flex-col rounded-2xl bg-slate-900 p-4 text-white shadow-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="G-Bath Logo"
              className="h-11 w-11 rounded-xl object-contain bg-white p-1 shadow-md border border-slate-700"
            />
            <div>
              <h4 className="font-bold text-sm text-white">Install G-Bath App</h4>
              <p className="text-xs text-slate-300">Install on your phone for quick access</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content based on OS */}
        {isIOS ? (
          <div className="mt-3 border-t border-slate-800 pt-3 text-xs text-slate-300 space-y-1.5">
            <p className="flex items-center gap-2 font-medium text-slate-200">
              To install on your iPhone:
            </p>
            <div className="flex items-center gap-2 text-slate-300">
              1. Tap the Share button <Share className="h-4 w-4 text-[#E8621A] inline" /> at bottom of Safari.
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              2. Scroll down & tap <PlusSquare className="h-4 w-4 text-[#E8621A] inline" /> <strong>Add to Home Screen</strong>.
            </div>
          </div>
        ) : (
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-2 rounded-xl bg-[#E8621A] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-[#d55513] transition active:scale-95"
            >
              <Download className="h-4 w-4" /> Install Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
