export class MCV {
  constructor(x, y, hud, map, buildManager) {
    this.x = x; this.y = y;
    this.target = { x, y };
    this.speed = 90;
    this.hud = hud; this.map = map; this.buildManager = buildManager;
    this.buildQueue = null; this.buildTimer = 0;
    this.active = true; this.fx = 0;
    this.selected = false; this.type = "mcv";
  }

  update(dt) {
    if (!this.active) return;
    this.fx += dt * 3;

    const dx = this.target.x - this.x, dy = this.target.y - this.y;
    const dist = Math.hypot(dx, dy);

    if (this.buildQueue) {
      if (dist > 4) { this.x += (dx/dist)*this.speed*dt; this.y += (dy/dist)*this.speed*dt; }
      else {
        this.buildTimer += dt;
        if (this.buildTimer > 2.5) {
          this.buildManager.spawn(this.buildQueue.type, this.buildQueue.x, this.buildQueue.y);
          this.buildQueue = null; this.buildTimer = 0;
        }
      }
    } else if (dist > 2) {
      this.x += (dx/dist)*this.speed*dt; this.y += (dy/dist)*this.speed*dt;
    }
  }

  draw(ctx) {
    ctx.save(); ctx.translate(this.x, this.y);
    ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.fillRect(-16,-12,32,24);
    ctx.fillStyle = this.selected ? "#005566" : "#003344"; ctx.fillRect(-14,-10,28,20);
    const glow = (Math.sin(this.fx)*0.5+0.5)*0.3;
    ctx.strokeStyle = `rgba(0,255,255,${glow})`; ctx.lineWidth = 3; ctx.strokeRect(-16,-12,32,24);
    ctx.restore();
  }

  queueBuild(b) { this.buildQueue = b; this.target.x = b.x; this.target.y = b.y; this.buildTimer = 0; }
}
