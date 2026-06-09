// Helpers for routing every "order" action to a WhatsApp chat instead of a
// payment flow — this is an enquiry-based showcase, not a paid store.

export const WHATSAPP_NUMBER = "919742486901";
export const PHONE_DISPLAY = "+91 97424 86901";
export const INSTAGRAM_HANDLE = "@mielekitchen_";
export const INSTAGRAM_URL = "https://instagram.com/mielekitchen_";
export const EMAIL = "chefanjalii@gmail.com";

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function dishEnquiryLink(dishName: string): string {
  return whatsappLink(`Hi Miele! I'd like to order the ${dishName}.`);
}

export const GENERAL_ENQUIRY_LINK = whatsappLink(
  "Hi Miele! I'd like to enquire about placing an order."
);

export const PHONE_TEL_LINK = `tel:+${WHATSAPP_NUMBER}`;
export const EMAIL_LINK = `mailto:${EMAIL}`;
