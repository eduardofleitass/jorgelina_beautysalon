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
  // El cleanup garantiza que siempre se restaure.
  // Tambien marca el body para que el boton flotante de WhatsApp se oculte.
  useEffect(() => {
    const anterior = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? 'hidden' : anterior || '';
    document.body.classList.toggle('menu-abierto', menuOpen);
    return () => {
      document.body.style.overflow = anterior || '';
      document.body.classList.remove('menu-abierto');
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
    <>
      {/* NAV: solo la barra superior.
          OJO: NO debe contener el overlay del menu como descendiente.
          backdrop-filter (backdrop-blur) crea un containing block para los
          hijos position:fixed, lo que hacia que el overlay (fixed inset-0)
          se posicionara respecto al nav (~68px) en vez del viewport y el
          menu quedara colapsado sobre el contenido de la pagina. */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          scrolled
            ? 'bg-brand-black/95 backdrop-blur-md border-b border-brand-white/5 shadow-lg'
            : 'bg-transparent'
        }`}
      >
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

          {/* Boton hamburguesa: area tactil 44x44 minimo */}
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
      </nav>

      {/* OVERLAY DEL MENU: hermano del nav (NO descendiente) para que
          position:fixed se resuelva contra el viewport y no contra el nav. */}
      <div
        id="menu-mobile"
        className={`md:hidden fixed inset-0 z-40 bg-brand-black transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        aria-hidden={!menuOpen}
      >
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
    </>
  );
}
