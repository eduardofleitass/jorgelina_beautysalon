import { MapPin, Clock, Award } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="nosotros" className="relative py-24 md:py-32 bg-brand-charcoal">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <span className="text-brand-gold text-xs tracking-[0.3em] uppercase font-medium">
              Sobre Nosotros
            </span>
            <h2 className="font-[family-name:var(--font-serif)] text-3xl md:text-5xl font-bold mt-4 mb-6">
              Mas que un salon,
              <br />
              <span className="text-brand-gold italic">una experiencia</span>
            </h2>
            <p className="text-brand-gray leading-relaxed mb-6">
              En Jorgelina Beauty Salon, cada cliente es tratado con dedicacion y atencion al detalle. 
              Con años de experiencia en coloracion, manicura y maquillaje, transformamos tu vision en realidad.
            </p>
            <p className="text-brand-gray-light/60 leading-relaxed mb-8">
              Ubicados en S. Vicente, Asuncion, nuestro salon combina tecnicas de vanguardia con un ambiente 
              calido y profesional. Usamos productos de primera calidad para garantizar resultados 
              duraderos y saludables para tu cabello y piel.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <span className="block font-[family-name:var(--font-serif)] text-3xl font-bold text-brand-gold">7+</span>
                <span className="text-xs text-brand-gray uppercase tracking-wider">Años de exp.</span>
              </div>
              <div className="text-center">
                <span className="block font-[family-name:var(--font-serif)] text-3xl font-bold text-brand-gold">700+</span>
                <span className="text-xs text-brand-gray uppercase tracking-wider">Clientes felices</span>
              </div>
              <div className="text-center">
                <span className="block font-[family-name:var(--font-serif)] text-3xl font-bold text-brand-gold">300+</span>
                <span className="text-xs text-brand-gray uppercase tracking-wider">Publicaciones</span>
              </div>
            </div>
          </div>

          {/* Right: Info Cards */}
          <div className="space-y-6">
            <div className="flex items-start gap-5 p-6 border border-white/5 bg-brand-black/30">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center border border-brand-gold/30 text-brand-gold">
                <MapPin size={22} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-semibold text-brand-white mb-1">Ubicacion</h4>
                <a 
                  href="https://www.google.com/maps/place/Jorgelina+Coiffure/@-25.3078873,-57.6169304,17z/data=!3m1!4b1!4m6!3m5!1s0x945da86dcc5a7be9:0x729d64c83038985b!8m2!3d-25.3078873!4d-57.6169304!16s%2Fg%2F11d_8z63lp?entry=ttu&g_ep=EgoyMDI2MDkzMC4wIKXMDSoASAFQAw%3D%3D" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-brand-gray hover:text-brand-gold transition-colors duration-300"
                >
                  S. Vicente | ASUNCION
                </a>
              </div>
            </div>

            <div className="flex items-start gap-5 p-6 border border-white/5 bg-brand-black/30">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center border border-brand-gold/30 text-brand-gold">
                <Clock size={22} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-semibold text-brand-white mb-1">Horarios</h4>
                <p className="text-sm text-brand-gray">Lunes: 13 a 20:00hs</p>
                <p className="text-sm text-brand-gray">Martes a Sabado: 09 a 20:00hs</p>
              </div>
            </div>

            <div className="flex items-start gap-5 p-6 border border-white/5 bg-brand-black/30">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center border border-brand-gold/30 text-brand-gold">
                <Award size={22} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-semibold text-brand-white mb-1">Especialidad</h4>
                <p className="text-sm text-brand-gray">Especialista en Color &middot; Nails &middot; Makeup</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
