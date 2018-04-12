class GameOfLife {

    draw() {
        let ctx = this.ctx;
        let imageData = this.imageData;
        let data = imageData.data;
        for (let i = 0; i < this._board.length; i++) {
            if (this._board[i]) {
                // data[i * 4] = 0; // red
                // data[i * 4 + 1] = 0; // green
                // data[i * 4 + 2] = 0; // blue
                data[i * 4 + 3] = 255; // alpha
            } else {
                data[i * 4 + 3] = 0; // alpha
            }
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
        this._offsetsArray = [
            [-1, -1],
            [0, -1],
            [1, -1],
            [-1, 0],
            [1, 0],
            [-1, 1],
            [0, 1],
            [1, 1]
        ];

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
    }

    setNextState(x, y) {

        let aliveNeighbors = this.getAliveNeighbors(x, y);

        if (this.getCellState(x, y) > 0) {
            if (aliveNeighbors < 2) {
                this._nextBoard[this.getIndex(x, y)] = 0;
            }
            if (aliveNeighbors === 2 || aliveNeighbors === 3) {
                this._nextBoard[this.getIndex(x, y)] = 1;
            }
            if (aliveNeighbors > 3) {
                this._nextBoard[this.getIndex(x, y)] = 0;
            }
        } else if (aliveNeighbors === 3) {
                this._nextBoard[this.getIndex(x, y)] = 1;
            } else {
                this._nextBoard[this.getIndex(x, y)] = 0;
            }
    }


    getIndex(x, y) {
        return x + y * this._width;
    }

    getAliveNeighbors(x, y) {
        let aliveNeighbors = 0;

        for (let i = 0; i < this._offsetsArray.length; i++) {
            // compute neighbor coordinates
            let offset = this._offsetsArray[i]; // current offset
            let neighborX = x + offset[0];
            let neighborY = y + offset[1];

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
            if (Math.random() < Math.random() * 0.2) this._board[i] = 1;
            else this[i] = 0;
        }
    }

}

function main() {

    let width = 500;
    let height = 500;
    let game = new GameOfLife(width, height);
    game.randomFill();
    document.getElementById('board').addEventListener('click', e => {
        let x = Math.floor(e.offsetX * width / game.canvasWidth);
        let y = Math.floor(e.offsetY * height / game.canvasHeight);
        let index = game.getIndex(x, y);
        game._board[index] = game.getCellState(x, y) ? 0 : 1;
    });
    game.step();
}


document.onload = main();
