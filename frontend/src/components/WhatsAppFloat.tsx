import { MessageCircle } from 'lucide-react';

const WHATSAPP_URL =
  'https://api.whatsapp.com/send?phone=595985853557&text=Buenas%20Jorgelina%20Coiffure%20quisiera%20hacer%20una%20reserva%20';

export default function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Reservar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-brand-gold text-brand-black shadow-lg hover:bg-brand-gold-light hover:scale-110 transition-all duration-300 group"
    >
      <MessageCircle size={26} strokeWidth={2} />
      <span className="absolute right-full mr-3 px-3 py-2 text-xs whitespace-nowrap bg-brand-charcoal text-brand-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Reserva por WhatsApp
      </span>
    </a>
  );
}
