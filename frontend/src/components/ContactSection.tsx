import { Phone, Instagram, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { crearReserva } from '../services/reservas';

type Estado = 'idle' | 'ok' | 'error';

const WA_PHONE = '595985853557';

/** Etiquetas legibles para cada servicio */
const SERVICIOS: Record<string, string> = {
  coloracion: 'coloracion',
  nails: 'nails',
  makeup: 'makeup',
};

/** Formatea la fecha ISO (yyyy-mm-dd) a un texto legible: "15 de octubre de 2026" */
function formatearFecha(iso: string): string {
  if (!iso) return '';
  const [anio, mes, dia] = iso.split('-').map(Number);
  if (!anio || !mes || !dia) return iso;
  const fecha = new Date(anio, mes - 1, dia);
  return fecha.toLocaleDateString('es-PY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Mensaje personalizado para el WhatsApp del salon:
 * "Buenas soy (Nombre) quisiera agendar una cita para (servicio)
 *  en la fecha (fecha), cuentan con turnos disponibles?"
 */
function construirMensaje(datos: { name: string; service: string; date: string }): string {
  const servicio = SERVICIOS[datos.service] || datos.service;
  const fecha = formatearFecha(datos.date);
  return `Buenas soy ${datos.name} quisiera agendar una cita para ${servicio} en la fecha ${fecha}, cuentan con turnos disponibles?`;
}

function construirWhatsAppLink(datos: { name: string; service: string; date: string }): string {
  return `https://api.whatsapp.com/send?phone=${WA_PHONE}&text=${encodeURIComponent(
    construirMensaje(datos),
  )}`;
}

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', service: '', date: '' });
  const [estado, setEstado] = useState<Estado>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [waLink, setWaLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const datosEnviados = { ...formData };
    const link = construirWhatsAppLink(datosEnviados);

    // Abrir WhatsApp inmediatamente (evita el bloqueo de popup del navegador)
    window.open(link, '_blank', 'noopener,noreferrer');
    setWaLink(link);

    try {
      await crearReserva(datosEnviados);
      setEstado('ok');
      setFormData({ name: '', service: '', date: '' });
      setTimeout(() => {
        setEstado('idle');
        setWaLink('');
      }, 12000);
    } catch (err) {
      setEstado('error');
      setErrorMsg(err instanceof Error ? err.message : 'Error al enviar la reserva');
      setTimeout(() => setEstado('idle'), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const completo = formData.name && formData.service && formData.date;

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
            Completa tus datos y te confirmamos el turno por WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="p-6 border border-brand-white/5 bg-brand-charcoal/50">
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
                  <div className="w-10 h-10 flex items-center justify-center border border-brand-white/10 group-hover:border-brand-gold/50 transition-colors duration-300">
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
                  <div className="w-10 h-10 flex items-center justify-center border border-brand-white/10 group-hover:border-brand-gold/50 transition-colors duration-300">
                    <Instagram size={18} />
                  </div>
                  <span className="text-sm">@jorgelinabeautysalon</span>
                </a>

                <a
                  href="https://www.google.com/maps/place/Jorgelina+Coiffure/@-25.3078873,-57.6169304,17z/data=!3m1!4b1!4m6!3m5!1s0x945da86dcc5a7be9:0x729d64c83038985b!8m2!3d-25.3078873!4d-57.6169304!16s%2Fg%2F11d_8z63lp?entry=ttu&g_ep=EgoyMDI2MDkzMC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-brand-gray hover:text-brand-gold transition-colors duration-300 group"
                >
                  <div className="w-10 h-10 flex items-center justify-center border border-brand-white/10 group-hover:border-brand-gold/50 transition-colors duration-300">
                    <MapPin size={18} />
                  </div>
                  <span className="text-sm">S. Vicente | ASUNCION</span>
                </a>

                <div className="flex items-start gap-4 text-brand-gray">
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-brand-white/10">
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

          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="p-8 border border-brand-white/5 bg-brand-charcoal/30 space-y-6"
            >
              <div>
                <label className="block text-xs text-brand-gray uppercase tracking-wider mb-2">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-brand-black border border-brand-white/10 text-brand-white text-sm focus:border-brand-gold focus:outline-none transition-colors duration-300"
                  placeholder="Tu nombre"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-brand-gray uppercase tracking-wider mb-2">Servicio</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-brand-black border border-brand-white/10 text-brand-white text-sm focus:border-brand-gold focus:outline-none transition-colors duration-300 appearance-none cursor-pointer"
                  >
                    <option value="">Selecciona un servicio</option>
                    <option value="coloracion">Coloracion</option>
                    <option value="nails">Nails</option>
                    <option value="makeup">Makeup</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-brand-gray uppercase tracking-wider mb-2">Fecha</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-brand-black border border-brand-white/10 text-brand-white text-sm focus:border-brand-gold focus:outline-none transition-colors duration-300"
                  />
                </div>
              </div>

              {/* Vista previa del mensaje que se enviara */}
              {completo && (
                <div className="p-4 border border-brand-white/10 bg-brand-black/40">
                  <span className="block text-[10px] text-brand-gray uppercase tracking-wider mb-2">
                    Mensaje que se enviara por WhatsApp
                  </span>
                  <p className="text-sm text-brand-gray-light italic leading-relaxed">
                    "{construirMensaje(formData)}"
                  </p>
                </div>
              )}

              {estado === 'ok' && (
                <div className="flex flex-col gap-3 p-4 border border-success/30 bg-success/5">
                  <div className="flex items-center gap-2 text-sm text-success-light">
                    <CheckCircle2 size={16} />
                    Abrimos WhatsApp para que confirmes tu turno!
                  </div>
                  {waLink && (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-brand-gold hover:text-brand-gold-light transition-colors duration-300"
                    >
                      <Send size={14} />
                      Si WhatsApp no se abrio, toca aqui
                    </a>
                  )}
                </div>
              )}
              {estado === 'error' && (
                <div className="flex items-center gap-2 text-sm text-error-light">
                  <AlertCircle size={16} />
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-brand-gold text-brand-black font-semibold tracking-wide hover:bg-brand-gold-light transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Send size={16} />
                Agendar por WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
