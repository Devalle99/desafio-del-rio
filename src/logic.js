import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const set_1 = new Set([3, 2, 1]);
const set_2 = new Set();
var player_position = false; // false means left side, true means right side
var done = false;
var hasWon = false;

function has_lost(set) {
    for (const number of set) {
        if (set.has(number + 1)) {
            return true;
        }
    }
    return false;
}

function printCurrentState() {
    var objects = {
        1: 'col',
        2: 'cabra',
        3: 'lobo'
    }
    var left_side_objs = '';
    var right_side_objs = '';
    for (const number of set_1) {
        left_side_objs += objects[number] + ', ';
    }
    for (const number of set_2) {
        right_side_objs += objects[number] + ', ';
    }

    if (!player_position) {
        left_side_objs += 'Jugador';
    } else {
        right_side_objs += 'Jugador';
    }

    console.log(`${left_side_objs} ----- ${right_side_objs}`);
}

function move(movable_object) {
    let _done = false;

    if (movable_object === 0) {
        if ((has_lost(set_1) && !player_position) || (has_lost(set_2) && player_position)) {
            _done = true;
        }
        player_position = !player_position;
        return _done;
    }

    const current_set = player_position ? set_2 : set_1;
    const other_set = !player_position ? set_2 : set_1;

    // check if character is on the side of the river where the player is at
    if (current_set.has(movable_object)) {
        // move object from one side to the other
        current_set.delete(movable_object);
        other_set.add(movable_object);

        // evaluate state
        if (set_2.has(3) && set_2.has(2) && set_2.has(1)) {
            hasWon = true;
            _done = true;
        } else if ((has_lost(set_1) && !player_position) || (has_lost(set_2) && player_position)) {
            _done = true;
        }

        player_position = !player_position;
    } else {
        console.log('Ese personaje no se encuentra en esta orilla del rio');
    }

    return _done;
}

console.log('Nueva partida');
printCurrentState();
rl.on('line', (input) => {
    done = move(parseInt(input));
    printCurrentState();
    if (done) {
        rl.close();
    }
});

rl.on('close', () => {
    if (hasWon) {
        console.log('Buena papu');
    } else {
        console.log('La cagaste');
    }
});