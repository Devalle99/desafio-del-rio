class Game {
    constructor() {
        this.set_1 = new Set([3, 2, 1]);
        this.set_2 = new Set();
        this.player_position = false; // false means left side, true means right side
        this.done = false;
        this.hasWon = false;

        // Timer properties
        this.startTime = Date.now();
        this.elapsedTime = 0;
        this.timerInterval = null;
    }

    startTimer() {
        this.startTime = Date.now() - this.elapsedTime;
        this.timerInterval = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
        }, 1000);
    }

    getElapsedTime() {
        return Math.floor(this.elapsedTime / 1000);
    }

    pauseTimer() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
    }

    resumeTimer() {
        if (!this.timerInterval) {
            this.startTimer();
        }
    }

    has_lost() {
        if (this.player_position && ((this.set_1.has(2) && this.set_1.has(1)) || (this.set_1.has(2) && this.set_1.has(3)))) {
            return true;
        }
        if (!this.player_position && ((this.set_2.has(2) && this.set_2.has(1)) || (this.set_2.has(2) && this.set_2.has(3)))) {
            return true;
        }
        return false;
    }

    printCurrentState() {
        const objects = {
            1: 'col',
            2: 'cabra',
            3: 'lobo'
        };
        let left_side_objs = '';
        let right_side_objs = '';
        for (const number of this.set_1) {
            left_side_objs += objects[number] + ', ';
        }
        for (const number of this.set_2) {
            right_side_objs += objects[number] + ', ';
        }

        if (!this.player_position) {
            left_side_objs += 'Jugador';
        } else {
            right_side_objs += 'Jugador';
        }

        console.log(`${left_side_objs} ----- ${right_side_objs}`);
    }

    move(movable_object) {
        const current_set = this.player_position ? this.set_2 : this.set_1;
        const other_set = !this.player_position ? this.set_2 : this.set_1;
        let _done = false;
        let validMove = true;
        this.player_position = !this.player_position;

        if (movable_object === 0) {

            if (this.has_lost()) {
                _done = true;
            }
        } else if (current_set.has(movable_object)) {
            current_set.delete(movable_object);
            other_set.add(movable_object);

            if (this.set_2.has(3) && this.set_2.has(2) && this.set_2.has(1)) {
                this.hasWon = true;
                _done = true;
            } else if (this.has_lost()) {
                _done = true;
            }
        } else {
            console.log('Ese personaje no se encuentra en esta orilla del rio');
            validMove = false;
        }

        this.done = _done;
        return validMove;
    }
}

export default Game;