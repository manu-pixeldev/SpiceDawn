import { Refinery } from "../entities/Refinery.js";
import { VehicleFactory } from "../entities/VehicleFactory.js";

export class BuildManager {
  constructor(world) {
    this.world = world;
    this.active = false;
    this.type = null;
    this.cost = 0;
    this.previewColor = "rgba(255,255,255,0.3)";
    this.x = 0; this.y = 0;
  }

  start(type, cost) {
    this.active = true; this.type = type; this.cost = cost;
    this.previewColor = type==="refinery" ? "rgba(255,200,50,0.4)" : "rgba(100,150,255,0.4)";
  }

  cancel(refund) { if (refund) this.world.hud.addSpice(this.cost); this.active = false; }

  onMouseMove(x, y) {
    if (!this.active) return;
    this.x = Math.floor(x / 64) * 64 + 32;
    this.y = Math.floor(y / 64) * 64 + 32;
  }

  confirm() {
    if (!this.active) return;
    const { mcv } = this.world;

    if (!this.world.hud.spendSpice(this.cost)) { // ❗un seul endroit où on dépense
      console.warn("❌ Pas assez de spice !");
      this.cancel(false); return;
    }

    mcv.queueBuild({ x: this.x, y: this.y, type: this.type, cost: this.cost });
    this.active = false;
  }

  draw(ctx) {
    if (!this.active) return;
    ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = this.previewColor;
    ctx.fillRect(this.x-32, this.y-32, 64, 64); ctx.restore();
  }

  // appelé par le MCV quand le timer termine
  spawn(type, x, y) {
    console.log("🚧 Spawn demandé :", type, "à", x, y);
    const { buildings, hud, map, units } = this.world;
    if (type === "refinery") { buildings.push(new Refinery(x, y, hud, map, units)); console.log("✅ Raffinerie construite !"); }
    if (type === "factory")  { buildings.push(new VehicleFactory(x, y, hud, map, units)); console.log("✅ Usine construite !"); }
  }
}
