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
	var getPuzzleForm = function()
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

});