export class Projectile {
  constructor(x, y, tx, ty) {
    this.x = x; this.y = y;
    const dx = tx - x, dy = ty - y;
    const d = Math.hypot(dx, dy) || 1;
    this.vx = (dx/d) * 300;
    this.vy = (dy/d) * 300;
    this.life = 0.6; // secondes
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(0,255,255,0.9)";
    ctx.beginPath(); ctx.arc(this.x, this.y, 2, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }

  get dead(){ return this.life <= 0; }
}
