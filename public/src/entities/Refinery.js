import { Unit } from "./Unit.js";

export class Refinery {
  constructor(x, y, hud, map, units) {
    this.x = x; this.y = y; this.hud = hud; this.map = map; this.units = units;
    this.alpha = 0; this.fx = 0; this.spawned = false;
  }

  update(dt) {
    if (this.alpha < 1) this.alpha += 2*dt;
    this.fx += 3*dt;
    if (!this.spawned && this.alpha >= 1) {
      this.spawned = true;
      const harv = new Unit(this.x - 80, this.y + 36, this.map, this.hud, this);
      this.units.push(harv);
      harv.findNearestSpice(); // direct au gisement le plus proche
    }
  }

  draw(ctx) {
    ctx.save(); ctx.globalAlpha = this.alpha; ctx.translate(this.x, this.y);
    ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.fillRect(-40,-22,80,44);
    ctx.fillStyle = "#6d6d6d"; ctx.fillRect(-40,-25,80,50);
    ctx.fillStyle = "#999"; ctx.fillRect(10,-45,15,20);
    const g = (Math.sin(this.fx)*0.5+0.5)*0.4;
    ctx.fillStyle = `rgba(255,200,50,${g})`; ctx.beginPath(); ctx.arc(0,10,26,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }
}
