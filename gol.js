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
    let width = 100;
    let height = 100;
    let game = new GameOfLife(width, height);
    game.randomFill();
    draw(game);
    document.getElementById('board').addEventListener('click', e => {
        let x = Math.floor(e.offsetX / 5);
        let y = Math.floor(e.offsetY / 5);
        let index = game.getIndex(x, y);
        game._board[index] = game.getCellState(x, y) ? 0 : 1;
        draw(game);
    });
}

function draw(game) {
    let canvas = document.getElementById('board');
    let ctx = canvas.getContext('2d');
    let canvasWidth = 500;
    let canvasHeight = 500;
    let imageData = ctx.createImageData(game._width, game._height);
    for (let i = 0; i < game._board.length; i++) {
        // co
        if (game._board[i]) imageData.data[i*4 + 3] = 255;
    }

    console.log(imageData);

    // disable smoothing on scaling
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;


    // create, scale, and draw image
    createImageBitmap(imageData)
    .then(img => {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
    });
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
            if (Math.random() < 0.2)
                this._board[i] = 1;
            else
                this[i] = 0;
        }
    }

    run() {

    }

}

document.onload = main();