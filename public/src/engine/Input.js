export function initInput(canvas, units, menu, buildManager, opts = {}) {
  const cam = opts.camera;
  const factoryUI = opts.factoryUI;
  const keys = opts.keys;

  let selected = [];
  let drag = null; // {sx,sy, wx,wy}

  const screenToWorld = (sx, sy) => cam ? cam.toWorld(sx, sy) : { x: sx, y: sy };

  canvas.addEventListener("mousemove", (e) => {
    const r = canvas.getBoundingClientRect();
    const sx = e.clientX - r.left, sy = e.clientY - r.top;
    const { x, y } = screenToWorld(sx, sy);

    if (buildManager && buildManager.active) buildManager.onMouseMove(x, y);

    if (drag) {
      drag.wx2 = x; drag.wy2 = y;
    }

    // pour edge-scroll (Camera)
    if (opts.mouse) { opts.mouse.x = sx; opts.mouse.y = sy; }
  });

  canvas.addEventListener("mousedown", (e) => {
    const r = canvas.getBoundingClientRect();
    const sx = e.clientX - r.left, sy = e.clientY - r.top;
    const { x: mx, y: my } = screenToWorld(sx, sy);

    if (e.button === 0) {
      // UI usine ?
      if (factoryUI && factoryUI.visible && factoryUI.click(sx, sy)) return;

      // UI build ?
      if (menu && menu.visible && menu.click(mx, my)) return;

      if (buildManager.active) { buildManager.confirm(); return; }

      // start drag select
      drag = { sx, sy, wx1: mx, wy1: my, wx2: mx, wy2: my };

      // si ctrl non enfoncé, clear sélection immédiate (on confirmera au mouseup)
      if (!e.ctrlKey) {
        selected.forEach(u => u.selected = false);
        selected = [];
      }
    }

    if (e.button === 2) {
      e.preventDefault();

      // annuler preview
      if (buildManager.active) { buildManager.cancel(true); return; }

      // tir ALT + clic droit pour quads multi-sélection
      if (e.altKey) {
        selected.filter(u => u.type === "quad" && typeof u.fireAt === "function")
                .forEach(q => q.fireAt(mx, my));
        return;
      }

      // move pour tous les sélectionnés (MCV compris)
      const spread = 18;
      let idx = 0;
      selected.forEach(u => {
        const ox = ((idx % 3) - 1) * spread;
        const oy = (Math.floor(idx / 3) - 1) * spread;
        u.target = { x: mx + ox, y: my + oy };
        idx++;
      });

      menu.toggle(false);
      if (factoryUI) factoryUI.close();
    }
  });

  window.addEventListener("mouseup", (e) => {
    if (!drag) return;
    const r = canvas.getBoundingClientRect();
    const sx = e.clientX - r.left, sy = e.clientY - r.top;
    const { x: mx2, y: my2 } = screenToWorld(sx, sy);

    const x1 = Math.min(drag.wx1, drag.wx2);
    const y1 = Math.min(drag.wy1, drag.wy2);
    const x2 = Math.max(drag.wx1, drag.wx2);
    const y2 = Math.max(drag.wy1, drag.wy2);

    // click simple (petit rectangle) => sélection au clic
    const clickLike = Math.hypot(drag.wx2 - drag.wx1, drag.wy2 - drag.wy1) < 4;

    if (clickLike) {
      // sélection au clic (priorité unités)
      let hit = null;
      for (const u of units) {
        const d = Math.hypot(u.x - mx2, u.y - my2);
        if (d < 18) { hit = u; break; }
      }
      if (hit) {
        hit.selected = true;
        selected.push(hit);
        // ouvrir menu MCV / UI usine
        if (hit.type === "mcv") { menu.toggle(true); menu.setTarget(hit); if (factoryUI) factoryUI.close(); }
        else if (hit.type === "factory" && factoryUI) { factoryUI.open(hit); menu.toggle(false); }
        else { menu.toggle(false); if (factoryUI) factoryUI.close(); }
      } else {
        // clic vide
        menu.toggle(false);
        if (factoryUI) factoryUI.close();
      }
    } else {
      // sélection par rectangle (monde)
      units.forEach(u => {
        const inside = (u.x >= x1 && u.x <= x2 && u.y >= y1 && u.y <= y2);
        if (inside) { u.selected = true; selected.push(u); }
      });
      // si MCV seulement => ouvrir menu
      if (selected.length === 1 && selected[0].type === "mcv") { menu.toggle(true); menu.setTarget(selected[0]); if (factoryUI) factoryUI.close(); }
      else { menu.toggle(false); if (factoryUI) factoryUI.close(); }
    }

    drag = null;
  });

  // dessin du rectangle de sélection (hook simple)
  const overlayCtx = opts.overlayCtx;
  function drawSelection() {
    if (!drag || !overlayCtx) return;
    const x = Math.min(drag.sx, opts.mouse.x);
    const y = Math.min(drag.sy, opts.mouse.y);
    const w = Math.abs(opts.mouse.x - drag.sx);
    const h = Math.abs(opts.mouse.y - drag.sy);
    overlayCtx.save();
    overlayCtx.strokeStyle = "rgba(0,255,255,0.8)";
    overlayCtx.lineWidth = 1;
    overlayCtx.setLineDash([6, 4]);
    overlayCtx.strokeRect(x, y, w, h);
    overlayCtx.fillStyle = "rgba(0,255,255,0.15)";
    overlayCtx.fillRect(x, y, w, h);
    overlayCtx.restore();
  }
  // expose
  if (opts.drawSelectionHook) opts.drawSelectionHook(drawSelection);

  canvas.oncontextmenu = (e) => e.preventDefault();
}
