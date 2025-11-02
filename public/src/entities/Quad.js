import { Projectile } from "./Projectile.js";

export class Quad {
  constructor(x, y, map) {
    this.x = x; this.y = y; this.map = map;
    this.speed = 110;
    this.target = { x, y };
    this.type = "quad";
    this.selected = false;
    this.fx = 0;
    this.bullets = [];
    this.explosions = []; // impacts locaux (pas besoin d'accès global)
    this.cooldown = 0;
  }

  update(dt) {
    this.fx += dt*3;
    this.cooldown = Math.max(0, this.cooldown - dt);

    const dx = this.target.x - this.x, dy = this.target.y - this.y;
    const d = Math.hypot(dx, dy);
    if (d > 2) { this.x += (dx/d)*this.speed*dt; this.y += (dy/d)*this.speed*dt; }

    // bullets
    for (let i=this.bullets.length-1; i>=0; i--) {
      const b = this.bullets[i];
      b.update(dt);
      if (b.dead) {
        this.explosions.push({ x: b.x, y: b.y, t: 0.2 });
        this.bullets.splice(i,1);
      }
    }
    // explosions
    for (let i=this.explosions.length-1; i>=0; i--) {
      this.explosions[i].t -= dt;
      if (this.explosions[i].t <= 0) this.explosions.splice(i,1);
    }
  }

  fireAt(tx, ty) {
    if (this.cooldown > 0) return;
    this.cooldown = 0.14;
    this.bullets.push(new Projectile(this.x, this.y, tx, ty));
  }

  draw(ctx) {
    ctx.save(); ctx.translate(this.x, this.y);

    ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.fillRect(-10,-7,20,14);
    ctx.fillStyle = this.selected ? "#357" : "#234"; ctx.fillRect(-9,-6,18,12);
    ctx.fillStyle = "#5ad"; ctx.fillRect(-3,-3,6,6);

    const g = (Math.sin(this.fx)*0.5+0.5)*0.25;
    ctx.strokeStyle = `rgba(0,255,255,${g})`; ctx.lineWidth = 2; ctx.strokeRect(-10,-7,20,14);

    ctx.restore();

    this.bullets.forEach(b => b.draw(ctx));
    // impacts
    this.explosions.forEach(e => {
      const a = Math.max(0, e.t/0.2);
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,210,80,${a})`;
      ctx.arc(e.x, e.y, (1-a)*18 + 4, 0, Math.PI*2);
      ctx.fill();
    });
  }
}
