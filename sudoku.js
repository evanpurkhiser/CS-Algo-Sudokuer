/**
 * Singleton puzzle solver and generator object
 *
 * This object is used to solve and generate sudoku
 * puzzles. Two methods are exposed, solve and generate.
 *
 * solve accepts a two dimensional array of sudoku
 * cell values, where empty cells are defined as any
 * cell that contains the value zero.
 *
 * generate accepts no values but will return a unsolved
 * puzzle.
 */
var sudoku = function()
{
	var sudoku = this;

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
	 * If the puzzle is unsolvable then false will be returned
	 *
	 * @param  {array}  unsolvedPuzzle The 2D puzzle array
	 * @return {Object}                The solved puzzle and some statistics
	 *                                 about the generated algorithm
	 */
	this.solve = function(unsolvedPuzzle)
	{
		// Keep the puzzle, we will be filling in it's values
		sudoku.puzzle = unsolvedPuzzle;

		// Setup the available values for each cell. If a cell already has
		// a number filled, then the available values for that cell will be
		// a boolean false, indicating that the value should not be changed
		for (var row in sudoku.puzzle)
		{
			sudoku.availableValues[row] = [];

			for (var column in sudoku.puzzle)
			{
				// determine if the cell will have values
				sudoku.availableValues[row][column] = [];

				// Continue the loop if there will be no available values
				if (sudoku.puzzle[row][column] !== 0)
				{
					sudoku.availableValues[row][column] = false;
					continue;
				}

				// All numbers are valid for this cell, 1-9
				sudoku.resetCellValues([row, column]);
			}
		}

		// Keep track of the iterations and start time
		var iterations = 0,
		    backtracks = 0,
		    startTime  = new Date().getTime();

		// Begin iterating horizontally over the puzzle filling the cells
		for (var index = 0; index < 9 * 9;)
		{
			// Calculate the row and column for this index
			var cell   = sudoku.getCellByIndex(index),
			    row    = cell[0],
			    column = cell[1];

			// If this cell isn't mutable, continue to the next
			if ( ! sudoku.isCellMutable(cell))
			{
				++index;
				continue;
			}

			// Keep track of how many iterations we have been through
			++iterations;

			// Get a random value for this cell (if one is available)
			var newValue = sudoku.getRandForCell(cell);

			// Make sure we have a valid value for this cell
			if (newValue !== false)
			{
				// Determine if the value fits into the cell
				if (sudoku.isValidValue(cell, newValue))
				{
					// Set this as the value for the cell
					sudoku.puzzle[row][column] = newValue;

					// Move to the next cell in the table
					++index;
				}

				// Remove the value from it's available list
				sudoku.availableValues[row][column][newValue] = false;
			}
			else
			{
				// Reset the available values for this cell
				sudoku.resetCellValues(cell);

				// Backtrack to the most recent mutable cell
				while (true)
				{
					// Move back to the previous index
					--index;

					// If we backtracked too far then this puzzle is unsolvable
					if (index < 0)
						return false;

					// Get the cell array of the previous cell
					var previousCell = sudoku.getCellByIndex(index);

					// Keep backtracking if this cell isn't mutable
					if ( ! sudoku.isCellMutable(previousCell))
						continue;

					// Clear the value of the previous cell
					sudoku.puzzle[previousCell[0]][previousCell[1]] = 0;

					// Keep track of how many times we had to backtrack
					++backtracks;

					break;
				}
			}
		}

		// Get the end time
		var endTime = new Date().getTime();

		// Compile a nice object with the solved information
		return {
			'puzzle'      : sudoku.puzzle,
			'iterations'  : iterations,
			'backtracks'  : backtracks,
			'runningTime' : endTime - startTime,
		};
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
		if ( ! sudoku.isCellMutable(cell))
			return false;

		// Make sure that the value can even be used at all
		if ( ! (value in sudoku.availableValues[y][x]))
			return false;

		// Test that the valued is available for this cell
		if (sudoku.availableValues[y][x][value] === false)
			return false;

		// Test that the value is available for this row
		for (var column in sudoku.puzzle[y])
		{
			if (value === sudoku.puzzle[y][column])
				return false;
		}

		// Test that the value is not in the column
		for (var row in sudoku.puzzle)
		{
			if (value === sudoku.puzzle[row][x])
				return false;
		}

		// Find the top-left corner of the super square
		var squareY = Math.floor(y / 3) * 3,
		    squareX = Math.floor(x / 3) * 3;

		// Determine if the value exists in the square
		for (var i = squareY; i < squareY + 3; ++i)
		{
			for (var j = squareX; j < squareX + 3; ++j)
			{
				if (value === sudoku.puzzle[i][j])
					return false;
			}
		}

		return true;
	};

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
		if ( ! sudoku.isCellMutable(cell))
			return false;

		// Build a list of the available values
		var availableForRand = [];

		for (var value in sudoku.availableValues[y][x])
		{
			if (sudoku.availableValues[y][x][value] === true)
			{
				availableForRand.push(parseInt(value));
			}
		}

		// Make sure that cell has values available
		if (availableForRand.length === 0)
			return false;

		// Get the index to select randomly
		var randIndex = Math.floor(Math.random() * availableForRand.length);

		return availableForRand[randIndex];
	};

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
		if ( ! sudoku.isCellMutable(cell))
			return false;

		// Set all values for this cell as available
		for (var i = 1; i < 10; ++i)
		{
			sudoku.availableValues[y][x][i] = true;
		}

		// Set the value of the cell to zero (unknown)
		sudoku.puzzle[y][x] = 0;
	};

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

		return sudoku.availableValues[y][x] !== false
	};

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
	};

	// Make the solve method public
	return {'solve' : this.solve};
}();