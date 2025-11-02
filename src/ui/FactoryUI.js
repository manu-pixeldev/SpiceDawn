export class FactoryUI {
  constructor(hud) {
    this.hud = hud;
    this.visible = false;
    this.factory = null;
  }
  open(factory) { this.visible = true; this.factory = factory; }
  close() { this.visible = false; this.factory = null; }

  click(screenX, screenY) {
    if (!this.visible || !this.factory) return false;
    const bx = 24, by = 620, bw = 200, bh = 46;

    if (screenX >= bx && screenX <= bx + bw && screenY >= by && screenY <= by + bh) {
      if (this.hud.spendSpice(50)) {
        const quad = this.factory.produceQuad();
        // petit feedback visuel côté usine (flash géré par draw usine déjà)
        return true;
      }
    }
    return false;
  }

  draw(ctx) {
    if (!this.visible || !this.factory) return;
    const bx = 24, by = 620, bw = 200, bh = 46;

    ctx.save();
    ctx.shadowColor = "rgba(0,255,255,0.6)";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(bx, by, bw, bh);
    ctx.restore();

    ctx.font = "14px monospace";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#cfefff";
    ctx.fillText("🔧 Produire Quad", bx + 14, by + bh / 2);
    ctx.textAlign = "right";
    ctx.fillText("50", bx + bw - 10, by + bh / 2);
    ctx.textAlign = "left";
  }
}
