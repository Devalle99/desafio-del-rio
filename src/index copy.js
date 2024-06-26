// Declarar rutas a archivos estáticos
const img_player = './assets/player.png';

// Declarar colores
const water_blue = '#1099bb';

// Contenedor de PIXI
const pixi_container = document.getElementById('pixi_container');

// Create the application helper and add its render target to the page
const app = new PIXI.Application();
await app.init({ background: water_blue, resizeTo: pixi_container });
pixi_container.appendChild(app.canvas);

// Create the sprite and add it to the stage
await PIXI.Assets.load(img_player);
let sprite = PIXI.Sprite.from(img_player);
app.stage.addChild(sprite);

// Add a ticker callback to move the sprite back and forth
let elapsed = 0.0;
app.ticker.add((ticker) => {
elapsed += ticker.deltaTime;
sprite.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
});