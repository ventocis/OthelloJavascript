/**
 * Othello
 * Javascript project for CIS 343.
 * Command-line version of Othello.
 */

// Import our board definitions
const board = require('./board.js');
// Import a synchronous prompt library
const prompt = require('prompt-sync')();

/**
 * saveFile
 * SYNCHRONOUS (blocking) file save function.
 * @param file - The full filename path we want to save to.
 * @param contents - The object we wish to save as a JSON file.
 */
function saveFile(file, contents){
	let fs = require('fs');
	fs.writeFileSync(file, JSON.stringify(contents));
}

/**
 * loadFile
 * SYNCHRONOUS (blocking) file read function.
 * @param file - The full filename path we wish to load an object from.
 * @return contents - The object converted from JSON.
 */
function loadFile(file){
	const fs = require('fs');
	let myData = fs.readFileSync('test.json');
	let game = JSON.parse(myData);
	console.log(game);
	return game;
}

/**
 * Driver function.  "main" method, if you will.
 */
function start(){
	// Local variables
	let data = loadFile('test.json');	
	do{
		var inp = Number(prompt('Enter 1 to load file ' +
			'or 2 to start new game: '));
	}while(inp != 2 && inp != 1);
	var myR = 0;
	var myC = 0;
	if(inp == 2){

		do{
			myR = Number(prompt('Number of rows: '));
			myC = Number(prompt('Number of columns: '));
			if(myR < 4 || myC < 4 || myR > 12 || myC > 12)
				console.log('Input must be greater than 3 ' + 
					'or less than 13');}
		while(myR < 4 || myC < 4 || myR > 12 || myC > 12);
	}
	else{
		myR = data.height;
		myC = data.width;
	}

	var myBoard = new board(myR, myC);
	if(inp == 1)
		myBoard.setBoard(data.board);
	// SYNCHRONOUSLY read from keyboard
	console.log('Creating a board with size ' + myR + ' x ' + myC);


	var col = 0;
	var row = 0;
	var currPlyr = 1;
	// Print board
	while(myBoard.isGameOver() == false){
		console.log('\n\n');
		myBoard.printBoard();
		if(myBoard.isValidMoveAvailable(currPlyr) == false){
			console.log('No valid moves availables for player ' + 
				currPlyr + '. You lose your turn.\n');
			currPlyr = (currPlyr + 1) % 2;
		}
		console.log('Player ' + currPlyr);
		row = Number(prompt('Enter row (Enter -1 to exit program ' + 
			'immediately or -2 to save & exit): '));
		if(row == -1){
			console.log('Exiting');
			process.exit();
		}
		if(row == -2){
			console.log('Saving & exiting');
			break;
		}
		col = Number(prompt('Enter col: '));
		col--;
		row--;

		if(col >= data.height || col < 0 || 
			row >= data.height || row < 0)
			console.log('Please enter valid coordinates');
		else if(!myBoard.isValidMove(row,col,currPlyr)){
			console.log('Sorry, not a valid move');
		}
		else{
			myBoard.placeDiskAt(row,col,currPlyr);	
			currPlyr = (currPlyr + 1) % 2;
		}

	}

	if(row == -2){
		saveFile('test.json', myBoard);
	}
	else{
		myBoard.printBoard();
		if(myBoard.checkWinner() == 1)
			console.log("Player 1 won!");
		else if(myBoard.checkWinner() == 0)
			console.log("Player 0 won!");
		else
			console.log("It was a tie");
	}

}

console.clear();
start();
