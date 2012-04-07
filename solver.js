/**
 * Singleton puzzle solver object
 *
 * This object is used to solve sudoku puzzles.
 * The only method exposed will is the solve method
 * which accepts a two dimensional array of sudoku
 * cell values, where empty cells are defined as any
 * cell that contains the value zero.
 */
var solver = function()
{
	var solver = this;

	this.puzzle          = [];
	this.availableValues = [];

	/**
	 * Solve a sudoku puzzle using backtracking.
	 * A puzzle should be given as a two dimensional
	 * array of values, where the `0` value indicates
	 * that the cell is empty, and any other value
	 * indicates that the cell has already been given
	 * to us and should not be changed.
	 *
	 * @param  {array} unsolvedPuzzle The 2D puzzle array
	 * @return {Array}                The solved 2D puzzle array
	 */
	this.solve = function(unsolvedPuzzle)
	{
		// Keep the puzzle, we will be filling in it's values
		solver.puzzle = unsolvedPuzzle;

		// Setup the available values for each cell. If a cell already has
		// a number filled, then the available values for that cell will be
		// a boolean false, indicating that the value should not be changed
		for (var row in solver.puzzle)
		{
			solver.availableValues[row] = [];

			for (var column in solver.puzzle)
			{
				// determine if the cell will have values
				solver.availableValues[row][column] = [];

				// Continue the loop if there will be no available values
				if (solver.puzzle[row][column] !== 0)
				{
					solver.availableValues[row][column] = false;
					continue;
				}

				// All numbers are valid for this cell, 1-9
				solver.resetCellValues([row, column]);
			}
		}

		// Begin iterating horizontally over the puzzle filling the cells
		for (var index = 0; index < 9 * 9;)
		{
			// Calculate the row and column for this index
			var cell   = solver.getCellByIndex(index),
			    row    = cell[0],
			    column = cell[1];

			// Get a random value for this cell (if one is available)
			var newValue = solver.getRandForCell(cell);

			// Make sure we have a valid value for this cell
			if (newValue !== false)
			{
				// Determine if the value fits into the cell
				if (solver.isValidValue(cell, newValue))
				{
					// Set this as the value for the cell
					solver.puzzle[row][column] = parseInt(newValue);

					// Remove the value from it's available list
					solver.availableValues[row][column][newValue] = false;

					// Move to the next cell in the table
					++index;
				}
				else
				{
					// This value can't be used for this cell
					solver.availableValues[row][column][newValue] = false;
				}
			}
			else
			{
				// Reset the available values for this cell
				solver.resetCellValues(cell);

				// Get the cell array of the previous cell
				var previousCell = solver.getCellByIndex(index);

				// Clear the value of the previous cell
				solver.puzzle[previousCell[0]][previousCell[1]] = 0;

				// Move back to the previous index
				--index;
			}

			console.log(solver.puzzle);
		}

		return solver.puzzle;
	};

	/**
	 * Determine if a given value is an acceptable
	 * value to be filled into a cell. There are five
	 * conditions that a value must meet in order for
	 * the value for be a valid number for a given cell
	 *
	 *  1. The value must not be false in the list of
	 *     available values, if it is false, this indicates
	 *     that the value is immutable and cannot be changed
	 *
	 *  2. The value must be true in the `availableValues`
	 *     list for that cell, if it is not in the list then
	 *     it has already been tried in that cell and was
	 *     an invalid value.
	 *
	 *  3. The value currently exists only once in the given
	 *     row of the cell.
	 *
	 *  4. The value currently exists only once in the given
	 *     column of the cell
	 *
	 *  5. The value currently exists only once in the sudoku
	 *     square that the cell falls into. This is a 3x3
	 *     square the exists as a super set of the cells
	 *
	 * If all these conditions are matched, than the value
	 * can be placed into the cell
	 *
	 * @param  {Arrray}  cell  The cell given as an array of [y, x]
	 * @param  {Integer} value The value to check for cell validity
	 * @return {Boolean}       Weather the value is valid in the cell
	 */
	this.isValidValue = function(cell, value)
	{
		var y = cell[0], x = cell[1];

		// Ensure that the cell is a mutable cell
		if ( ! solver.isCellMutable(cell))
			return false;

		// Make sure that the value can even be used at all
		if ( ! (value in solver.availableValues[y][x]))
			return false;

		// Test that the valued is availble for this cell
		if (solver.availableValues[y][x][value] === false)
			return false;

		// Test that the value is available for this row
		for (var column in solver.puzzle[y])
		{
			if (value === solver.puzzle[y][column])
				return false;
		}

		// Test that the value is not in the column
		for (var row in solver.puzzle)
		{
			if (value === solver.puzzle[row][x])
				return false;
		}

		// Find the top-left corner of the super square
		var squareY = Math.floor(y / 3) * 3,
		    squareX = Math.floor(x / 3) * 3;

		// Determin if the value exists in the square
		for (var i = squareY; i < squareY + 3; ++i)
		{
			for (var j = squareX; j < squareX + 3; ++j)
			{
				if (value === solver.puzzle[i][j])
					return false;
			}
		}

		return true;
	}

	/**
	 * Get a random value from the list of available
	 * values for a specified cell. If the cell has
	 * no values available then a boolean false will
	 * be returned
	 *
	 * @param  {Array} cell The cell given as an array of [y, x]
	 * @return {Mixed}      Boolean false if there are no values
	 *                      available, or a random Integer value
	 *                      that exists in the list of values
	 */
	this.getRandForCell = function(cell)
	{
		var y = cell[0], x = cell[1];

		// Ignore cells that are immutable
		if ( ! solver.isCellMutable(cell))
			return false;

		// Build a list of the available values
		var availableForRand = [];

		for (var value in solver.availableValues[y][x])
		{
			if (solver.availableValues[y][x][value] === true)
			{
				availableForRand.push(value);
			}
		}

		// Make sure that cell has values available
		if (availableForRand.length === 0)
			return false;

		// Get the index to select randomly
		var randIndex = Math.floor(Math.random() * availableForRand.length);

		return availableForRand[randIndex];
	}

	/**
	 * Reset the available values for a given cell
	 * so that the cell can now take any value. This
	 * method will also remove what ever value was set
	 * for the cell previously
	 *
	 * @param {Array} cell The cell given as an array of [y, x] to clear
	 */
	this.resetCellValues = function(cell)
	{
		var y = cell[0], x = cell[1];

		// Never reset immutable cells
		if ( ! solver.isCellMutable(cell))
			return false;

		// Set all values for this cell as available
		for (var i = 1; i < 10; ++i)
		{
			solver.availableValues[y][x][i] = true;
		}

		// Set the value of the cell to zero (unknown)
		solver.puzzle[y][x] = 0;
	}

	/**
	 * Determine if a given cell is mutable. That is the
	 * cell has not been defined in the puzzle as an
	 * unchangeable value.
	 *
	 * We define immutable cells as those that have their
	 * `availableValues` array set to false
	 *
	 * @param  {Array}   cell The cell given as an array of [y, x]
	 * @return {Boolean}      Weather the cell is mutable or not
	 */
	this.isCellMutable = function(cell)
	{
		var y = cell[0], x = cell[1];

		return solver.availableValues[y][x] !== false
	}

	/**
	 * Given an index from 0-80 return the cell
	 * coordinates as an array in the form [x, y]
	 *
	 * @param  {Integer} index The index of the cell
	 * @return {Array}         The coordinates of the cell
	 */
	this.getCellByIndex = function(index)
	{
		return [Math.floor(index / 9), index % 9];
	}

	// Make the solve method public
	return {'solve' : this.solve};
}();




// Setup a unsolved puzzle
var puzzle = [];

// puzzle    1  2  3  4  5  6  7  8  9       1  2  3  4  5  6  7  8  9
puzzle[0] = [9, 0, 0, 1, 0, 0, 0, 7, 5]; // [9, 2, 4, 1, 8, 6, 3, 7, 5]
puzzle[1] = [0, 0, 0, 9, 2, 0, 0, 4, 0]; // [7, 6, 5, 9, 2, 3, 8, 4, 1]
puzzle[2] = [3, 1, 8, 0, 0, 0, 2, 0, 0]; // [3, 1, 8, 7, 5, 4, 2, 9, 6]
puzzle[3] = [0, 0, 1, 0, 6, 7, 4, 5, 0]; // [2, 9, 1, 8, 6, 7, 4, 5, 3]
puzzle[4] = [0, 8, 0, 3, 0, 5, 0, 2, 0]; // [4, 8, 6, 3, 9, 5, 1, 2, 7]
puzzle[5] = [0, 3, 7, 4, 1, 0, 9, 0, 0]; // [5, 3, 7, 4, 1, 2, 9, 6, 8]
puzzle[6] = [0, 0, 2, 0, 0, 0, 6, 8, 4]; // [1, 7, 2, 5, 3, 9, 6, 8, 4]
puzzle[7] = [0, 4, 0, 0, 7, 1, 0, 0, 0]; // [8, 4, 9, 6, 7, 1, 5, 3, 2]
puzzle[8] = [6, 5, 0, 0, 0, 8, 0, 0, 9]; // [6, 5, 3, 2, 4, 8, 7, 1, 9]

// Setup an empty puzzle
var emptyPuzzle = [];

emptyPuzzle[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
emptyPuzzle[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
emptyPuzzle[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
emptyPuzzle[3] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
emptyPuzzle[4] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
emptyPuzzle[5] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
emptyPuzzle[6] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
emptyPuzzle[7] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
emptyPuzzle[8] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

// Solve the puzzle
console.log(solver.solve(emptyPuzzle));