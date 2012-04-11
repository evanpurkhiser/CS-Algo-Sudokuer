* NOTE: This readme is out of date and needs rewritten, please refer to the actual code!*

## Sudokuer

A very rudimentary and basic [Sudoku](http://en.wikipedia.org/wiki/Sudoku) puzzle
solver written in JavaScript that uses a backtracking algorithm to find a single
solution to a puzzle.

This solver does not check for uniqueness in the puzzle, nor will it alert you if
there are more than one solutions to any given puzzle. If you enter a puzzle which
may have more than a single unique solution (for example an empty board), then
the solver will simply generate one random solution from the set of all solutions.

#### The solver.js API

The solver is implemented as a JavaScript singleton object. The object only has
a single exposed method.

`solver.solve(unsolvedPuzzle)`

The `unsolvedPuzzle` should be a 2d array consisting of rows and columns. for any
value which is not given in the puzzle, a zero `0` value should be used in place
of the empty cell. All other elements of the array should be filled with the given
values for the puzzle.

This method will return an object with the following keys

`puzzle`: The solved puzzle, in the same 2d array format as described before

`iterations`: The number of iterations it took to solve the puzzle

`backtracks`: The number of times the algorithm had to backtrack and fix numbers

`runningTime`: The total time (in milliseconds) that the solver took to compute
the solution to the puzzle.

If the algorithm was unable to solve the puzzle then boolean false will be returned.

#### Motivation

This project was done in conjunction with Drew Johnson
([@noautosave](https://github.com/noautosave)) for our *Introduction to Algorithms*
class as a final project. While not the most complex algorithm to implement, it
was indeed interesting and challenging.