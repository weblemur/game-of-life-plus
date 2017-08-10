/*
fetchAndInstantiate('main.wasm').then(function(instance) {
    console.log(instance.exports.add(17, 25)); // "3"
});

// fetchAndInstantiate() found in wasm-utils.js
function fetchAndInstantiate(url, importObject) {
    return fetch(url).then(response =>
        response.arrayBuffer()
    ).then(bytes =>
        WebAssembly.instantiate(bytes, importObject)
    ).then(results =>
        results.instance
    );
}
*/

function main() {
    let width = 500;
    let height = 500;
    //let ctx = draw();
    let game = new GameOfLife(width, height);
    game.randomFill();
    draw(game);
}

function draw(game) {
    var canvas = document.getElementById('board');
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'green';
    for (let x = 0; x < game._width; x++) {
        for (let y = 0; y < game._height; y++) {
            if (game.getCellState(x, y))
                ctx.fillRect(x, y, 1, 1);
        }
    }
}

class GameOfLife {

    constructor(width, height) {
        this._width = width;
        this._height = height;
        this._board = new Uint8Array(width * height);
        this._nextBoard = new Uint8Array(width * height);
    }

    step() {

    }

    getCellState(x, y) {
        return this._board[x + y * this._width] > 0;
    }

    getIndex(x, y) {
        return x + y * this._width;
    }

    getAliveNeighbors(x, y) {
        let aliveNeighbors = 0;
        const offsetsArray = [
            [-1, -1],
            [0, -1],
            [1, -1],
            [-1, 0],
            [1, 0],
            [-1, 1],
            [0, 1],
            [1, 1]
        ];

        for (let i = 0; i < offsetsArray.length; i++) {
            // compute neighbor coordinates
            var offset = offsetsArray[i] // current offset
            var neighborX = x + offset[0];
            var neighborY = y + offset[1];

            // Periodic boundary conditions
            if (neighborX < 0) {
                neighborX = this._width - 1;
            }
            if (neighborX >= this._width) {
                neighborX = 0;
            }
            if (neighborY < 0) {
                neighborY = this._height - 1;
            }
            if (neighborY >= this._height) {
                neighborY = 0;
            }

            if (neighborX >= 0 && neighborX < this._width) {
                if (neighborY >= 0 && neighborY < this._height) {
                    var state = this.getCellState(neighborX, neighborY);
                    if (state) {
                        aliveNeighbors++;
                    }
                }
            }

        }
        return aliveNeighbors;
    }


    randomFill() {
        for (let i = 0; i < this._board.length; i++) {
            if (Math.random() < 1)
                this._board[i] = 1;
            else
                this[i] = 0;
        }
    }

    run() {

    }

}

document.onload = main();