/**
 * Singleton puzzle solver object
 *
 * This object is used to solve sudoku puzzles. A
 * single solve method is exposed on the sudoku object
 *
 * solve accepts a two dimensional array of sudoku
 * cell values, where empty cells are defined as any
 * cell that contains the value zero.
 *
 */
var sudoku = function()
{

	this.recursiveSolver = function(puzzle)
	{
		var row = 0, column = 0;

		// Find the row and column that hasn't been solved yet
		for (var i = 0;; ++i)
		{
			// The puzzle is solved
			if (i > 80)
				return puzzle

			// Get the row and column for this index
			row = Math.floor(i / 9);
			column = i % 9;

			//
			if (puzzle[row][column] === 0)
				break;
		}

		// Figure out what numbers can go in this cell
		var invalidValues = [];

		// Check the columns and rows
		for (var i = 0; i < 9; ++i)
		{
			invalidValues[puzzle[row][i]]    = true;
			invalidValues[puzzle[i][column]] = true;
		}

		// Check the numbers square
		var bx = Math.floor(row / 3) * 3;
		var by = Math.floor(column / 3) * 3;

		for (var i = 0; i < 3; ++i)
		{
			for (var j = 0; j < 3; ++j)
			{
				invalidValues[puzzle[bx+i][by+j]] = true;
			}
		}

		// Try the values 1-9 for this square
		for (var i = 1; i < 10; ++i)
		{
			// Make sure we can put this value in the square
			if (invalidValues[i] !== true)
			{
				// Set the value for this cell
				puzzle[row][column] = i;

				var newPuzzle = recursiveSolver(puzzle)

				// Move to the next cell and recursively solve it
				if (newPuzzle !== false)
					return newPuzzle

				// If We had trouble solving the next cell then reset this cell and
				// let the loop iterate so we can try with the next value
				puzzle[row][column] = 0;
			}
		}

		return false;
	}

	return this.recursiveSolver;
}();

var veryHard = [];
veryHard[0] = [1, 0, 0, 0, 0, 7, 0, 9, 0]; // [1, 6, 2, 8, 5, 7, 4, 9, 3]
veryHard[1] = [0, 3, 0, 0, 2, 0, 0, 0, 8]; // [5, 3, 4, 1, 2, 9, 6, 7, 8]
veryHard[2] = [0, 0, 9, 6, 0, 0, 5, 0, 0]; // [7, 8, 9, 6, 4, 3, 5, 2, 1]
veryHard[3] = [0, 0, 5, 3, 0, 0, 9, 0, 0]; // [4, 7, 5, 3, 1, 2, 9, 8, 6]
veryHard[4] = [0, 1, 0, 0, 8, 0, 0, 0, 2]; // [9, 1, 3, 5, 8, 6, 7, 4, 2]
veryHard[5] = [6, 0, 0, 0, 0, 4, 0, 0, 0]; // [6, 2, 8, 7, 9, 4, 1, 3, 5]
veryHard[6] = [3, 0, 0, 0, 0, 0, 0, 1, 0]; // [3, 5, 6, 4, 7, 8, 2, 1, 9]
veryHard[7] = [0, 4, 0, 0, 0, 0, 0, 0, 7]; // [2, 4, 1, 9, 3, 5, 8, 6, 7]
veryHard[8] = [0, 0, 7, 0, 0, 0, 3, 0, 0]; // [8, 9, 7, 2, 6, 1, 3, 5, 4]

console.log(sudoku(veryHard));