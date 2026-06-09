import { GENERAL_ENQUIRY_LINK } from "@/lib/whatsapp";

export default function WhatsAppFloatingButton() {
  return (
    <a
      href={GENERAL_ENQUIRY_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Miele on WhatsApp"
      className="fixed bottom-5 right-5 z-30 flex h-14 w-14 animate-float items-center justify-center rounded-full bg-[#25D366] text-white shadow-warm-lg transition-transform duration-200 hover:scale-110 sm:bottom-7 sm:right-7"
      style={{ animationDuration: "5s" }}
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.45 1.33 4.95L2 22l5.25-1.38a9.93 9.93 0 0 0 4.79 1.22h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm0 18.13a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.34c0-4.54 3.7-8.23 8.24-8.23 4.54 0 8.23 3.7 8.23 8.24a8.23 8.23 0 0 1-8.24 8.18Zm4.51-6.16c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42h-.48c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.04s.88 2.37 1 2.53c.12.16 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
      </svg>
    </a>
  );
}
