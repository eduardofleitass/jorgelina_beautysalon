/**
 * Auditoria de interfaz mobile para Jorgelina Coiffure.
 * Detecta: menú atascado, elementos fuera de viewport, overflow horizontal,
 * áreas táctiles pequeñas, solapamientos y problemas de scroll.
 */
import { chromium, devices } from '@playwright/test';

const URL = process.env.URL_AUDITAR || 'http://localhost:5174/';
const problemas = [];
const ok = [];

function reportar(tipo, mensaje) {
  if (tipo === 'ERROR') problemas.push(mensaje);
  else ok.push(mensaje);
  console.log(`[${tipo}] ${mensaje}`);
}

const IPHONE = devices['iPhone 13'];

const browser = await chromium.launch();
const context = await browser.newContext({
  ...IPHONE,
  locale: 'es-PY',
});
const page = await context.newPage();

const erroresConsola = [];
page.on('console', (m) => {
  if (m.type() === 'error') erroresConsola.push(m.text());
});
page.on('pageerror', (e) => erroresConsola.push(String(e)));

await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

const viewport = page.viewportSize();
console.log(`\n=== VIEWPORT: ${viewport.width}x${viewport.height} (${IPHONE.name || 'iPhone 13'}) ===\n`);

/* ---------- 1. Overflow horizontal ---------- */
const overflow = await page.evaluate(() => {
  const docW = document.documentElement.clientWidth;
  const desbordados = [];
  document.querySelectorAll('body *').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && (r.right > docW + 2 || r.left < -2)) {
      const estilo = getComputedStyle(el);
      if (estilo.position === 'fixed') return;
      desbordados.push({
        tag: el.tagName,
        cls: (el.className || '').toString().slice(0, 70),
        left: Math.round(r.left),
        right: Math.round(r.right),
      });
    }
  });
  return { scrollW: document.documentElement.scrollWidth, clientW: docW, desbordados: desbordados.slice(0, 12) };
});

if (overflow.scrollW > overflow.clientW + 2) {
  reportar('ERROR', `Overflow horizontal: scrollWidth=${overflow.scrollW} > clientWidth=${overflow.clientW}`);
  overflow.desbordados.forEach((d) => reportar('ERROR', `  -> ${d.tag}.${d.cls} left=${d.left} right=${d.right}`));
} else {
  reportar('OK', 'Sin overflow horizontal');
}

/* ---------- 2. Menu hamburguesa: abrir y cerrar ---------- */
const botonHamburguesa = page.locator('nav button[aria-label*="menu"]');
if ((await botonHamburguesa.count()) === 0) {
  reportar('ERROR', 'No se encontro el boton hamburguesa');
} else {
  await botonHamburguesa.click();
  await page.waitForTimeout(700);

  const estadoAbierto = await page.evaluate(() => {
    const visibles = [];
    document.querySelectorAll('nav a').forEach((a) => {
      const r = a.getBoundingClientRect();
      const s = getComputedStyle(a);
      if (r.width > 0 && s.visibility !== 'hidden' && s.opacity !== '0' && r.top >= -5 && r.top < window.innerHeight) {
        visibles.push(a.textContent.trim());
      }
    });
    return visibles;
  });
  reportar(estadoAbierto.length > 0 ? 'OK' : 'ERROR',
    `Menu abierto: ${estadoAbierto.length} enlaces visibles [${estadoAbierto.join(', ')}]`);

  // ¿El boton X es clickeable realmente? (test de punto central)
  const xClickable = await page.evaluate(() => {
    const btn = document.querySelector('nav button[aria-label]');
    if (!btn) return { ok: false, motivo: 'boton no existe' };
    const r = btn.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const top = document.elementFromPoint(cx, cy);
    if (!top) return { ok: false, motivo: 'nada en el punto' };
    const esElBoton = btn.contains(top) || top === btn;
    return { ok: esElBoton, motivo: esElBoton ? 'ok' : `${top.tagName}.${(top.className||'').toString().slice(0,60)} tapa el boton` };
  });
  reportar(xClickable.ok ? 'OK' : 'ERROR', `Boton cerrar (X) clickeable: ${xClickable.motivo}`);

  // Intentar cerrar haciendo click en el boton X
  if (xClickable.ok) {
    await botonHamburguesa.click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(700);
    const cerro = await page.evaluate(() => {
      const overlay = document.querySelector('nav > div.fixed.inset-0');
      if (!overlay) return 'sin-overlay';
      const s = getComputedStyle(overlay);
      return s.visibility === 'hidden' || s.opacity === '0' ? 'cerrado' : 'abierto';
    });
    reportar(cerro === 'cerrado' ? 'OK' : 'ERROR', `Estado tras click en X: ${cerro}`);
  } else {
    // Forzar cierre con Escape para continuar la auditoria
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    reportar('ERROR', 'NO se puede cerrar el menu con el boton X (tapado por el overlay)');
  }

  // Scroll del body bloqueado residual
  const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
  reportar(bodyOverflow === '' || bodyOverflow === 'visible' ? 'OK' : 'ERROR',
    `body.style.overflow tras cerrar: "${bodyOverflow}"`);
}

/* ---------- 3. Areas tactiles pequeñas (< 44px recomendado) ---------- */
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
const tactiles = await page.evaluate(() => {
  const chicos = [];
  document.querySelectorAll('a, button, select, input').forEach((el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    if (r.width === 0 || s.display === 'none' || s.visibility === 'hidden') return;
    if (r.top < 0 || r.top > window.innerHeight) return;
    if (r.height < 40 && r.width > 0) {
      chicos.push({ txt: (el.textContent || el.name || el.type || '').trim().slice(0, 24), w: Math.round(r.width), h: Math.round(r.height) });
    }
  });
  return chicos.slice(0, 15);
});
if (tactiles.length) {
  tactiles.forEach((t) => reportar('WARN', `Area tactil chica: "${t.txt}" ${t.w}x${t.h}px`));
} else {
  reportar('OK', 'Sin areas tactiles pequenas visibles');
}

/* ---------- 4. Alturas de secciones y elementos cortados ---------- */
const cortados = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll('section, h1, h2, h3, form, img').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0) return;
    if (r.right > document.documentElement.clientWidth + 2) {
      out.push({ tag: el.tagName, txt: (el.textContent || '').trim().slice(0, 30), right: Math.round(r.right) });
    }
  });
  return out.slice(0, 10);
});
if (cortados.length) {
  cortados.forEach((c) => reportar('ERROR', `Elemento cortado a la derecha: ${c.tag} "${c.txt}" right=${c.right}`));
} else {
  reportar('OK', 'Ningun elemento cortado a la derecha');
}

/* ---------- 5. Navegacion por anchors ---------- */
const anchors = ['#inicio', '#servicios', '#galeria', '#nosotros', '#contacto'];
for (const a of anchors) {
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView();
  }, a);
  await page.waitForTimeout(250);
  const existe = await page.evaluate((sel) => !!document.querySelector(sel), a);
  reportar(existe ? 'OK' : 'ERROR', `Anchor ${a} ${existe ? 'existe' : 'NO EXISTE'}`);
}

/* ---------- 6. Formulario de reserva en mobile ---------- */
await page.evaluate(() => document.querySelector('#contacto')?.scrollIntoView());
await page.waitForTimeout(400);
const form = await page.evaluate(() => {
  const f = document.querySelector('form');
  if (!f) return { existe: false };
  const campos = Array.from(f.querySelectorAll('input, select, textarea')).map((e) => {
    const r = e.getBoundingClientRect();
    return { name: e.name || e.type, w: Math.round(r.width), h: Math.round(r.height) };
  });
  const boton = f.querySelector('button[type="submit"]');
  const rb = boton ? boton.getBoundingClientRect() : null;
  return {
    existe: true,
    campos,
    boton: rb ? { w: Math.round(rb.width), h: Math.round(rb.height) } : null,
  };
});
if (form.existe) {
  form.campos.forEach((c) => {
    reportar(c.w > 100 ? 'OK' : 'ERROR', `Campo ${c.name}: ${c.w}x${c.h}px`);
  });
  if (form.boton) reportar(form.boton.h >= 40 ? 'OK' : 'ERROR', `Boton submit: ${form.boton.w}x${form.boton.h}px`);
} else {
  reportar('ERROR', 'No se encontro el formulario');
}

/* ---------- 7. WhatsApp flotante ---------- */
const wa = await page.evaluate(() => {
  const a = document.querySelector('a[aria-label*="WhatsApp"]');
  if (!a) return { existe: false };
  const r = a.getBoundingClientRect();
  return { existe: true, w: Math.round(r.width), h: Math.round(r.height), bot: Math.round(window.innerHeight - r.bottom), right: Math.round(window.innerWidth - r.right) };
});
reportar(wa.existe ? 'OK' : 'ERROR', `Boton WhatsApp flotante: ${wa.existe ? `${wa.w}x${wa.h}px, ${wa.bot}px del fondo` : 'NO EXISTE'}`);

/* ---------- 8. Errores de consola ---------- */
if (erroresConsola.length) {
  erroresConsola.slice(0, 8).forEach((e) => reportar('ERROR', `Consola: ${e.slice(0, 120)}`));
} else {
  reportar('OK', 'Sin errores de consola');
}

/* ---------- 9. Verificacion de cierre correcto del menu ---------- */
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
const btn = page.locator('nav button[aria-label]');
if ((await btn.count()) > 0) {
  // Abrir
  await btn.first().click();
  await page.waitForTimeout(500);
  const abierto = await page.evaluate(() => {
    const o = document.querySelector('#menu-mobile');
    return o ? getComputedStyle(o).visibility === 'visible' : false;
  });

  if (abierto) {
    // Verificar que el boton sea clickeable (no tapado)
    const clickeable = await page.evaluate(() => {
      const b = document.querySelector('nav button[aria-label]');
      const r = b.getBoundingClientRect();
      const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return b.contains(top) || top === b;
    });
    reportar(clickeable ? 'OK' : 'ERROR', `Boton cerrar accesible: ${clickeable}`);

    // Cerrar con click real
    await btn.first().click();
    await page.waitForTimeout(500);
    const estadoFinal = await page.evaluate(() => {
      const o = document.querySelector('#menu-mobile');
      const s = o ? getComputedStyle(o) : null;
      return {
        visible: s ? s.visibility === 'visible' : false,
        opacidad: s ? s.opacity : null,
        bodyOverflow: document.body.style.overflow,
        label: document.querySelector('nav button[aria-label]')?.getAttribute('aria-label'),
      };
    });
    reportar(!estadoFinal.visible ? 'OK' : 'ERROR', `Menu cerrado tras click: ${!estadoFinal.visible}`);
    reportar(estadoFinal.bodyOverflow === '' ? 'OK' : 'ERROR', `Scroll del body restaurado: "${estadoFinal.bodyOverflow}"`);
    reportar(estadoFinal.label === 'Abrir menu' ? 'OK' : 'ERROR', `aria-label correcto: "${estadoFinal.label}"`);

    // El boton X debe existir mientras abierto
    await btn.first().click();
    await page.waitForTimeout(400);
    const hayX = await page.evaluate(() => {
      const b = document.querySelector('nav button[aria-label="Cerrar menu"]');
      return !!b && b.querySelector('svg') !== null;
    });
    reportar(hayX ? 'OK' : 'ERROR', `Icono X visible con menu abierto: ${hayX}`);
    await btn.first().click(); // cerrar
    await page.waitForTimeout(400);
  }
}

/* ---------- 10. Auditoria de todas las secciones en mobile ---------- */
const secciones = await page.evaluate(() => {
  const res = [];
  document.querySelectorAll('section').forEach((sec) => {
    const r = sec.getBoundingClientRect();
    const el = sec.querySelector('h1, h2, h3');
    const titulo = el ? el.textContent.trim().slice(0, 40) : '(sin titulo)';
    // Detectar texto que desborda su contenedor
    let desborda = false;
    sec.querySelectorAll('*').forEach((c) => {
      if (c.children.length === 0 && c.textContent.trim()) {
        if (c.scrollWidth > c.clientWidth + 3) desborda = true;
      }
    });
    res.push({
      id: sec.id || '(sin id)',
      titulo,
      alto: Math.round(r.height),
      desborda,
    });
  });
  return res;
});
secciones.forEach((s) => {
  reportar(s.desborda ? 'ERROR' : 'OK', `Seccion #${s.id} "${s.titulo}" alto=${s.alto}px desborda=${s.desborda}`);
});

/* ---------- 11. Imagenes de la galeria en mobile ---------- */
const galeria = await page.evaluate(() => {
  const imgs = Array.from(document.querySelectorAll('#galeria img'));
  return imgs.map((i) => {
    const r = i.getBoundingClientRect();
    return { alt: i.alt.slice(0, 28), w: Math.round(r.width), h: Math.round(r.height), cargada: i.complete && i.naturalWidth > 0 };
  });
});
const rotas = galeria.filter((g) => !g.cargada);
reportar(rotas.length === 0 ? 'OK' : 'ERROR', `Galeria: ${galeria.length} imagenes, ${rotas.length} sin cargar`);
if (galeria.length) {
  const primera = galeria[0];
  reportar(primera.w > 100 ? 'OK' : 'ERROR', `Imagen galeria: ${primera.w}x${primera.h}px`);
}

/* ---------- Resumen ---------- */
console.log(`\n=== RESUMEN ===`);
console.log(`Problemas: ${problemas.length}`);
console.log(`OK: ${ok.length}`);
if (problemas.length) {
  console.log('\n--- ERRORES / WARNINGS ---');
  [...problemas].forEach((p, i) => console.log(`${i + 1}. ${p}`));
}

await browser.close();
