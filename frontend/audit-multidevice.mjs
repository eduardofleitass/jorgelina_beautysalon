import { chromium, devices } from '@playwright/test';

const URL = 'http://localhost:5174/';
const DISPOSITIVOS = [
  ['iPhone SE (chico)', devices['iPhone SE']],
  ['iPhone 13', devices['iPhone 13']],
  ['iPhone 13 Pro Max', devices['iPhone 13 Pro Max']],
  ['Galaxy S9+ (Android)', devices['Galaxy S9+']],
  ['Pixel 5 (Android)', devices['Pixel 5']],
  ['iPad Mini (tablet)', devices['iPad Mini']],
];

const todos = [];

for (const [nombre, dev] of DISPOSITIVOS) {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...dev, locale: 'es-PY' });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e).slice(0, 80)));

  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.waitForTimeout(900);

  const r = await p.evaluate(() => {
    const docW = document.documentElement.clientWidth;
    // overflow
    const overflow = document.documentElement.scrollWidth > docW + 2;
    // elementos fuera
    let fuera = 0;
    document.querySelectorAll('body *').forEach((el) => {
      const rc = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      if (rc.width > 0 && s.position !== 'fixed' && rc.right > docW + 2) fuera++;
    });
    // boton hamburguesa visible?
    const btn = document.querySelector('nav button[aria-label]');
    const btnVisible = btn ? getComputedStyle(btn).display !== 'none' : false;
    const esMobile = docW < 768;
    return { docW, docH: document.documentElement.clientHeight, overflow, fuera, btnVisible, esMobile };
  });

  // Probar menu en cada dispositivo
  let menuOk = 'n/a';
  if (r.esMobile && r.btnVisible) {
    const btn = p.locator('nav button[aria-label]').first();
    await btn.click();
    await p.waitForTimeout(600);
    const abierto = await p.evaluate(() => {
      const o = document.querySelector('#menu-mobile');
      return o ? getComputedStyle(o).visibility === 'visible' : false;
    });
    const clickeable = await p.evaluate(() => {
      const b = document.querySelector('nav button[aria-label]');
      if (!b) return false;
      const rc = b.getBoundingClientRect();
      const t = document.elementFromPoint(rc.left + rc.width / 2, rc.top + rc.height / 2);
      return b.contains(t) || t === b;
    });
    await btn.click();
    await p.waitForTimeout(600);
    const cerrado = await p.evaluate(() => {
      const o = document.querySelector('#menu-mobile');
      const ov = document.body.style.overflow;
      return { visible: o ? getComputedStyle(o).visibility === 'visible' : false, bodyOverflow: ov };
    });
    const ok = abierto && clickeable && !cerrado.visible && cerrado.bodyOverflow === '';
    menuOk = ok ? 'OK' : `FALLA (abierto=${abierto} x-c=Ck=${clickeable} cerrado=${!cerrado.visible} overflow="${cerrado.bodyOverflow}")`;
  }

  todos.push({
    nombre,
    w: r.docW,
    h: r.docH,
    overflow: r.overflow ? 'SI' : 'no',
    fueraViewport: r.fuera,
    hamburguesa: r.btnVisible ? 'visible' : 'oculta (desktop)',
    menu: menuOk,
    erroresJS: errs.length,
  });

  console.log(`\n--- ${nombre} (${r.docW}x${r.docH}) ---`);
  console.log(`  Overflow horizontal: ${r.overflow ? 'SI ⚠' : 'no ✓'}`);
  console.log(`  Elementos fuera del viewport: ${r.fuera}`);
  console.log(`  Boton hamburguesa: ${r.btnVisible ? 'visible' : 'oculto (layout desktop)'}`);
  console.log(`  Menu abrir/cerrar: ${menuOk}`);
  console.log(`  Errores JS: ${errs.length}`);

  await b.close();
}

console.log('\n\n=== TABLA RESUMEN ===');
console.table(todos);
