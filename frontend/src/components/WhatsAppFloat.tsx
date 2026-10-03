import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_URL =
  'https://api.whatsapp.com/send?phone=595985853557&text=Buenas%20Jorgelina%20Coiffure%20quisiera%20hacer%20una%20reserva%20';

/**
 * Boton flotante de WhatsApp.
 *
 * Se muestra solo en las secciones intermedias (servicios, galeria, nosotros)
 * y se oculta en:
 *  - #inicio (Hero): ya tiene su propio CTA de WhatsApp y en pantallas chicas
 *    el boton tapaba el texto "Conoce nuestros servicios".
 *  - #contacto: ya ofrece WhatsApp/Instagram/Maps y el boton solapaba el
 *    enlace "WhatsApp" de la tarjeta de contacto.
 */
export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const zonas = ['#inicio', '#contacto']
      .map((sel) => document.querySelector(sel))
      .filter(Boolean) as Element[];

    if (!zonas.length) {
      // Fallback: mostrar tras pasar el primer viewport
      const alScrollear = () => setVisible(window.scrollY > window.innerHeight * 0.85);
      alScrollear();
      window.addEventListener('scroll', alScrollear, { passive: true });
      return () => window.removeEventListener('scroll', alScrollear);
    }

    // Contar cuantas zonas excluidas estan visibles en el viewport
    const visibles = new Set<Element>();
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) visibles.add(e.target);
          else visibles.delete(e.target);
        });
        setVisible(visibles.size === 0);
      },
      { threshold: 0.15 },
    );
    zonas.forEach((z) => observador.observe(z));

    return () => observador.disconnect();
  }, []);

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Reservar por WhatsApp"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center justify-center rounded-full bg-brand-gold text-brand-black shadow-lg hover:bg-brand-gold-light active:bg-brand-gold-light transition-all duration-300 group menu-float ${
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
      }`}
      style={{ width: '3.25rem', height: '3.25rem' }}
    >
      <MessageCircle size={24} strokeWidth={2} />
      <span className="hidden sm:block absolute right-full mr-3 px-3 py-2 text-xs whitespace-nowrap bg-brand-charcoal text-brand-white border border-brand-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Reserva por WhatsApp
      </span>
    </a>
  );
}
