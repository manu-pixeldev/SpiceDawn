export class Camera {
  constructor(w, h, worldW, worldH) {
    this.x = 0; this.y = 0;
    this.w = w; this.h = h;
    this.worldW = worldW; this.worldH = worldH;
    this.speed = 420;
    this.edge = 20;
    this.vx = 0; this.vy = 0;
  }

  clamp() {
    this.x = Math.max(0, Math.min(this.x, this.worldW - this.w));
    this.y = Math.max(0, Math.min(this.y, this.worldH - this.h));
  }

  update(dt, keys, mouse) {
    this.vx = (keys["arrowright"] || keys["d"] ? 1 : 0) - (keys["arrowleft"] || keys["a"] ? 1 : 0);
    this.vy = (keys["arrowdown"]  || keys["s"] ? 1 : 0) - (keys["arrowup"]   || keys["w"] ? 1 : 0);

    if (mouse) {
      if (mouse.x < this.edge) this.vx = -1;
      else if (mouse.x > this.w - this.edge) this.vx = 1;
      if (mouse.y < this.edge) this.vy = -1;
      else if (mouse.y > this.h - this.edge) this.vy = 1;
    }

    this.x += this.vx * this.speed * dt;
    this.y += this.vy * this.speed * dt;
    this.clamp();
  }

  toWorld(sx, sy) { return { x: sx + this.x, y: sy + this.y }; }
  toScreen(wx, wy) { return { x: wx - this.x, y: wy - this.y }; }
}
