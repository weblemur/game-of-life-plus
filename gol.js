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
let outergame;

function main() {

    let width = 20;
    let height = 20;
    //let ctx = draw();
    let game = new GameOfLife(width, height);
    outergame = game;
    game.randomFill();
    document.getElementById('board').addEventListener('click', e => {
        let x = Math.floor(e.offsetX / 5);
        let y = Math.floor(e.offsetY / 5);
        let index = game.getIndex(x, y);
        game._board[index] = game.getCellState(x, y) ? 0 : 1;
    });
    //game.step();
    game.step();
    //draw(game);
}


class GameOfLife {

    draw() {

        let ctx = this.ctx;
        let imageData = this.imageData;
        for (let i = 0; i < this._board.length; i++) {
            if (this._board[i]) imageData.data[i * 4 + 3] = 255;
        }

        // disable smoothing on scaling
        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;

        // create, scale, and draw image
        createImageBitmap(imageData)
            .then(img => {
                ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                ctx.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight);
            });
    }

    constructor(width, height) {

        this._width = width;
        this._height = height;

        this.canvasWidth = 500;
        this.canvasHeight = 500;

        this._board = new Uint8Array(width * height);
        this._nextBoard = new Uint8Array(width * height);
        this.canvas = document.getElementById('board');
        this.ctx = this.canvas.getContext('2d');
        this.imageData = this.ctx.createImageData(this._width, this._height);
    }

    getCellState(x, y) {
        return this._board[this.getIndex(x, y)];
    }

    swap(x) {
        return x
    };

    /* Main loop */
    step() {
        this.draw();
        this.updateCells();
        requestAnimationFrame(this.step.bind(this));
    }

    updateCells() {
        for (let x = 0; x < this._width; x++) {
            for (let y = 0; y < this._height; y++) {
                this.setNextState(x, y);
            }
        }
        let temp = this._board;
        this._board = this._nextBoard;
        this._nextBoard = temp;
        // this._board = this.swap(this._board, this._board = this._nextBoard);
    }

    setNextState(x, y) {

        let aliveNeighbors = this.getAliveNeighbors(x, y);
        // console.log('aliveneighbors:', aliveNeighbors, 'x, y: ', x, y);

        if (this.getCellState(x, y)) {
            if (aliveNeighbors < 2) {
                this._nextBoard[this.getIndex(x, y)] = 0;
            }
            if (aliveNeighbors === 2 || aliveNeighbors === 3) {
                this._nextBoard[this.getIndex(x, y)] = 1;
            }
            if (aliveNeighbors > 3) {
                this._nextBoard[this.getIndex(x, y)] = 0;
            }
        } else {
            if (aliveNeighbors === 3) {
                this._nextBoard[this.getIndex(x, y)] = 1;
            }
        }
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
            if (neighborX < 0) neighborX = this._width - 1;
            if (neighborX >= this._width) neighborX = 0;
            if (neighborY < 0) neighborY = this._height - 1;
            if (neighborY >= this._height) neighborY = 0;

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
            if (Math.random() < Math.random() * 0.2)
                this._board[i] = 1;
            else
                this[i] = 0;
        }
    }

    run() {

    }

}

document.onload = main();