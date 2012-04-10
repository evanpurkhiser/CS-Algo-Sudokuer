$(function()
{
	var board = $('#board');

	/**
	 * Create a 2D puzzle array from the
	 * current values filled into the puzzle
	 * form inputs on the board
	 *
	 * @return {Array} The puzzle board
	 */
	board.getPuzzle = function()
	{
		// Setup the new puzzle array in here
		var puzzle = [[], [], [], [], [], [], [], [], []];

		// Iterate over each of the cells input elements
		board.find('input').each(function(_, cell)
		{
			// match the row and column in the name
			var index = cell.name.match(/value\[([0-9])\]\[([0-9])\]/);

			// Set the value of the cell in the puzzle array
			puzzle[index[1]][index[2]] = cell.value || 0;
		});

		return puzzle;
	};

	/**
	 * Set the input elements on the puzzle
	 * board to the values defined in the 2D
	 * puzzle array where zero values are empty
	 * cells and all other values are set
	 *
	 * @param {Array} puzzle The puzzle to fill in to the form
	 */
	board.setPuzzle = function(puzzle)
	{
		// Iterate over the puzzle
		for (var row in puzzle)
		{
			for (var column in puzzle[row])
			{
				// Get the input element for this cell
				var inputName = 'value['+row+']['+column+']';
				var inputCell = board.find('input[name="'+inputName+'"]')[0];
				var cellValue = puzzle[row][column];

				// For cells with zero values empty them
				inputCell.value = cellValue === 0 ? '' : cellValue;
			}
		}
	};

	/**
	 * When clicking the 'Generate A Puzzle' button
	 * use the sudoku object to generate a random
	 * puzzle array and then save set the board to the
	 * puzzle array
	 */
	$('#generate').bind('click', function()
	{
		// Generate a puzzle and set the board to it
		board.setPuzzle(sudoku.generate());
	});


});