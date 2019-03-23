/**
 * Board
 * Defines a board "class" for an Othello game.
 */

module.exports = class Board {
	/**
	 * Construct the object with required state
	 */
	constructor(height, width){
		this.height = height;
		this.width = width;
		this.board = [];
		var h2 = Math.round(height/2);
		var w2 = Math.round(width/2);
		for(let i=0; i<this.height; ++i){
			let tmp = [];
			for(let j=0; j<this.width; ++j){
				if(i == (h2-1) && j == (w2-1)){
					tmp.push(0);
				}
				else if(i == h2 && j == (w2-1)){
					tmp.push(1);
				}
				else if(i == (h2-1) && j == w2){
					tmp.push(1);
				}
				else if(i == h2 && j == w2){
					tmp.push(0);
				}else{
					tmp.push(-1);
				}
			}
			this.board.push(tmp);
		}
	}

	setBoard(tmp){
		this.board = (tmp);
	}
	

	/**
	 * Print a representation of the board to the terminal.
	 */
	printBoard(){
		process.stdout.write('   ');
		for(let h=1; h <= this.width; ++h)
			process.stdout.write(h + '       ');
		process.stdout.write('\n');
		for(let i=0; i<this.height; ++i){
			let j = i+1;
			process.stdout.write(j + '  ');
			for(let j=0; j<this.width; ++j){
				if(this.board[i][j] == -1){
					process.stdout.write('-       ')
				} else {
					process.stdout.write(this.board[i][j] + "       ")
				}
			}
			console.log();
			console.log('\n');
		}
	}

	/**
	 * isValidMove
	 * @param row An integer row number.
	 * @param col An integer column number.
	 * @param disc A character for the disc color.
	 * @return A boolean indicating whether the move is valid.
	 */

	isValidMove(row, col, disc){

		// Check if move is on the board
		if (this.isOnBoard(row, col) == false)
			return false;

		// Check if move is onto an empty space
		if(this.isOnBoard(row, col) == true)
			if (this.board[row][col] != -1)
				return false;

		// Save the opponent color
		var opponent = 1;
		if (disc == opponent)
			opponent = 0;
		// Check if move captures opponent piece in any direction
		for (var i = -1; i < 2; i++)
			for (var j = -1; j < 2; j++) {
				var searchR = (row + i);
				var searchC = (col + j);
				// Only search when on the board
				if (this.isOnBoard(searchR, searchC) == true){

					// See if we surround the opponent
					if(this.board[searchR][searchC] == opponent) 
						while (this.board[searchR][searchC] 
							== opponent) {
							// Continue the search in a straight line
							if (i == -1 && j == -1) {
								searchR--;
								searchC--;
							}
							else if (i == 0 && j == -1) {
								searchC--;
							}
							else if (i == 0 && j == 1) {
								searchC++;
							}
							else if (i == 1 && j == -1) {
								searchR++;
								searchC--;
							}
							else if (i == -1 && j == 0) {
								searchR--;
							}
							else if (i == 1 && j == 0) {
								searchR++;
							}
							else if (i == -1 && j == 1) {
								searchR--;
								searchC++;
							}
							else if (i == 1 && j == 1) {
								searchR++;
								searchC++;
							}

							// Check if this new space is ours
							// Return true if it is
							if (this.isOnBoard(searchR, searchC)
								== true){
								if (this.board[searchR][searchC]
									== disc) {
									return true;
								}
							}
							else
								break;	
							
						}
				}
			}
		return false;
	}

	/**
	 * placeDiscAt
	 * @param row An integer number for row.
	 * @param col An integer number for column.
	 * @param disc A character standing for disc color.
	 */
	placeDiskAt(row, col, disc){
		var tempR, tempC;
		var permR = row;
		var permC = col;
		//Goes through all of the difference changes
		for(let rChange = -1; rChange < 2; rChange++){
			for(let cChange = -1; cChange < 2; cChange++){
				tempR = rChange + permR;
				tempC = cChange + permC;

				//Make sure it's not a blank space
				//or the current player
				if(this.isOnBoard(tempR, tempC) == true){
					while(this.board[tempR][tempC] != -1 &&
						this.board[tempR][tempC] != disc){
						//increment the pieces past that piece
						tempR += rChange;
						tempC += cChange; 

						//check if the piece is equal
						//to the current player
						if(this.isOnBoard(tempR, tempC) == true){
							if(this.board[tempR][tempC] == disc){
								row = permR;
								col = permC;

								for(;tempR != row || tempC != col;
									col += cChange, row += rChange){
									if(this.isOnBoard(tempR, tempC)
										== true)
										this.board[row][col] = disc;
								}
								break;
							}
						}
						if(this.isOnBoard(tempR, tempC) == false)
							break;
					}	
				}
			}
		}

		if(this.isOnBoard(permR, permC) == true)
			this.board[permR][permC] = disc;
	}

	/**
	 * isValidMoveAvailable
	 * @param disc A character pertaining to a disc color.
	 * @return bool A boolean telling the user whether there are
	 *	 	valid moves availabe for that disc.
	 */
	isValidMoveAvailable(disc){
		// Look at empty spaces for valid moves.
		for (let i=0; i<this.height; i++)
			for (let j=0; j<this.width; j++)
				if (this.board[i][j] == -1)
					if(this.isValidMove( i, j, disc) == true)
						return true;

		return false;
	}


	/**
	 * checkWinner
	 * @return char Which player has won.  Return null if
	 * 		a tie exists.
	 */
	checkWinner(){
		// Store the nmber of white and black chips separately.
		var white = 0;
		var black = 0;

		// Check every board space for chips and increment by color.
		for (let i=0; i<this.height; i++)
			for (let j=0; j<this.width; j++)
				if (this.board[i][j] == 0)
					white++;
				else if (this.board[i][j] == 1)
					black++;

		// The higher chips of a color wins.
		if (white > black)
			return 0;
		else if (black > white)
			return 1;
		else
			return -1;
	}

	//*****************************************************************
	// HELPER FUNCTION: Checks if a move is on the board.
	// @param r row location
	// @param c column location
	// @return true move is on the board
	// @return false move is not on the board
	//*****************************************************************
	isOnBoard(r, c) {
		if (r >= this.height|| r < 0)
			return false;
		if (c >= this.width || c < 0)
			return false;
		return true;
	}

    /**
	 * isBoardFull
	 * @return boolean Whether or not the board is full.
	 */
	isBoardFull(){
		// Stores the number of dashes on the board.
		var numDash = 0;

		// Checks every board spaces and totals number of dashes.
		for(let i=0; i<this.height; i++)
			for(let j=0; j<this.width; j++)
				if(board[i][j] == -1)
					numDash++;

		// If the board is full then there are 64 dashes.
		if(numDash == 64)
			return true;

		// There were not 64 dashes.
		return false;
	}

	/**
	 * isGameOver
	 * @return bool Whether or not the game is over.
	 */
	isGameOver(){
		if(this.isValidMoveAvailable(1) == false
					&& this.isValidMoveAvailable(0) == false )
			return true;
		return false;
	}
}

//let board = new Board(10, 10);
//board.printBoard();
