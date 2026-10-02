import { Palette, Sparkles, Brush } from 'lucide-react';

const services = [
  {
    icon: Palette,
    title: 'Coloracion',
    subtitle: 'Especialista en Color',
    description:
      'Balayage, mechas, rubios platino, coloraciones fantasia y correcciones de color. Tecnicas personalizadas para realzar tu belleza natural.',
    features: ['Balayage', 'Mechas', 'Rubios Platino', 'Color Fantasy'],
  },
  {
    icon: Sparkles,
    title: 'Nails',
    subtitle: 'Manicura Profesional',
    description:
      'Manicura tradicional, semipermanente, acrilicas y nail art. Cuidado de manos y pies con productos de la mas alta calidad.',
    features: ['Semipermanente', 'Acrilicas', 'Nail Art', 'Spa de manos'],
  },
  {
    icon: Brush,
    title: 'Makeup',
    subtitle: 'Maquillaje Profesional',
    description:
      'Maquillaje social, de novia, editorial y para eventos especiales. Looks personalizados que resaltan tus rasgos unicos.',
    features: ['Social', 'Novia', 'Editorial', 'Eventos'],
  },
];

export default function ServicesSection() {
  return (
    <section id="servicios" className="relative py-24 md:py-32 bg-brand-charcoal">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-brand-gold text-xs tracking-[0.3em] uppercase font-medium">
            Nuestros Servicios
          </span>
          <h2 className="font-[family-name:var(--font-serif)] text-3xl md:text-5xl font-bold mt-4 mb-6">
            Todo lo que necesitas para<br />
            <span className="text-brand-gold italic">resaltar tu belleza</span>
          </h2>
          <p className="text-brand-gray max-w-xl mx-auto">
            Desde cortes vanguardistas hasta los tonos mas deseados. Tu transformacion empieza aqui.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="group relative p-8 border border-white/5 bg-brand-black/50 hover:border-brand-gold/30 transition-all duration-500"
            >
              {/* Icon */}
              <div className="mb-6 w-14 h-14 flex items-center justify-center border border-brand-gold/30 text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-black transition-all duration-500">
                <service.icon size={26} strokeWidth={1.5} />
              </div>

              {/* Content */}
              <span className="text-brand-gold text-xs tracking-widest uppercase">{service.subtitle}</span>
              <h3 className="font-[family-name:var(--font-serif)] text-2xl font-semibold mt-2 mb-4">
                {service.title}
              </h3>
              <p className="text-brand-gray text-sm leading-relaxed mb-6">{service.description}</p>

              {/* Features */}
              <ul className="space-y-2">
                {service.features.map((feat, fidx) => (
                  <li key={fidx} className="flex items-center gap-3 text-sm text-brand-gray-light/70">
                    <span className="h-px w-4 bg-brand-gold/50" />
                    {feat}
                  </li>
                ))}
              </ul>

              {/* Hover line */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-brand-gold group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
