import { Scissors } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Galeria', href: '#galeria' },
    { label: 'Contacto', href: '#contacto' },
  ];

  return (
    <footer className="border-t border-brand-white/5 bg-brand-black">
      <div className="max-w-6xl mx-auto px-6 py-12 pb-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Scissors size={20} className="text-brand-gold" />
            <span className="font-[family-name:var(--font-script)] text-2xl text-brand-gold">
              Jorgelina
            </span>
          </div>

          {/* Links: area tactil ampliada para mobile */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-brand-gray hover:text-brand-gold active:text-brand-gold transition-colors duration-300 py-2.5 px-1"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Social: area tactil 44x44 */}
          <a
            href="https://www.instagram.com/jorgelinabeautysalon"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-11 h-11 text-brand-gray hover:text-brand-gold active:text-brand-gold transition-colors duration-300"
            aria-label="Instagram de Jorgelina Coiffure"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
        </div>

        <div className="mt-8 pt-8 border-t border-brand-white/5 text-center">
          <p className="text-xs text-brand-gray">
            &copy; {currentYear} Jorgelina Coiffure. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
