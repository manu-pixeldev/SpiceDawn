export class GameLoop {
  constructor(update, render) {
    this.update = update;
    this.render = render;
    this.lastTime = 0;
  }

  start() {
    const loop = (time) => {
      const delta = time - this.lastTime;
      this.lastTime = time;
      this.update(delta / 1000);
      this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}
