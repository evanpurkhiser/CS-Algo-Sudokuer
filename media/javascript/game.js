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
		// Store the puzzel in this array
		var puzzle = [];

		// Iterate over each of the cells input elements
		board.find('input').each(function(_, cell)
		{
			// match the row and column in the name
			var index = cell.name.match(/index-([0-9]+)/);

			// Set the value of the cell in the puzzle array
			puzzle[index[1]] = parseInt(cell.value) || 0;
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
		for (var index in puzzle)
		{
			// Get the input element for this cell and it's value
			var inputCell = board.find('input[name="index-' + index + '"]')[0];
			var cellValue = puzzle[index];

			// For cells with zero values empty them
			inputCell.value = cellValue === 0 ? '' : cellValue;
		}
	};

	/**
	 * When clicking the "Load a puzzle" button
	 * get a random puzzle from the list of puzzles
	 * in the sudoku puzzles object and set the board
	 * to the random puzzle
	 */
	$('#load').bind('click', function()
	{
		var puzzel = sudoku.getRandomPuzzel();

		console.log(puzzel);

		// Load a puzzle and set the board to the puzzle
		board.setPuzzle(puzzel);


		console.log(board.getPuzzle());
	});

	/**
	 * When clicking on the "Solve the puzzle" button
	 * grab the current puzzle on the board and convert
	 * it to a puzzle arraay, then solve the puzzle.
	 * After solving set teh puzzle to the board
	 *
	 * Also report running times in an alert
	 */
	$('#solve').bind('click', function()
	{
		// Solve the puzzle and get the resultant object
		var solved = sudoku.solve(board.getPuzzle());

		// Set the board to the solved puzzle
		board.setPuzzle(solved);
	});

	/**
	 * When clicking on the "Clear the board" button
	 * reset all of the input values on the board
	 */
	$('#clear').bind('click', function()
	{
		board.find('input').val('');
	});

	/**
	 * When entering text into any of the boards input
	 * fields, don't allow any lettrs or numbers greater
	 * than 9.
	 */
	board.find('input').bind('keyup', function()
	{
		// Make sure the number is valid
		if ( ! /^[1-9]$/.test(this.value))
		{
			this.value = '';
			return false;
		}

		// Blur after entering a value
		this.blur();
	});

});