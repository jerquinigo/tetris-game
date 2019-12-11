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

		fillPiece(color) {
			for (let r = 0; r < this.activeTetromino.length; r++) {
				for (let c = 0; c < this.activeTetromino.length; c++) {
					//draw only occupied squares
					if (this.activeTetromino[r][c]) {
						drawSquare(this.x + c, this.y + r, color);
					}
				}
			}
		}

		drawPiece() {
			this.fillPiece(this.color);
		}

		undrawPiece() {
			this.fillPiece(vacant);
		}

		movePieceDown() {
            if(!this.collision(0,1,this.activeTetromino)){
                this.undrawPiece();
                this.y++;
                this.drawPiece();
            }else{
                // we lock the piece and generate a new piece
            }

        }
        
        movePieceRight() {
            if(!this.collision(1,0,this.activeTetromino)){
			this.undrawPiece();
			this.x++;
            this.drawPiece();
            }
        }
        
        movePieceLeft() {
            if(!this.collision(-1,0,this.activeTetromino)){
			this.undrawPiece();
			this.x--;
            this.drawPiece();
            }
        }

        rotatePiece(){
            let nextPattern = this.tetromino[(this.tetrominoNumber + 1) % this.tetromino.length]
            let kick = 0;

            if(this.collision(0,0,nextPattern)){
                if(this.x > col/2){
                // its the right wall
                    kick = -1 // move the piece to the left
                }else{
                    kick = 1// move the piece to the right
                }
            }

            if(!this.collision(kick,0,nextPattern)){
            this.undrawPiece()
            this.x += kick
            this.tetrominoNumber = (this.tetrominoNumber + 1) % this.tetromino.length // (0 + 1) % 4 = 1
            this.activeTetromino = this.tetromino[this.tetrominoNumber]
            this.drawPiece()
            }
        }

        collision(x,y,pieces){
            for (let r = 0; r < pieces.length; r++) {
				for (let c = 0; c < pieces.length; c++) {
                    // check to see if square is empty
                    if(pieces[r][c]){
                        continue;
                    }
                    //coordinates of the pieces after movement
                    let newX = this.x + c + x
                    let newY = this.y + r + y
                    //conditions
                    if(newX < 0 || newX >= col || newY >= row){
                        return true
                    }
                    // skip newY < 0; board[-1] will throw huge error
                    if(newY < 0){
                        continue
                    }
                    // check to see if there is a locked piece already in place
                    if(board[newY][newX] !== vacant){
                        return true
                    }
				}
            }
            return false
        }

    }
    

    let randomPiece = () => {
        let r = Math.floor(Math.random() * pieces.length)
        return new Piece(pieces[r][0], pieces[r][1])
    }
	let p = randomPiece()
	console.log(p, "p");
	p.drawPiece();

	let dropStart = Date.now();
	let dropTetrisPiece = () => {
		let now = Date.now();
		let delta = now - dropStart;
		if (delta > 200) {
			p.movePieceDown();
			dropStart = Date.now();
		}
		requestAnimationFrame(dropTetrisPiece);
    };
    
    document.addEventListener("keydown", (event) => {
        if(event.keyCode === 37){
            p.movePieceLeft()
            dropStart = Date.now();
        }else if(event.keyCode === 38 || event.keyCode === 32 || event.keyCode === 90){
            p.rotatePiece()
            dropStart = Date.now();
        }else if(event.keyCode === 39){
            p.movePieceRight()
            dropStart = Date.now();
        }else if(event.keyCode === 40){
            p.movePieceDown()
            dropStart = Date.now();
        }
    })

	dropTetrisPiece();
});
