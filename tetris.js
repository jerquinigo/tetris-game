document.addEventListener("DOMContentLoaded", () => {
	const canvas = document.getElementById("tetris");
	const ctx = canvas.getContext("2d");

	// const row = 20;
	// const COL = (COLUMN = 10);
	// const SQ = (SquareSize = 20);
	const row = 20;
	const col = 10;
	const squareSize = 20;
	const vacant = "white";

	// to draw individual square
	let drawSquare = (x, y, color) => {
		ctx.fillStyle = color;
		ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
		ctx.strokeStyle = "black";
		ctx.strokeRect(x * squareSize, y * squareSize, squareSize, squareSize);
	};

	//draw the board

	let board = [];
	for (let r = 0; r < row; r++) {
		board[r] = [];
		for (let c = 0; c < col; c++) {
			board[r][c] = vacant;
		}
	}

	let drawBoard = () => {
		for (let r = 0; r < row; r++) {
			for (let c = 0; c < col; c++) {
				drawSquare(c, r, board[r][c]);
			}
		}
	};

	drawBoard();

	// the game pieces and their color
	const pieces = [
		[Z, "blue"],
		[S, "purple"],
		[T, "green"],
		[O, "red"],
		[L, "orange"],
		[I, "pink"],
		[J, "violet"]
	];

	// initiate a game piece
	console.log(pieces[0][0][0][2], pieces[0][1]);
	class Piece {
		constructor(tetromino, color) {
			this.tetromino = tetromino;
			this.color = color;
			this.tetrominoNumber = 0;
			this.activeTetromino = this.tetromino[this.tetrominoNumber];
			this.x = 0;
			this.y = 0;
		}

		drawPiece() {
			for (let r = 0; r < this.activeTetromino.length; r++) {
				for (let c = 0; c < this.activeTetromino.length; c++) {
					//draw only occupied squares
					if (this.activeTetromino[r][c]) {
						drawSquare(this.x + c, this.y + r, this.color);
					}
				}
			}
        }
        
        undrawPiece() {
			for (let r = 0; r < this.activeTetromino.length; r++) {
				for (let c = 0; c < this.activeTetromino.length; c++) {
					//draw only occupied squares
					if (this.activeTetromino[r][c]) {
						drawSquare(this.x + c, this.y + r, vacant);
					}
				}
			}
		}

		movePieceDown() {
            this.undrawPiece()
			this.y++;
			this.drawPiece();
		}
	}
	let p = new Piece(pieces[0][0], pieces[0][1]);
	console.log(p, "p");
	p.drawPiece();

	let dropStart = Date.now();
	let dropTetrisPiece = () => {
		let now = Date.now();
		let delta = now - dropStart;
		if (delta > 1000) {
            p.movePieceDown();
            dropStart = Date.now()
		}
		requestAnimationFrame(dropTetrisPiece);
	};

	dropTetrisPiece();
});
