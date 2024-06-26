import Game from './logic.js';
const GAME = new Game();

// Declare routes to static files
const img_bg = './assets/bg.jpg';
const img_player = './assets/player_md.png';
const img_wolf = './assets/wolf_sm.png';
const img_goat = './assets/goat_sm.png';
const img_cabbage = './assets/cabbage_sm.png';

// Declare color codes
const water_blue = '#1099bb';

// Declare PIXI container
const pixi_container = document.getElementById('pixi_container');

// Create the application helper and add its render target to the page
const app = new PIXI.Application();
await app.init({ background: water_blue, resizeTo: pixi_container });
pixi_container.appendChild(app.canvas);

// Declare reusable points
var points = [
    //  0 -> player
    {
        "ini": new PIXI.Point(app.screen.width / 3, app.screen.height / 2),
        "end": new PIXI.Point((app.screen.width / 3) * 2, app.screen.height / 2)
    },
    // 1 -> cabbage
    {
        "ini": new PIXI.Point(app.screen.width / 5, (app.screen.height / 4) * 3),
        "end": new PIXI.Point((app.screen.width / 5) * 4, (app.screen.height / 4) * 3)
    },
    // 2 -> goat
    {
        "ini": new PIXI.Point(app.screen.width / 5, (app.screen.height / 4) * 2),
        "end": new PIXI.Point((app.screen.width / 5) * 4, (app.screen.height / 4) * 2)
    },
    // 3 -> wolf
    {
        "ini": new PIXI.Point(app.screen.width / 5, app.screen.height / 4),
        "end": new PIXI.Point((app.screen.width / 5) * 4, app.screen.height / 4)
    }
];

// Create the sprites
await PIXI.Assets.load(img_bg);
let bg = PIXI.Sprite.from(img_bg);

await PIXI.Assets.load(img_player);
let player = PIXI.Sprite.from(img_player);

await PIXI.Assets.load(img_wolf);
let wolf = PIXI.Sprite.from(img_wolf);

await PIXI.Assets.load(img_goat);
let goat = PIXI.Sprite.from(img_goat);

await PIXI.Assets.load(img_cabbage);
let cabbage = PIXI.Sprite.from(img_cabbage);

// Set the initial position, size, cursor and event mode
// Background
bg.width = app.screen.width;
bg.height = app.screen.height;

// Player
player.anchor.set(0.5);
player.scale.set(0.6);
player.x = points[0].ini.x;
player.y = points[0].ini.y;
player.cursor = 'pointer';
player.eventMode = 'static';

// Wolf
wolf.anchor.set(0.5);
wolf.scale.set(0.6);
wolf.x = points[3].ini.x;
wolf.y = points[3].ini.y;
wolf.cursor = 'pointer';
wolf.eventMode = 'static';

// Goat
goat.anchor.set(0.5);
goat.scale.set(0.6);
goat.x = points[2].ini.x;
goat.y = points[2].ini.y;
goat.cursor = 'pointer';
goat.eventMode = 'static';

// Cabbage
cabbage.anchor.set(0.5);
cabbage.scale.set(0.6);
cabbage.x = points[1].ini.x;
cabbage.y = points[1].ini.y;
cabbage.cursor = 'pointer';
cabbage.eventMode = 'static';

// Structure to map objects to integers 1, 2, 3
const puzzle_pieces = [null, cabbage, goat, wolf];

// Append sprites to stage
app.stage.addChild(bg);
app.stage.addChild(player);
app.stage.addChild(wolf);
app.stage.addChild(goat);
app.stage.addChild(cabbage);

// Function to move sprite from one point to another
function moveSprite(sprite, from, to) {
    return new Promise((resolve) => {
        let startTime = Date.now();
        let startX = from.x;
        let startY = from.y;
        let deltaX = to.x - from.x;
        let deltaY = to.y - from.y;

        function animate() {
            let currentTime = Date.now();
            let elapsed = currentTime - startTime;
            let progress = Math.min(elapsed / 1000, 1);

            sprite.position.set(
                startX + deltaX * progress,
                startY + deltaY * progress
            );

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                resolve();
            }
        }

        animate();
    });
}

async function onObjectClick(objNumber) {
    // Update GAME.done according to user's input
    let validMove = GAME.move(objNumber);

    // show UI change
    if (validMove) {
        // cross river
        if (player.position.x === points[0].ini.x && player.position.y === points[0].ini.y) {
            if (objNumber !== 0) {
                puzzle_pieces[objNumber].visible = false;
            }
            // Move sprite(s) from start point to end point
            await moveSprite(player, points[0].ini, points[0].end);
            if (objNumber !== 0) {
                puzzle_pieces[objNumber].position.set(points[objNumber].end.x, points[objNumber].end.y);
                puzzle_pieces[objNumber].visible = true;
            }
        } else if (player.position.x === points[0].end.x && player.position.y === points[0].end.y) {
            if (objNumber !== 0) {
                puzzle_pieces[objNumber].visible = false;
            }
            // Move sprite(s) from end point to start point
            await moveSprite(player, points[0].end, points[0].ini);
            if (objNumber !== 0) {
                puzzle_pieces[objNumber].position.set(points[objNumber].ini.x, points[objNumber].ini.y);
                puzzle_pieces[objNumber].visible = true;
            }
        }
    } else {
        // Show alert "Jugador no se encuentra en esta orilla del rio"
        alert("Jugador no se encuentra en esta orilla del rio");
        return;
    }

    // Check if game is over
    if (GAME.done) {
        if (GAME.hasWon) {
            alert('Has ganado');
        } else {
            alert('Has perdido');
        }
    }
}

player.on('pointertap', (event) => {
    onObjectClick(0);
});

wolf.on('pointertap', (event) => {
    onObjectClick(3);
});

goat.on('pointertap', (event) => {
    onObjectClick(2);
});

cabbage.on('pointertap', (event) => {
    onObjectClick(1);
});