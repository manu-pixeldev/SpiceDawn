export class TileMap {
  constructor(cols, rows, tileSize) {
    this.cols = cols; this.rows = rows; this.tileSize = tileSize;
    this.tiles = [];
    for (let y=0; y<rows; y++) {
      this.tiles[y] = [];
      for (let x=0; x<cols; x++) {
        this.tiles[y][x] = Math.random() < 0.15 ? "spice" : "sand";
      }
    }
  }

  draw(ctx) {
    for (let y=0; y<this.rows; y++) {
      for (let x=0; x<this.cols; x++) {
        const t = this.tiles[y][x];
        ctx.fillStyle = t==="spice" ? "#d1a74e" : "#c7b37f";
        ctx.fillRect(x*this.tileSize, y*this.tileSize, this.tileSize, this.tileSize);
      }
    }
  }

  getTileAt(px, py) {
    const tx = Math.floor(px / this.tileSize), ty = Math.floor(py / this.tileSize);
    if (tx<0||ty<0||tx>=this.cols||ty>=this.rows) return null;
    return this.tiles[ty][tx];
  }

  harvest(px, py) {
    const tx = Math.floor(px / this.tileSize), ty = Math.floor(py / this.tileSize);
    if (this.tiles[ty]?.[tx] === "spice") { this.tiles[ty][tx] = "sand"; return 1; }
    return 0;
  }

  // repousse LENTE (~0.1% / sec / tuile)
  regenerate(dt) {
    const p = 0.001 * dt;
    for (let y=0; y<this.rows; y++) {
      for (let x=0; x<this.cols; x++) {
        if (this.tiles[y][x] === "sand" && Math.random() < p) {
          this.tiles[y][x] = "spice";
        }
      }
    }
  }
}
