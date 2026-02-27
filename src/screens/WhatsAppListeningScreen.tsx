import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import { checkVerification, initWhatsApp } from "@/lib/api";
import { openWhatsAppChat } from "@/lib/whatsapp";

export default function WhatsAppListeningScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();
  const [dots, setDots] = useState(".");
  const [attempts, setAttempts] = useState(0);
  const hasAutoOpened = useRef(false);

  // Code from URL param (verify link) or localStorage (normal flow)
  const urlCode = searchParams.get("code");
  const code = urlCode || localStorage.getItem("rivo_verify_code") || "";
  const isFromVerifyLink = !!urlCode;

  // If arriving from verify link, immediately check and redirect
  useEffect(() => {
    if (!isFromVerifyLink || !code) return;
    checkVerification(code)
      .then((data: any) => {
        if (data.verified) {
          handleVerified(data);
        } else {
          navigate("/", { replace: true });
        }
      })
      .catch(() => navigate("/", { replace: true }));
  }, [isFromVerifyLink, code]);

  // Auto-open WhatsApp on mount via deep link (browser stays on this screen)
  useEffect(() => {
    const pendingUrl = localStorage.getItem("rivo_wa_pending");
    if (pendingUrl && !hasAutoOpened.current) {
      hasAutoOpened.current = true;
      localStorage.removeItem("rivo_wa_pending");
      try {
        const url = new URL(pendingUrl);
        const phone = url.pathname.replace("/", "");
        const text = url.searchParams.get("text") || "";
        openWhatsAppChat(phone, text);
      } catch {
        // Fallback: direct navigation
        window.location.href = pendingUrl;
      }
    }
  }, []);

  const handleVerified = (data: { token: string; agent: { has_completed_first_action: boolean } }) => {
    loginWithToken(data.token, data.agent);
    localStorage.removeItem("rivo_verify_code");
    localStorage.removeItem("rivo_referral_code");
    if (!data.agent.has_completed_first_action) {
      navigate("/referral-bonus", { replace: true });
    } else {
      navigate("/home", { replace: true });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 500);

    // Poll backend every 2 seconds to check verification
    const pollInterval = setInterval(async () => {
      if (!code) return;
      try {
        const data = await checkVerification(code);
        if (data.verified) {
          clearInterval(pollInterval);
          handleVerified(data);
        }
      } catch {
        setAttempts((prev) => prev + 1);
      }
    }, 2000);

    // When tab regains focus, check immediately (polling is throttled in background)
    const handleVisibility = async () => {
      if (document.visibilityState === "visible" && code) {
        try {
          const data = await checkVerification(code);
          if (data.verified) {
            clearInterval(pollInterval);
            handleVerified(data);
          }
        } catch {}
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      clearInterval(pollInterval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [code, loginWithToken, navigate]);

  const handleOpenWhatsApp = async () => {
    if (code) {
      openWhatsAppChat("971545079577", `RIVO ${code}`);
    } else {
      try {
        const isBusiness = localStorage.getItem("rivo_wa_type") === "business";
        const referralCode = localStorage.getItem("rivo_referral_code") || "";
        const data = await initWhatsApp(referralCode, isBusiness);
        localStorage.setItem("rivo_verify_code", data.code);
        const waUrl = new URL(data.whatsapp_url);
        const phone = waUrl.pathname.replace("/", "");
        const text = waUrl.searchParams.get("text") || "";
        openWhatsAppChat(phone, text);
      } catch {
        console.error("Failed to re-init WhatsApp");
      }
    }
  };

  // If from verify link, show spinner while checking
  if (isFromVerifyLink) {
    return (
      <div className="flex flex-col min-h-screen bg-black items-center justify-center">
        <div className="w-8 h-8 border-2 border-rivo-green border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 mt-4 text-sm">Verifying...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black p-6 relative">
      <div className="mb-8 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-zinc-900 transition-colors">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 relative"
        >
          <div className="w-24 h-24 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,211,102,0.3)]">
            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>
          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-full bg-[#25D366] opacity-20 animate-ping" />
        </motion.div>

        <h1 className="text-3xl font-medium text-white mb-4 tracking-tight">
          Tap Send in WhatsApp
        </h1>

        <p className="text-gray-400 text-lg mb-12 max-w-xs mx-auto leading-relaxed">
          A message with your code is ready — just hit send.
        </p>

        <div className="flex items-center justify-center space-x-3 bg-zinc-900/50 px-6 py-3 rounded-full border border-zinc-800">
          <div className="w-2 h-2 bg-rivo-green rounded-full animate-pulse" />
          <span className="text-sm text-gray-300 font-medium">Listening{dots}</span>
        </div>

        {attempts >= 3 && (
          <p className="text-sm text-gray-500 mt-6">Taking longer than expected? Try opening WhatsApp again.</p>
        )}
      </div>

      <div className="mt-auto pt-8 pb-6 text-center">
        <button
          onClick={handleOpenWhatsApp}
          className="text-sm font-medium text-rivo-green hover:underline transition-colors"
        >
          Open WhatsApp again
        </button>
      </div>
    </div>
  );
}
