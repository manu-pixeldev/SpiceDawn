import { Projectile } from "./Projectile.js";

export class EnemyTank {
  constructor(x, y, targetUnits) {
    this.x = x;
    this.y = y;
    this.speed = 40;
    this.range = 150;
    this.fireCooldown = 0;
    this.projectiles = [];
    this.targetUnits = targetUnits;

    // pour mouvement aléatoire
    this.target = { x: x + Math.random() * 200 - 100, y: y + Math.random() * 200 - 100 };
  }

  update(dt) {
    // mouvement de patrouille
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 5) {
      this.x += (dx / dist) * this.speed * dt;
      this.y += (dy / dist) * this.speed * dt;
    } else if (Math.random() < 0.02) {
      // change de direction aléatoirement
      this.target = { x: this.x + Math.random() * 400 - 200, y: this.y + Math.random() * 400 - 200 };
    }

    // vérifie si un harvester est proche
    for (const u of this.targetUnits) {
      const dux = u.x - this.x;
      const duy = u.y - this.y;
      const d = Math.hypot(dux, duy);
      if (d < this.range) {
        this.fireCooldown -= dt;
        if (this.fireCooldown <= 0) {
          this.fireCooldown = 1.5;
          this.projectiles.push(new Projectile(this.x, this.y, u));
        }
      }
    }

    // update projectiles
    this.projectiles.forEach((p) => p.update(dt));
    this.projectiles = this.projectiles.filter((p) => !p.dead);
  }

  draw(ctx) {
    // tank rouge
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = "#880000";
    ctx.beginPath();
    ctx.rect(-12, -8, 24, 16);
    ctx.fill();

    // canon
    ctx.fillStyle = "#550000";
    ctx.fillRect(10, -3, 10, 6);
    ctx.restore();

    // projectiles
    this.projectiles.forEach((p) => p.draw(ctx));
  }
}
