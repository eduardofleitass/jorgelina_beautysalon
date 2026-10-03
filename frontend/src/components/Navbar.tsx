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

  // Bloquear scroll del body SOLO mientras el menu esta abierto.
  // El cleanup garantiza que siempre se restaure, incluso si el
  // componente se desmonta con el menu abierto.
  useEffect(() => {
    const anterior = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? 'hidden' : anterior || '';
    return () => {
      document.body.style.overflow = anterior || '';
    };
  }, [menuOpen]);

  // Cerrar el menu con Escape (accesibilidad teclado)
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const cerrar = () => setMenuOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-brand-black/95 backdrop-blur-md border-b border-brand-white/5 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      {/* Header: z-10 para quedar SIEMPRE por encima del overlay del menu.
          Antes el overlay (fixed inset-0) tapaba el boton X y bloqueaba el cierre. */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <a
          href="#inicio"
          onClick={cerrar}
          className="flex items-center gap-2 sm:gap-3 group py-2 -my-2 min-w-0"
        >
          <Scissors size={26} className="shrink-0 text-brand-gold transition-transform duration-300 group-hover:rotate-12" />
          <span className="font-[family-name:var(--font-script)] text-xl sm:text-2xl text-brand-white truncate">
            Jorgelina
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium tracking-wide text-brand-gray-light hover:text-brand-gold transition-colors duration-300 group py-2"
            >
              {link.label}
              <span className="absolute bottom-1 left-0 h-px w-0 bg-brand-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <a
          href="#contacto"
          className="hidden md:inline-flex items-center px-5 py-2.5 text-sm font-medium tracking-wide border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all duration-300"
        >
          Reservar
        </a>

        {/* Boton hamburguesa: area tactil 44x44 minimo (recomendacion Apple/Google) */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden flex items-center justify-center w-11 h-11 shrink-0 text-brand-white hover:text-brand-gold transition-colors duration-300"
          aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Overlay del menu: z-0 (por debajo del header) */}
      <div
        id="menu-mobile"
        className={`md:hidden fixed inset-0 z-0 bg-brand-black/98 backdrop-blur-xl transition-all duration-300 ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        aria-hidden={!menuOpen}
      >
        {/* Padding superior para no quedar bajo el header */}
        <div className="flex flex-col items-center justify-center h-full gap-2 px-6 pt-20 pb-24">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={cerrar}
              className="w-full max-w-xs text-center py-4 text-2xl font-[family-name:var(--font-serif)] text-brand-white hover:text-brand-gold active:text-brand-gold transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contacto"
            onClick={cerrar}
            className="mt-6 w-full max-w-xs text-center px-8 py-4 border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black active:bg-brand-gold active:text-brand-black transition-all duration-300"
          >
            Reservar Turno
          </a>
        </div>
      </div>
    </nav>
  );
}
