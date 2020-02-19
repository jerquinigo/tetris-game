document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("tetris");
    let scoreElement = document.getElementById("score")
    let gameOverElement = document.getElementById("gameOverText")
    let leftButtonElement = document.getElementById("left-button-div")
    let rightButtonElement = document.getElementById("right-button-div")
    let rotateButtonElement = document.getElementById("rotate-button-div")
    let dropDownElement = document.getElementById("drop-down-fast-div")
    let testReset = document.getElementById("testReset")
    const ctx = canvas.getContext("2d");

	const row = 20;
	const col = 10;
	const squareSize = 20;
	const vacant = "white";

	// to draw individual square
	const drawSquare = (x, y, color) => {
		ctx.fillStyle = color;
		ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
		ctx.strokeStyle = "black";
		ctx.strokeRect(x * squareSize, y * squareSize, squareSize, squareSize);
	};

	//draw the board

    //to draw the initial white squares
    let board = [];
    const drawInitialBoard = () => {
        for (let r = 0; r < row; r++) {
            board[r] = [];
            for (let c = 0; c < col; c++) {
                board[r][c] = vacant;
            }
        }
    }

    drawInitialBoard();

    testReset.addEventListener("click",(event) => {
        event.preventDefault()
        ctx.clearRect(0, 0, 200, 400);
        drawInitialBoard()
        drawBoard()
        score = 0
        scoreElement.innerHTML = score
        gameOver = false
        gameOverElement.innerHTML = ""
        
        requestAnimationFrame(dropTetrisPiece)
    })

// draws the colored tetrimino
	const drawBoard = () => {
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
    let score = 0
	//console.log(pieces[0][0][0][2], pieces[0][1]);
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
            }
            else{
                // we lock the piece and generate a new piece
                this.lock()
                p = randomPiece()
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
                }
                else{
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

        collision(x,y,piece){
            for (let r = 0; r < piece.length; r++) {
				for (let c = 0; c < piece.length; c++) {
                    // check to see if square is empty
                    if(!piece[r][c]){
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

        lock(){

            for (let r = 0; r < this.activeTetromino.length; r++) {
				for (let c = 0; c < this.activeTetromino.length; c++) {
					//skip vacent squares
					if (!this.activeTetromino[r][c]) {
						continue
                    }
                    //pieces to lock on top = game over
                    if(this.y + r <= 0){
                        
                        gameOverElement.innerHTML = "Game Over"
                        //break animation frame
                        gameOver = true
                        break;
                    }
                    
                    // lock the piece
                    board[this.y+r][this.x+c] = this.color
				}
            }
            for(let r = 0; r < row; r++){
                let isRowFull = true
                for(let c = 0; c < col; c++){
                    isRowFull = isRowFull && (board[r][c] !== vacant)
                }
                    if(isRowFull){
                        //if row full
                        //move rows above it down
                        for(let y = r; y > 1; y--){
                            for(let c = 0; c < col; c++){
                                board[y][c] = board[y-1][c]
                            }
                        }
                        //top row board[0][..] has no row above it
                        for(let c = 0; c < col; c++){
                            board[0][c] = vacant
                        }
                        // increment score
                        score += 10
                    }
            }
            drawBoard()
            scoreElement.innerHTML = score
        }

    }
    

    const randomPiece = () => {
        let r = Math.floor(Math.random() * pieces.length)
        return new Piece(pieces[r][0], pieces[r][1])
    }
	let p = randomPiece()
	p.drawPiece();

    let dropStart = Date.now();
    let gameOver = false
	const dropTetrisPiece = () => {
		let now = Date.now();
        let delta = now - dropStart;
        //console.log(delta, "delta")
        //decrementing the value will make it go faster. Making it higher will make it go slower. My default is 200
		if (delta > 200) {
			p.movePieceDown();
			dropStart = Date.now();
        }
        if(!gameOver){
        requestAnimationFrame(dropTetrisPiece);
        }
    };


    
    document.addEventListener("keydown", (event) => {

        if(event.keyCode === 37){
            event.preventDefault()
            p.movePieceLeft()
            dropStart = Date.now();
        }
        else if(event.keyCode === 38 || event.keyCode === 32 || event.keyCode === 90){
            event.preventDefault()
            p.rotatePiece()
            dropStart = Date.now();
        }
        else if(event.keyCode === 39){
            event.preventDefault()
            p.movePieceRight()
            document.getElementById("my_audio").play();
            dropStart = Date.now();
        }
        else if(event.keyCode === 40){
            event.preventDefault()
            p.movePieceDown()
            //this will start the music
            document.getElementById("my_audio").play();
            dropStart = Date.now();
        }
    })

    //for mobile experience
    leftButtonElement.addEventListener("click", (event) => {
        p.movePieceLeft()
        dropStart = Date.now();
    })

    rightButtonElement.addEventListener("click", (event) => {
        p.movePieceRight()
        document.getElementById("my_audio").play();
        dropStart = Date.now();
    })

    rotateButtonElement.addEventListener("click", (event) => {
        p.rotatePiece()
        dropStart = Date.now();
    })
    
    let timer = null;

    // Set up an event handler for mousedown

$("#drop-down-fast-div").mousedown(function(){

    timer = setInterval(() => {
        p.movePieceDown()
    
        dropStart = Date.now();
    },100);
 
})

$("#drop-down-fast-div").mouseup(function(){
    setTimeout(() => {
        clearInterval(timer) 
    },500);

})


    
	dropTetrisPiece();
});
