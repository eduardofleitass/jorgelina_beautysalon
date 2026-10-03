import { chromium, devices } from '@playwright/test';

const b = await chromium.launch();
const ctx = await b.newContext({ ...devices['iPhone SE'], locale: 'es-PY' });
const p = await ctx.newPage();
await p.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
await p.waitForTimeout(900);

console.log('=== Verificacion: boton flotante NO tapa contenido ===\n');

// En el hero no debe estar visible
const enHero = await p.evaluate(() => {
  const a = document.querySelector('a[aria-label="Reservar por WhatsApp"]');
  return a ? getComputedStyle(a).opacity : 'no existe';
});
console.log(`Boton flotante en Hero: opacity=${enHero} ${enHero === '0' ? '(oculto ✓)' : '(VISIBLE - puede tapar)'}`);

// Scroll a cada seccion y verificar solapamiento con el boton
const secciones = ['#servicios', '#galeria', '#nosotros', '#contacto'];
for (const s of secciones) {
  await p.evaluate((sel) => document.querySelector(sel)?.scrollIntoView(), s);
  await p.waitForTimeout(700);
  const r = await p.evaluate(() => {
    const btn = document.querySelector('a[aria-label="Reservar por WhatsApp"]');
    if (!btn) return { visible: false };
    const vis = getComputedStyle(btn).opacity !== '0';
    const b = btn.getBoundingClientRect();
    // buscar elementos interactivos que solapen
    let solapa = [];
    document.querySelectorAll('a, button, select, input').forEach((el) => {
      if (el === btn) return;
      const rc = el.getBoundingClientRect();
      if (rc.width === 0) return;
      const choca = !(rc.right < b.left || rc.left > b.right || rc.bottom < b.top || rc.top > b.bottom);
      if (choca) solapa.push((el.textContent || el.name || el.type || '').trim().slice(0, 22));
    });
    return { visible: vis, solapa };
  });
  const estado = !r.visible ? 'oculto' : r.solapa.length === 0 ? 'visible, sin solapamiento ✓' : `SOLAPA con: ${r.solapa.join(', ')}`;
  console.log(`${s}: ${estado}`);
}

// Al final de la pagina
await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await p.waitForTimeout(700);
const enFooter = await p.evaluate(() => {
  const btn = document.querySelector('a[aria-label="Reservar por WhatsApp"]');
  const b = btn.getBoundingClientRect();
  let solapa = [];
  document.querySelectorAll('footer a').forEach((el) => {
    const rc = el.getBoundingClientRect();
    const choca = !(rc.right < b.left || rc.left > b.right || rc.bottom < b.top || rc.top > b.bottom);
    if (choca) solapa.push(el.textContent.trim().slice(0, 22));
  });
  return { solapa };
});
console.log(`Footer: ${enFooter.solapa.length === 0 ? 'sin solapamiento ✓' : 'SOLAPA con: ' + enFooter.solapa.join(', ')}`);

await b.close();
