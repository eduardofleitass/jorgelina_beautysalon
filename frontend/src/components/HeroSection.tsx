import { ChevronDown } from 'lucide-react';

export default function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-brand-charcoal to-brand-graphite" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-brand-gold/3 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Tagline */}
        <div className="mb-6 flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-brand-gold/60" />
          <span className="text-brand-gold text-xs tracking-[0.3em] uppercase font-medium">
            Beauty Salon
          </span>
          <span className="h-px w-12 bg-brand-gold/60" />
        </div>

        {/* Main Title */}
        <h1 className="font-[family-name:var(--font-serif)] text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
          <span className="text-brand-white">JORGELINA</span>
          <br />
          <span className="text-brand-gold text-3xl md:text-5xl lg:text-6xl font-light italic">
            Acosta
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-brand-gray text-lg md:text-xl max-w-2xl mx-auto mb-4 leading-relaxed">
          Especialista en Color &middot; Nails &middot; Makeup
        </p>
        <p className="text-brand-gray-light/60 text-sm md:text-base max-w-xl mx-auto mb-10">
          Transformando tu look con tecnicas profesionales en el corazon de Asuncion.
          Cada detalle cuenta, cada color importa.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://api.whatsapp.com/send?phone=595985853557"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-brand-gold text-brand-black font-semibold tracking-wide hover:bg-brand-gold-light transition-all duration-300"
          >
            Agenda tu turno
          </a>
          <a
            href="#servicios"
            className="px-8 py-3 border border-brand-white/20 text-brand-white font-medium tracking-wide hover:border-brand-gold hover:text-brand-gold transition-all duration-300"
          >
            Conoce nuestros servicios
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#servicios"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-brand-gray hover:text-brand-gold transition-colors duration-300 animate-bounce"
      >
        <ChevronDown size={24} />
      </a>
    </section>
  );
}
