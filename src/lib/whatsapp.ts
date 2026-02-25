/**
 * Opens WhatsApp (personal or business) with a pre-filled text message.
 * Respects the user's WhatsApp type preference stored during signup.
 */
export function openWhatsAppShare(text: string) {
  const waType = localStorage.getItem("rivo_wa_type");
  const isBusiness = waType === "business";
  const encoded = encodeURIComponent(text);
  const isAndroid = /android/i.test(navigator.userAgent);

  if (isAndroid) {
    const scheme = isBusiness ? "whatsapp-smb" : "whatsapp";
    const pkg = isBusiness ? "com.whatsapp.w4b" : "com.whatsapp";
    const fallback = encodeURIComponent(`https://wa.me/?text=${encoded}`);
    window.location.href = `intent://send?text=${encoded}#Intent;scheme=${scheme};package=${pkg};S.browser_fallback_url=${fallback};end`;
  } else {
    const scheme = isBusiness ? "whatsapp-smb" : "whatsapp";
    window.location.href = `${scheme}://send?text=${encoded}`;
  }
}
