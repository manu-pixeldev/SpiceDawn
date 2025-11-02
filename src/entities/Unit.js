export class Unit {
  constructor(x, y, map, hud, refinery) {
    this.x = x; this.y = y;
    this.map = map; this.hud = hud; this.refinery = refinery;
    this.speed = 40; // plus lent, plus “lourd”
    this.target = { x, y };
    this.cargo = 0; this.maxCargo = 100;
    this.returning = false;
    this.type = "harvester";
  }

  update(dt) {
    const dx = this.target.x - this.x, dy = this.target.y - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 2) {
      this.x += (dx/dist)*this.speed*dt; this.y += (dy/dist)*this.speed*dt;
    } else {
      // sur place
      if (!this.returning && this.map.getTileAt(this.x, this.y) === "spice") {
        // récolte lente, +feedback immédiat
        const gained = this.map.harvest(this.x, this.y);     // 0 ou 1
        this.cargo += gained * 10;
        if (this.cargo >= this.maxCargo) {
          this.returning = true;
          this.target = { x: this.refinery.x, y: this.refinery.y };
        } else {
          this.findNearestSpice();
        }
      } else if (this.returning && dist < 18) {
        // décharge
        if (this.cargo > 0) this.hud.addSpice(this.cargo);
        this.cargo = 0; this.returning = false;
        this.findNearestSpice();
      } else if (!this.returning) {
        // pas de spice sous elle -> aller au plus proche
        this.findNearestSpice();
      }
    }
  }

  findNearestSpice() {
    let best = null, bestD = Infinity, s = this.map.tileSize;
    for (let y=0; y<this.map.rows; y++) {
      for (let x=0; x<this.map.cols; x++) {
        if (this.map.tiles[y][x] === "spice") {
          const wx = x*s + s/2, wy = y*s + s/2;
          const d = Math.hypot(wx - this.x, wy - this.y);
          if (d < bestD) { bestD = d; best = { x: wx, y: wy }; }
        }
      }
    }
    if (best) this.target = best;
  }

  draw(ctx) {
    ctx.save(); ctx.translate(this.x, this.y);
    ctx.fillStyle = "#0a3f35"; ctx.fillRect(-9,-7,18,14);
    // jauge de cargo
    const r = this.cargo / this.maxCargo;
    ctx.fillStyle = "rgba(255,230,80,0.7)"; ctx.fillRect(-9,-11,18*r,3);
    ctx.restore();
  }
}
