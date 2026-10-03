import { useState, useEffect } from 'react';
import { Menu, X, Scissors } from 'lucide-react';

interface NavbarProps {
  scrolled: boolean;
}

export default function Navbar({ scrolled }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Galeria', href: '#galeria' },
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Contacto', href: '#contacto' },
  ];

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-brand-black/95 backdrop-blur-md border-b border-brand-white/5 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#inicio" className="flex items-center gap-3 group">
          <Scissors size={28} className="text-brand-gold transition-transform duration-300 group-hover:rotate-12" />
          <span className="font-[family-name:var(--font-serif)] text-lg font-semibold tracking-wider text-brand-white italic">
            JORGELINA
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium tracking-wide text-brand-gray-light hover:text-brand-gold transition-colors duration-300 group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-brand-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <a
          href="#contacto"
          className="hidden md:inline-flex items-center px-5 py-2 text-sm font-medium tracking-wide border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all duration-300"
        >
          Reservar
        </a>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-brand-white p-2"
          aria-label="Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`md:hidden fixed inset-0 bg-brand-black/98 backdrop-blur-xl transition-all duration-500 ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-2xl font-[family-name:var(--font-serif)] text-brand-white hover:text-brand-gold transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contacto"
            onClick={() => setMenuOpen(false)}
            className="mt-4 px-8 py-3 border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all duration-300"
          >
            Reservar Turno
          </a>
        </div>
      </div>
    </nav>
  );
}
