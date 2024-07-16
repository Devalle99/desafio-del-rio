import Game from './logic.js';
let GAME = null;

// Declare routes to static files
const img_bg = './assets/bg.jpg';
const img_banner = './assets/banner.png';
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
        "ini": new PIXI.Point(
            app.screen.width / 5 * 2,
            app.screen.height / 2
        ),
        "end": new PIXI.Point(
            (app.screen.width / 5) * 3,
            app.screen.height / 2
        )
    },
    // 1 -> cabbage
    {
        "ini": new PIXI.Point(
            (app.screen.width / 5) - app.screen.width / 12,
            (app.screen.height / 7) * 6
        ),
        "end": new PIXI.Point(
            (app.screen.width / 5) * 4 + app.screen.width / 12,
            (app.screen.height / 7) * 6
        )
    },
    // 2 -> goat
    {
        "ini": new PIXI.Point(
            (app.screen.width / 5), 
            (app.screen.height / 7) * 5
        ),
        "end": new PIXI.Point(
            (app.screen.width / 5) * 4, 
            (app.screen.height / 7) * 5
        )
    },
    // 3 -> wolf
    {
        "ini": new PIXI.Point(
            (app.screen.width / 5) + app.screen.width / 12,
            (app.screen.height / 7) * 4
        ),
        "end": new PIXI.Point(
            (app.screen.width / 5) * 4 - app.screen.width / 12,
            (app.screen.height / 7) * 4
        )
    }
];

// Create the sprites
await PIXI.Assets.load(img_bg);
let bg = PIXI.Sprite.from(img_bg);

await PIXI.Assets.load(img_banner);
let banner = PIXI.Sprite.from(img_banner);

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

// Banner
banner.anchor.set(0.5);
banner.scale.set(0.6);
banner.x = app.screen.width / 2;
banner.y = app.screen.height / 6;

// Player
player.anchor.set(0.5);
player.scale.set(0.6);
player.cursor = 'pointer';
player.eventMode = 'static';

// Wolf
wolf.anchor.set(0.5);
wolf.scale.set(0.6);
wolf.cursor = 'pointer';
wolf.eventMode = 'static';

// Goat
goat.anchor.set(0.5);
goat.scale.set(0.6);
goat.cursor = 'pointer';
goat.eventMode = 'static';

// Cabbage
cabbage.anchor.set(0.5);
cabbage.scale.set(0.6);
cabbage.cursor = 'pointer';
cabbage.eventMode = 'static';

// Structure to map objects to integers 1, 2, 3
const puzzle_pieces = [null, cabbage, goat, wolf];

// Append sprites to stage
app.stage.addChild(bg);
app.stage.addChild(banner);
app.stage.addChild(player);
app.stage.addChild(wolf);
app.stage.addChild(goat);
app.stage.addChild(cabbage);

// Initialize scenario
resetScenario();

// Function to move sprite from one point to another
function moveSprite(sprite, from, to, callback) {
    let startTime = Date.now();
    let startX = from.x;
    let startY = from.y;
    let deltaX = to.x - from.x;
    let deltaY = to.y - from.y;

    function animate() {
        let currentTime = Date.now();
        let elapsed = currentTime - startTime;
        let progress = Math.min(elapsed / 700, 1);

        sprite.position.set(
            startX + deltaX * progress,
            startY + deltaY * progress
        );

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            if (callback) callback();
        }
    }

    animate();
}

function onObjectClick(objNumber) {
    // Update GAME.done according to user's input
    let validMove = GAME.move(objNumber);

    // show UI change
    if (validMove) {
        // Find out on what side of the river the player is at
        if (player.position.x === points[0].ini.x && player.position.y === points[0].ini.y) {
            if (objNumber !== 0) {
                puzzle_pieces[objNumber].visible = false;
            }
            // Move sprite(s) from start point to end point
            moveSprite(player, points[0].ini, points[0].end, () => {
                if (objNumber !== 0) {
                    puzzle_pieces[objNumber].position.set(points[objNumber].end.x, points[objNumber].end.y);
                    puzzle_pieces[objNumber].visible = true;
                }
                setTimeout(checkGameState, 100);
            });
        } else if (player.position.x === points[0].end.x && player.position.y === points[0].end.y) {
            if (objNumber !== 0) {
                puzzle_pieces[objNumber].visible = false;
            }
            // Move sprite(s) from end point to start point
            moveSprite(player, points[0].end, points[0].ini, () => {
                if (objNumber !== 0) {
                    puzzle_pieces[objNumber].position.set(points[objNumber].ini.x, points[objNumber].ini.y);
                    puzzle_pieces[objNumber].visible = true;
                }
                setTimeout(checkGameState, 100);
            });
        }
    } else {
        // Show alert "Jugador no se encuentra en esta orilla del rio"
        alert("Jugador no se encuentra en esta orilla del rio");
        return;
    }
}

function checkGameState() {
    // Check if game is over
    if (GAME.done) {
        if (GAME.hasWon) {
            alert('Has ganado');
        } else {
            alert('Has perdido');
        }
        GAME = new Game();
        resetScenario();
    }
}

function resetScenario() {
    player.x = points[0].ini.x;
    player.y = points[0].ini.y;

    wolf.x = points[3].ini.x;
    wolf.y = points[3].ini.y;

    goat.x = points[2].ini.x;
    goat.y = points[2].ini.y;

    cabbage.x = points[1].ini.x;
    cabbage.y = points[1].ini.y;
}

function changeObjectsVisibility(visible) {
    if (visible) {
        for (let i = 1; i < 4; i++) {
            puzzle_pieces[i].visible = true;
        }
        player.visible = true;
    } else {
        for (let i = 1; i < 4; i++) {
            puzzle_pieces[i].visible = false;
        }
        player.visible = false;
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

// Event listeners for main menu
const new_game_btn = $('#new-game');
const score_board_btn = $('#scoreboard');

new_game_btn.click(() => {
    $('#main-menu').hide();
    $('#game-controls').show();
    GAME = new Game();
    GAME.startTimer();
    resetScenario();
    changeObjectsVisibility(true);
});

// In-game event listeners
$('#show-game-menu').click(() => {
    changeObjectsVisibility(false);
    $('#game-controls').hide();
    $('#game-menu').show();
});


// Exit button which is inside game menu
$('#exit').click(() => {
    GAME.pauseTimer();
    changeObjectsVisibility(false);
    $('#game-menu').hide();
    $('#main-menu').show();
});

// Resume button which is inside game menu
$('#resume').click(() => {
    GAME.resumeTimer();
    changeObjectsVisibility(true);
    $('#game-controls').show();
    $('#game-menu').hide();
});

// At the outset of the program execution
$(document).ready(function() {
    changeObjectsVisibility(false);
    $('#game-controls').hide();
    $('#game-menu').hide();
});
