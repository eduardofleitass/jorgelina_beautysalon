import { Phone, Instagram, MapPin, Clock, Send } from 'lucide-react';
import { useState } from 'react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    date: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: enviar al backend
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: '', phone: '', service: '', date: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contacto" className="relative py-24 md:py-32 bg-brand-black">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-brand-gold text-xs tracking-[0.3em] uppercase font-medium">
            Contacto
          </span>
          <h2 className="font-[family-name:var(--font-serif)] text-3xl md:text-5xl font-bold mt-4 mb-6">
            Agenda tu<span className="text-brand-gold italic"> cita</span>
          </h2>
          <p className="text-brand-gray max-w-xl mx-auto">
            Completa el formulario y te contactaremos para confirmar tu turno.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="p-6 border border-white/5 bg-brand-charcoal/50">
              <h3 className="font-[family-name:var(--font-serif)] text-xl font-semibold mb-6">
                Informacion de contacto
              </h3>
              
              <div className="space-y-5">
                <a
                  href="https://api.whatsapp.com/send?phone=595985853557"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-brand-gray hover:text-brand-gold transition-colors duration-300 group"
                >
                  <div className="w-10 h-10 flex items-center justify-center border border-white/10 group-hover:border-brand-gold/50 transition-colors duration-300">
                    <Phone size={18} />
                  </div>
                  <span className="text-sm">WhatsApp</span>
                </a>

                <a
                  href="https://www.instagram.com/jorgelinabeautysalon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-brand-gray hover:text-brand-gold transition-colors duration-300 group"
                >
                  <div className="w-10 h-10 flex items-center justify-center border border-white/10 group-hover:border-brand-gold/50 transition-colors duration-300">
                    <Instagram size={18} />
                  </div>
                  <span className="text-sm">@jorgelinabeautysalon</span>
                </a>

                <div className="flex items-center gap-4 text-brand-gray">
                  <div className="w-10 h-10 flex items-center justify-center border border-white/10">
                    <MapPin size={18} />
                  </div>
                  <span className="text-sm">S. Vicente | ASUNCION</span>
                </div>

                <div className="flex items-start gap-4 text-brand-gray">
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-white/10">
                    <Clock size={18} />
                  </div>
                  <div className="text-sm space-y-1">
                    <p>Lunes: 13 a 20:00hs</p>
                    <p>Martes a Sabado: 09 a 20:00hs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="p-8 border border-white/5 bg-brand-charcoal/30 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-brand-gray uppercase tracking-wider mb-2">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-brand-black border border-white/10 text-brand-white text-sm focus:border-brand-gold focus:outline-none transition-colors duration-300"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-xs text-brand-gray uppercase tracking-wider mb-2">Telefono</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-brand-black border border-white/10 text-brand-white text-sm focus:border-brand-gold focus:outline-none transition-colors duration-300"
                    placeholder="+595..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-brand-gray uppercase tracking-wider mb-2">Servicio</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-brand-black border border-white/10 text-brand-white text-sm focus:border-brand-gold focus:outline-none transition-colors duration-300 appearance-none cursor-pointer"
                  >
                    <option value="">Selecciona un servicio</option>
                    <option value="coloracion">Coloracion</option>
                    <option value="nails">Nails</option>
                    <option value="makeup">Makeup</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-brand-gray uppercase tracking-wider mb-2">Fecha preferida</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-brand-black border border-white/10 text-brand-white text-sm focus:border-brand-gold focus:outline-none transition-colors duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-brand-gray uppercase tracking-wider mb-2">Mensaje</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-brand-black border border-white/10 text-brand-white text-sm focus:border-brand-gold focus:outline-none transition-colors duration-300 resize-none"
                  placeholder="Contanos que necesitas..."
                />
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-brand-gold text-brand-black font-semibold tracking-wide hover:bg-brand-gold-light transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Send size={16} />
                {submitted ? 'Mensaje enviado!' : 'Enviar solicitud'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
