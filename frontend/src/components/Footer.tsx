import { Scissors } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-brand-black">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Scissors size={20} className="text-brand-gold" />
            <span className="font-[family-name:var(--font-serif)] text-lg font-semibold tracking-wider text-brand-white italic">
              𝒥𝒪ℛ𝒢ℰℒℐ𝒩𝒜
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a href="#inicio" className="text-sm text-brand-gray hover:text-brand-gold transition-colors duration-300">Inicio</a>
            <a href="#servicios" className="text-sm text-brand-gray hover:text-brand-gold transition-colors duration-300">Servicios</a>
            <a href="#galeria" className="text-sm text-brand-gray hover:text-brand-gold transition-colors duration-300">Galeria</a>
            <a href="#contacto" className="text-sm text-brand-gray hover:text-brand-gold transition-colors duration-300">Contacto</a>
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/jorgelinabeautysalon"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-gray hover:text-brand-gold transition-colors duration-300"
              aria-label="Instagram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-brand-gray">
            &copy; {currentYear} Jorgelina Beauty Salon. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
