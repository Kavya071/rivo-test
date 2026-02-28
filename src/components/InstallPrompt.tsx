import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

function isInStandaloneMode(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true
  );
}

function isIOSSafari(): boolean {
  const ua = navigator.userAgent;
  return isIOS() && /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS|mercury/.test(ua);
}

const DISMISSED_KEY = "rivo_install_dismissed";

export default function InstallPrompt({ hasNav = false }: { hasNav?: boolean }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showAndroid, setShowAndroid] = useState(false);
  const [showIOS, setShowIOS] = useState(false);

  useEffect(() => {
    if (isInStandaloneMode()) return;
    if (sessionStorage.getItem(DISMISSED_KEY)) return;

    if (isIOSSafari()) {
      setShowIOS(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowAndroid(true);
    };

    const handleAppInstalled = () => {
      setShowAndroid(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowAndroid(false);
    }
    setDeferredPrompt(null);
  };

  const dismiss = () => {
    sessionStorage.setItem(DISMISSED_KEY, "1");
    setShowAndroid(false);
    setShowIOS(false);
  };

  const bottomClass = hasNav ? "mb-[88px]" : "mb-4";

  return (
    <AnimatePresence>
      {showAndroid && (
        <motion.div
          key="android-prompt"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center pointer-events-none"
        >
          <div className="w-full md:max-w-2xl lg:max-w-4xl xl:max-w-5xl pointer-events-auto px-4">
            <div className={`${bottomClass} bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-2xl shadow-black/80`}>
              <div className="w-10 h-10 bg-rivo-green rounded-xl flex items-center justify-center flex-shrink-0">
                <Download size={20} className="text-black" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-tight">Install Rivo Partners</p>
                <p className="text-xs text-zinc-400 mt-0.5">Add to home screen for quick access</p>
              </div>
              <button
                onClick={handleInstall}
                className="flex-shrink-0 bg-rivo-green text-black text-sm font-bold px-4 py-2 rounded-lg active:scale-95 transition-transform"
              >
                Install
              </button>
              <button
                onClick={dismiss}
                className="flex-shrink-0 p-1 text-zinc-500 hover:text-white transition-colors"
                aria-label="Dismiss install prompt"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {showIOS && (
        <motion.div
          key="ios-prompt"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center pointer-events-none"
        >
          <div className="w-full md:max-w-2xl lg:max-w-4xl xl:max-w-5xl pointer-events-auto px-4">
            <div className={`${bottomClass} bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 shadow-2xl shadow-black/80`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rivo-green rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-bold text-lg leading-none">R</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white leading-tight">Install Rivo Partners</p>
                    <p className="text-xs text-zinc-400 mt-0.5">Add to your home screen</p>
                  </div>
                </div>
                <button
                  onClick={dismiss}
                  className="p-1 text-zinc-500 hover:text-white transition-colors"
                  aria-label="Dismiss install prompt"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex items-center gap-2 bg-black rounded-xl px-4 py-3 border border-zinc-800">
                <span className="text-xs text-zinc-300 leading-relaxed">
                  Tap the{" "}
                  <span className="inline-flex items-center gap-0.5 align-middle text-rivo-green font-semibold">
                    <Share size={13} strokeWidth={2.5} />
                    {" "}Share
                  </span>{" "}
                  icon below, then tap{" "}
                  <span className="text-rivo-green font-semibold">"Add to Home Screen"</span>
                </span>
              </div>

              {/* Arrow pointing toward Safari's bottom toolbar */}
              <div className="flex justify-center mt-2.5">
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="text-zinc-600">
                  <path d="M7 9L1 1H13L7 9Z" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
