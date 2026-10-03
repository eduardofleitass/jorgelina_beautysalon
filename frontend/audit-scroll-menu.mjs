/**
 * Reproduce el bug reportado: abrir el menu DESPUES de scrollear
 * (cuando el nav tiene backdrop-blur activo).
 * Verifica que el overlay cubra todo el viewport y no quede colapsado.
 */
import { chromium, devices } from '@playwright/test';

const b = await chromium.launch();
const ctx = await b.newContext({ ...devices['iPhone 13'], locale: 'es-PY' });
const p = await ctx.newPage();
await p.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
await p.waitForTimeout(900);

const vp = p.viewportSize();
console.log(`Viewport: ${vp.width}x${vp.height}\n`);

async function probarMenu(etiqueta, scrollPrevio) {
  if (scrollPrevio > 0) {
    await p.evaluate((y) => window.scrollTo(0, y), scrollPrevio);
    await p.waitForTimeout(800);
  } else {
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(500);
  }

  const navBlur = await p.evaluate(() => {
    const n = document.querySelector('nav');
    return getComputedStyle(n).backdropFilter || 'none';
  });

  await p.locator('nav button[aria-label]').first().click();
  await p.waitForTimeout(700);

  const r = await p.evaluate(() => {
    const o = document.querySelector('#menu-mobile');
    const rc = o.getBoundingClientRect();
    const s = getComputedStyle(o);
    const docW = document.documentElement.clientWidth;
    const docH = document.documentElement.clientHeight;

    // ¿Cubre el viewport completo?
    const cubre = Math.abs(rc.width - docW) < 3 && Math.abs(rc.height - docH) < 3 && Math.abs(rc.top) < 3;

    // ¿Se ve contenido de la pagina por detras? (buscar secciones visibles)
    const seccionesVisibles = [];
    document.querySelectorAll('section, footer').forEach((sec) => {
      const sr = sec.getBoundingClientRect();
      if (sr.top < docH && sr.bottom > 0 && sec.id !== 'inicio') {
        // esta en pantalla: ¿tapa el overlay?
        const punto = document.elementFromPoint(docW / 2, Math.max(80, sr.top + 30));
        const tapado = punto ? o.contains(punto) || punto === o : false;
        if (!tapado) seccionesVisibles.push(sec.id || sec.tagName);
      }
    });

    return {
      overlay: { w: Math.round(rc.width), h: Math.round(rc.height), top: Math.round(rc.top) },
      viewport: { w: docW, h: docH },
      cubre,
      background: s.backgroundColor,
      visibility: s.visibility,
      opacidad: s.opacity,
      parentDelOverlay: o.parentElement?.tagName,
      esDescendienteDelNav: !!o.closest('nav'),
      seccionesSinTapar: seccionesVisibles,
      linksVisibles: Array.from(o.querySelectorAll('a')).filter((a) => {
        const ar = a.getBoundingClientRect();
        return ar.width > 0 && ar.height > 0 && ar.top >= 0 && ar.bottom <= docH;
      }).length,
      floatOculto: (() => {
        const f = document.querySelector('a[aria-label="Reservar por WhatsApp"]');
        return f ? getComputedStyle(f).opacity === '0' : 'no existe';
      })(),
      bodyClass: document.body.classList.contains('menu-abierto'),
    };
  });

  console.log(`--- ${etiqueta} ---`);
  console.log(`  backdrop-filter del nav: ${navBlur}`);
  console.log(`  Overlay: ${r.overlay.w}x${r.overlay.h} top=${r.overlay.top} | viewport ${r.viewport.w}x${r.viewport.h}`);
  console.log(`  Cubre viewport completo: ${r.cubre ? 'SI ✓' : 'NO ✗ BUG'}`);
  console.log(`  Es descendiente del nav: ${r.esDescendienteDelNav ? 'SI (riesgo de bug)' : 'NO ✓'}`);
  console.log(`  Fondo solido: ${r.background} ${r.background.includes('0, 0, 0') || r.background.includes('rgb(') ? '✓' : '?'}`);
  console.log(`  Secciones visibles por detras: ${r.seccionesSinTapar.length === 0 ? 'ninguna ✓' : r.seccionesSinTapar.join(', ') + ' ✗'}`);
  console.log(`  Links del menu visibles: ${r.linksVisibles}/6`);
  console.log(`  Flotante WhatsApp oculto con menu abierto: ${r.floatOculto ? 'SI ✓' : 'NO ✗'}`);
  console.log(`  body.menu-abierto: ${r.bodyClass ? 'SI ✓' : 'NO ✗'}`);
  console.log('');

  // Cerrar
  await p.locator('nav button[aria-label]').first().click();
  await p.waitForTimeout(600);
}

await probarMenu('Sin scroll (top)', 0);
await probarMenu('CON SCROLL (scroll=1200) - bug reportado', 1200);
await probarMenu('CON SCROLL profundo (scroll=2500)', 2500);

console.log('=== Capturas para inspeccion visual ===');
await p.evaluate(() => window.scrollTo(0, 1200));
await p.waitForTimeout(700);
await p.locator('nav button[aria-label]').first().click();
await p.waitForTimeout(800);
await p.screenshot({ path: 'bug-scroll-menu.png' });
console.log('bug-scroll-menu.png generado');

await b.close();
