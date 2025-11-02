export class HUD {
  constructor() {
    this.spice = 200;
    this.buildMsg = "";
    this.buildMsgTimer = 0;
  }
  addSpice(n){ this.spice += n; }
  spendSpice(cost){ if (this.spice>=cost){ this.spice-=cost; return true;} return false; }

  showBuildMsg(txt){
    this.buildMsg = txt; this.buildMsgTimer = 1.5;
  }
  update(dt){
    if (this.buildMsgTimer>0) this.buildMsgTimer -= dt;
  }

  draw(ctx){
    ctx.fillStyle = "#000000aa"; ctx.fillRect(10,10,190,42);
    ctx.fillStyle = "#ffcc33"; ctx.beginPath(); ctx.arc(28,31,6,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.font = "16px monospace";
    ctx.fillText("Spice: " + Math.floor(this.spice), 44, 36);

    if (this.buildMsgTimer>0){
      ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(420,10,440,36);
      ctx.fillStyle = "#00ffe0"; ctx.font = "16px monospace";
      ctx.fillText(this.buildMsg, 436, 34);
    }
  }
}
