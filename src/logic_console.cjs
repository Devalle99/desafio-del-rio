const readline = require('readline');
const Game = require('./logic_game.cjs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const game = new Game();

console.log('Nueva partida');
game.printCurrentState();
rl.on('line', (input) => {
    const done = game.move(parseInt(input));
    game.printCurrentState();
    if (done) {
        if (game.hasWon) {
            console.log('Has ganado');
        } else {
            console.log('Has perdido');
        }
        rl.close();
    }
});
