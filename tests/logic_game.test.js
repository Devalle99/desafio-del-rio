const Game = require('../src/logic_game');

let game;

beforeEach(() => {
    game = new Game();
});

test('initial state', () => {
    expect(game.set_1).toEqual(new Set([3, 2, 1]));
    expect(game.set_2).toEqual(new Set());
    expect(game.player_position).toBe(false);
    expect(game.hasWon).toBe(false);
});

test('move without losing or winning', () => {
    game.move(2); // move goat to the right side
    expect(game.set_1).toEqual(new Set([3, 1]));
    expect(game.set_2).toEqual(new Set([2]));
    expect(game.player_position).toBe(true);
    expect(game.has_lost()).toBe(false);
    expect(game.hasWon).toBe(false);
});

test('move to win the game', () => {
    game.move(2); // move goat to the right side
    game.move(0); // move player back alone
    game.move(3); // move wolf to the right side
    game.move(2); // move goat back to the left side
    game.move(1); // move cabbage to the right side
    game.move(0); // move player back alone
    game.move(2); // move goat to the right side

    expect(game.set_2).toEqual(new Set([3, 2, 1]));
    expect(game.hasWon).toBe(true);
    expect(game.player_position).toBe(true);
});

test('move to lose the game', () => {
    game.move(2); // move goat to the right side
    game.move(0); // move player back alone
    game.move(3); // move wolf to the right side
    game.move(0); // move player back alone
    expect(game.has_lost()).toBe(true);
    expect(game.player_position).toBe(false);
});