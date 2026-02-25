const isMobile = () => /android|iphone|ipad|ipod/i.test(navigator.userAgent);
const isAndroid = () => /android/i.test(navigator.userAgent);

/**
 * Opens the correct WhatsApp app (personal or business) with a pre-filled text message.
 * On mobile: uses deep link scheme to open the right app.
 * On desktop: falls back to wa.me universal link.
 */
export function openWhatsAppShare(text: string) {
  const waType = localStorage.getItem("rivo_wa_type");
  const isBusiness = waType === "business";
  const encoded = encodeURIComponent(text);

  if (!isMobile()) {
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
    return;
  }

  if (isAndroid()) {
    const scheme = isBusiness ? "whatsapp-smb" : "whatsapp";
    const pkg = isBusiness ? "com.whatsapp.w4b" : "com.whatsapp";
    const fallback = encodeURIComponent(`https://wa.me/?text=${encoded}`);
    window.location.href = `intent://send?text=${encoded}#Intent;scheme=${scheme};package=${pkg};S.browser_fallback_url=${fallback};end`;
  } else {
    const scheme = isBusiness ? "whatsapp-smb" : "whatsapp";
    window.location.href = `${scheme}://send?text=${encoded}`;
  }
}

/**
 * Opens the correct WhatsApp app with a message to a specific phone number.
 * Used for verification flow (sending OTP code).
 */
export function openWhatsAppChat(phone: string, text: string) {
  const waType = localStorage.getItem("rivo_wa_type");
  const isBusiness = waType === "business";
  const encoded = encodeURIComponent(text);

  if (!isMobile()) {
    window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
    return;
  }

  if (isAndroid()) {
    const scheme = isBusiness ? "whatsapp-smb" : "whatsapp";
    const pkg = isBusiness ? "com.whatsapp.w4b" : "com.whatsapp";
    const fallback = encodeURIComponent(`https://wa.me/${phone}?text=${encoded}`);
    window.location.href = `intent://send?phone=${phone}&text=${encoded}#Intent;scheme=${scheme};package=${pkg};S.browser_fallback_url=${fallback};end`;
  } else {
    const scheme = isBusiness ? "whatsapp-smb" : "whatsapp";
    window.location.href = `${scheme}://send?phone=${phone}&text=${encoded}`;
  }
}
