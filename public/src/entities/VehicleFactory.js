import { Quad } from "./Quad.js";

export class VehicleFactory {
  constructor(x, y, hud, map, units) {
    this.x = x; this.y = y;
    this.hud = hud; this.map = map; this.units = units;
    this.fx = 0; this.alpha = 0;
    this.type = "factory";
    this.selected = false;
  }

  update(dt) { this.fx += dt * 2; if (this.alpha < 1) this.alpha += dt * 2; }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.fillRect(-45, -22, 90, 44);
    ctx.fillStyle = "#555"; ctx.fillRect(-45, -25, 90, 50);
    ctx.fillStyle = "#333"; ctx.fillRect(30, -10, 25, 20); // rampe
    const glow = (Math.sin(this.fx)*0.5+0.5)*0.4;
    ctx.fillStyle = `rgba(50,150,255,${glow})`; ctx.fillRect(-25, -6, 50, 12);
    if (this.selected) {
      ctx.strokeStyle = "rgba(0,255,255,0.6)"; ctx.lineWidth = 2;
      ctx.strokeRect(-46,-26,92,52);
    }
    ctx.restore();
  }

  produceQuad() {
    const spawnX = this.x - 30, spawnY = this.y + 28;
    const quad = new Quad(spawnX, spawnY, this.map);
    this.units.push(quad);
    return quad;
  }
}
