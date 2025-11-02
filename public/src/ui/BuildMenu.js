export class BuildMenu {
  constructor(buildManager, hud) {
    this.buildManager = buildManager;
    this.hud = hud;
    this.visible = false;
    this.target = null;
    this.buttons = [
      { label:"🏭 Raffinerie", type:"refinery", cost:100 },
      { label:"⚙️ Usine",      type:"factory",  cost:150 },
    ];
  }
  toggle(v){ this.visible = v; }
  setTarget(t){ this.target = t; }

  click(x,y){
    if(!this.visible) return false;
    const bx=1040, by=600, bw=200, bh=45, gap=12;
    for(let i=0;i<this.buttons.length;i++){
      const top = by + i*(bh+gap);
      if(x>=bx&&x<=bx+bw&&y>=top&&y<=top+bh){
        // on ne dépense rien ici — le BuildManager.confirm() s’en charge
        const btn = this.buttons[i];
        this.buildManager.start(btn.type, btn.cost);
        this.toggle(false);
        return true;
      }
    }
    return false;
  }

  draw(ctx, mx, my){
    if(!this.visible) return;
    const bx=1040, by=600, bw=200, bh=45, gap=12;

    ctx.font="14px monospace";
    ctx.textBaseline="middle";

    for(let i=0;i<this.buttons.length;i++){
      const b=this.buttons[i]; const y=by+i*(bh+gap);
      const afford = this.hud.spice >= b.cost;

      ctx.save();
      ctx.shadowColor="rgba(0,255,255,0.6)"; ctx.shadowBlur=14;
      ctx.fillStyle = afford ? "rgba(0,0,0,0.75)" : "rgba(60,60,60,0.5)";
      ctx.fillRect(bx, y, bw, bh);
      ctx.restore();

      ctx.fillStyle = afford ? "#cfefff" : "#888";
      ctx.textAlign="left"; ctx.fillText(b.label, bx+14, y+bh/2);
      ctx.textAlign="right"; ctx.fillText(b.cost, bx+bw-10, y+bh/2);
    }
  }
}
