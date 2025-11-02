export class Button {
  constructor(x, y, w, h, label, cost, onClick) {
    this.x = x; this.y = y;
    this.w = w; this.h = h;
    this.label = label;
    this.cost = cost;
    this.onClick = onClick;
    this.hover = false;
  }

  draw(ctx, hud) {
    const canAfford = hud.spice >= this.cost;
    const grad = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.h);
    grad.addColorStop(0, this.hover ? "#3a3a3a" : "#2a2a2a");
    grad.addColorStop(1, "#1a1a1a");

    ctx.fillStyle = grad;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.strokeStyle = canAfford ? (this.hover ? "#00ffe0" : "#00c3ff") : "#555";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.w, this.h);

    ctx.fillStyle = canAfford ? "#fff" : "#777";
    ctx.font = "14px monospace";
    ctx.fillText(this.label, this.x + 10, this.y + 22);
    ctx.fillText(`${this.cost}`, this.x + this.w - 40, this.y + 22);
  }

  checkHover(mx, my) {
    this.hover = mx >= this.x && mx <= this.x + this.w && my >= this.y && my <= this.y + this.h;
  }

  tryClick(mx, my, hud) {
    if (this.hover && hud.spice >= this.cost) {
      this.onClick();
      return true;
    }
    return false;
  }
}
