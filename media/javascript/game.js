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
	 * When clicking the "Start Runtime Tests" button
	 * the solver will display the runtime tests overlay
	 * and begin solving many puzzels
	 */
	$('#test').bind('click', function()
	{
		// Get the runtimeTests element (and show it)
		var runtimeTests = $('#runtime-tests').show();

		// Stop the testing if we click again while testing
		if (board.runtimeTestRef)
		{
			clearInterval(board.runtimeTestRef);
			board.runtimeTestRef = false;
			board.find('input').val('');
			runtimeTests.hide();

			return false;
		}

		// Setup the variables to display and keep track of
		var iterations       = 0,
		    min              = 9007199254740992,
		    max              = 0,
		    average          = 0,
		    totalTime        = 0,
		    start            = 0,
		    duration         = 0,
		    iterationElement = runtimeTests.find('.iterations .value')[0],
		    minElement       = runtimeTests.find('.min-time .value')[0],
		    maxElement       = runtimeTests.find('.max-time .value')[0],
		    avgElement       = runtimeTests.find('.avg-time .value')[0];

		// Do many iterations
		board.runtimeTestRef = setInterval(function()
		{
			++iterations;

			// Load a puzzel to solve
			var puzzel = sudoku.getRandomPuzzel();

			// Solve with a time test
			start    = new Date().getTime();
			puzzel   = sudoku.solve(puzzel);
			duration = new Date().getTime() - start;

			// Set the puzzel to the board for extra cool effects
			board.setPuzzle(puzzel);

			// Calculate the min, max, and average time
			min = Math.min(min, duration);
			max = Math.max(max, duration);
			avg = Math.round((totalTime += duration) / iterations * 100) / 100;

			// Set the values on the runtime tests
			iterationElement.innerHTML = iterations;
			minElement.innerHTML       = min + 'ms';
			maxElement.innerHTML       = max + 'ms';
			avgElement.innerHTML       = avg + 'ms';
		});
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