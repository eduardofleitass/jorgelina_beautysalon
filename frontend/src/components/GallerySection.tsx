import { Instagram } from 'lucide-react';

const galleryImages = [
  {
    alt: 'Coloracion rubio platino',
    position: 'bg-[center_30%]',
  },
  {
    alt: 'Balayage dorado',
    position: 'bg-[center_40%]',
  },
  {
    alt: 'Mechas claras',
    position: 'bg-[center_35%]',
  },
  {
    alt: 'Manicura roja',
    position: 'bg-[center_50%]',
  },
  {
    alt: 'Manicura rosa',
    position: 'bg-[center_45%]',
  },
  {
    alt: 'Peinado elegante',
    position: 'bg-[center_40%]',
  },
];

export default function GallerySection() {
  return (
    <section id="galeria" className="relative py-24 md:py-32 bg-brand-black">
      <div className="max-w-6xl mx-auto px-6">
        <!-- Header -->
        <div className="text-center mb-16">
          <span className="text-brand-gold text-xs tracking-[0.3em] uppercase font-medium">
            Portafolio
          </span>
          <h2 className="font-[family-name:var(--font-serif)] text-3xl md:text-5xl font-bold mt-4 mb-6">
            Nuestros<span className="text-brand-gold italic"> Trabajos</span>
          </h2>
          <p className="text-brand-gray max-w-xl mx-auto">
            Resultados reales que hablan por si solos. Cada cliente es una obra de arte.
          </p>
        </div>

        <!-- Grid -->
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              className="group relative aspect-[3/4] overflow-hidden border border-white/5"
            >
              <!-- Placeholder with gradient -->
              <div
                className={`absolute inset-0 bg-gradient-to-br from-brand-graphite via-brand-charcoal to-brand-black ${img.position}`}
              />
              
              <!-- Overlay -->
              <div className="absolute inset-0 bg-brand-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <span className="text-brand-white font-medium tracking-wide">{img.alt}</span>
              </div>

              <!-- Corner accent -->
              <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-brand-gold/0 group-hover:border-brand-gold/50 transition-all duration-500" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-brand-gold/0 group-hover:border-brand-gold/50 transition-all duration-500" />
            </div>
          ))}
        </div>

        <!-- Instagram CTA -->
        <div className="mt-12 text-center">
          <a
            href="https://www.instagram.com/jorgelinabeautysalon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-brand-gold hover:text-brand-gold-light transition-colors duration-300 group"
          >
            <Instagram size={20} />
            <span className="text-sm tracking-wide">Ver mas en @jorgelinabeautysalon</span>
            <span className="h-px w-8 bg-brand-gold/50 group-hover:w-12 transition-all duration-300" />
          </a>
        </div>
      </div>
    </section>
  );
}
