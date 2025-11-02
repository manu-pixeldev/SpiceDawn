import { GameLoop } from "./engine/GameLoop.js";
import { initInput } from "./engine/Input.js";
import { TileMap } from "./entities/TileMap.js";
import { HUD } from "./ui/HUD.js";
import { MCV } from "./entities/MCV.js";
import { BuildManager } from "./engine/BuildManager.js";
import { BuildMenu } from "./ui/BuildMenu.js";
import { VehicleFactory } from "./entities/VehicleFactory.js";
import { Camera } from "./engine/Camera.js";
import { FactoryUI } from "./ui/FactoryUI.js";

// CANVAS
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = 1280; canvas.height = 768;

const map = new TileMap(20, 12, 64);
const worldW = map.cols * map.tileSize;
const worldH = map.rows * map.tileSize;

const hud = new HUD();
hud.addSpice(150);

const buildings = [];
const units = [];

const buildManager = new BuildManager({ buildings, hud, map, units });
const menu = new BuildMenu(buildManager, hud);
const factoryUI = new FactoryUI(hud);

const mcv = new MCV(600, 400, hud, map, buildManager);
units.push(mcv);

// Camera
const camera = new Camera(canvas.width, canvas.height, worldW, worldH);

// mouse/key states
const mouse = { x: canvas.width/2, y: canvas.height/2 };
const keys = {};
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup",   e => keys[e.key.toLowerCase()] = false);

// Particules
const particles = [];
function spawnEffect(x, y) {
  particles.push({ x, y, r: 0, alpha: 0.8, type: "flash" });
  for (let i = 0; i < 28; i++) {
    const a = Math.random() * Math.PI * 2, s = 40 + Math.random() * 60;
    particles.push({ x, y, vx: Math.cos(a)*s, vy: Math.sin(a)*s*0.6, r: 2 + Math.random()*3, alpha: 0.8, type: "dust" });
  }
}

const world = { canvas, ctx, map, hud, buildings, units, mcv, buildManager, menu, mouse };
buildManager.world = world;

// DRAW SELECTION from input
let drawSelectionOverlay = null;

// INIT INPUT (avec options)
initInput(
  canvas,
  units,
  menu,
  buildManager,
  {
    camera,
    factoryUI,
    keys,
    mouse,
    overlayCtx: ctx,
    drawSelectionHook: (f)=> drawSelectionOverlay = f
  }
);

// UPDATE
function update(dt) {
  camera.update(dt, keys, mouse);
  map.regenerate(dt);
  units.forEach(u => u.update(dt));
  buildings.forEach(b => b.update && b.update(dt));

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    if (p.type === "flash") { p.r += 600*dt; p.alpha -= 1.5*dt; }
    else { p.x += p.vx*dt; p.y += p.vy*dt; p.vy += 40*dt; p.alpha -= 0.6*dt; }
    if (p.alpha <= 0) particles.splice(i, 1);
  }
  hud.update(dt);
}

// RENDER
function render() {
  ctx.fillStyle = "#0a0f20"; ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.save();
  // translate pour caméra
  ctx.translate(-camera.x, -camera.y);

  map.draw(ctx);
  buildings.forEach(b => b.draw(ctx));
  units.forEach(u => u.draw(ctx));

  particles.forEach(p => {
    ctx.beginPath();
    ctx.fillStyle = (p.type==="flash") ? `rgba(255,255,200,${p.alpha})` : `rgba(200,180,100,${p.alpha})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
  });

  ctx.restore();

  // HUD & UI écran (pas affectés par la caméra)
  hud.draw(ctx);
  buildManager.draw(ctx); // le preview est en screen-space déjà translucide
  menu.draw(ctx, mouse.x + camera.x, mouse.y + camera.y); // accepte aussi world coords
  factoryUI.draw(ctx);

  // rectangle sélection overlay
  if (drawSelectionOverlay) drawSelectionOverlay();
}

// hook FX au spawn
const origSpawn = buildManager.spawn.bind(buildManager);
buildManager.spawn = (type, x, y) => { spawnEffect(x,y); origSpawn(type,x,y); };

const loop = new GameLoop(update, render);
loop.start();

// mouse tracking pour caméra edge & input
canvas.addEventListener("mousemove", (e)=>{
  const r = canvas.getBoundingClientRect();
  mouse.x = e.clientX - r.left;
  mouse.y = e.clientY - r.top;
});
