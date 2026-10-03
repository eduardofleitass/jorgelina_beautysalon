/**
 * Iconos personalizados de belleza para Jorgelina Coiffure.
 * Disenados con el mismo estilo de linea que Lucide
 * (viewBox 24x24, stroke, sin relleno, esquinas redondeadas)
 * para integrarse visualmente con el resto del sitio.
 */

interface IconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

/** Brocha de coloracion / tint brush */
export function IconTintBrush({ size = 24, strokeWidth = 1.5, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Mango inclinado */}
      <path d="M20.6 3.4a2.1 2.1 0 0 0-2.97 0L12.9 8.13l2.97 2.97 4.73-4.73a2.1 2.1 0 0 0 0-2.97Z" />
      {/* Virola */}
      <path d="M10.75 10.25 13.72 13.22" />
      <path d="M9.4 11.6l3 3" />
      {/* Cerdas (bloque sesgado) */}
      <path d="M9.4 11.6 4.9 16.1a2.3 2.3 0 0 0-.6 2.3l.5 1.7 1.7.5a2.3 2.3 0 0 0 2.3-.6l4.5-4.5" />
      {/* Linea de cerdas */}
      <path d="M6.2 15.4 8.6 17.8" opacity="0.5" />
      <path d="M7.6 14 10 16.4" opacity="0.5" />
    </svg>
  );
}

/** Esmalte de unas / nail polish bottle */
export function IconNailPolish({ size = 24, strokeWidth = 1.5, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Tapa */}
      <rect x="9.75" y="1.5" width="4.5" height="4.5" rx="0.9" />
      {/* Cuello */}
      <path d="M10.6 6v3M13.4 6v3" />
      {/* Frasco */}
      <path d="M8.4 11.5c0-1.4.9-2.1 1.7-2.5h3.8c.8.4 1.7 1.1 1.7 2.5V19a2.5 2.5 0 0 1-2.5 2.5h-2.2A2.5 2.5 0 0 1 8.4 19v-7.5Z" />
      {/* Brillo */}
      <path d="M11 13.5v5" opacity="0.45" />
    </svg>
  );
}

/** Labial / lipstick */
export function IconLipstick({ size = 24, strokeWidth = 1.5, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Barra de labial (punta sesgada) */}
      <path d="M9.75 11.5V6.9L14.25 4.2v7.3" />
      {/* Anillo */}
      <path d="M9.25 11.5h5.5" />
      {/* Tubo */}
      <rect x="8.25" y="11.5" width="7.5" height="9.5" rx="1.1" />
    </svg>
  );
}

/** Tijeras + peine (peluqueria) - por si se necesita */
export function IconHairdressing({ size = 24, strokeWidth = 1.5, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Peine */}
      <path d="M4 6h16" />
      <path d="M4 6v5M8 6v5M12 6v5M16 6v5M20 6v5" />
      <path d="M4 11h16v2a2 2 0 0 1-2 2h-6" />
      {/* Tijeras */}
      <circle cx="8" cy="19" r="1.6" />
      <circle cx="8" cy="14" r="1.6" />
      <path d="M9.4 18.1 20 9M9.4 14.9 20 20" />
    </svg>
  );
}
