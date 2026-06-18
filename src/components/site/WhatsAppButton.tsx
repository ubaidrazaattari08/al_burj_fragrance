import { whatsappLink } from "@/lib/site";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink("Hello Alburj, I'd like to ask about a fragrance.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-30 size-14 rounded-full bg-[#25D366] text-white grid place-items-center shadow-elevated hover:scale-110 transition animate-drift"
    >
      <svg viewBox="0 0 32 32" className="size-7" fill="currentColor" aria-hidden>
        <path d="M19.11 17.42c-.27-.14-1.58-.78-1.83-.87-.25-.09-.43-.14-.61.14-.18.27-.7.87-.86 1.05-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.16-1.34-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.02-.22-.53-.45-.46-.61-.47l-.52-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.35.98 2.65 1.12 2.83.14.18 1.94 2.96 4.7 4.04.66.28 1.17.45 1.57.58.66.21 1.26.18 1.73.11.53-.08 1.58-.64 1.81-1.27.22-.62.22-1.16.16-1.27-.07-.11-.25-.18-.52-.32zM16.03 5.33C10.13 5.33 5.33 10.13 5.33 16c0 1.88.49 3.71 1.43 5.33L5.33 26.67l5.5-1.41c1.56.85 3.32 1.3 5.12 1.3h.04c5.9 0 10.7-4.8 10.7-10.7s-4.8-10.53-10.66-10.53z"/>
      </svg>
    </a>
  );
}
