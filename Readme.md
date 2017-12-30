# Maze Puzzle
Its my own implementation of Maze Puzzle. It mainly have only one Algorithm on its heart, the maze generation algorithm.

## Maze Generation
I used [Recursive backtracker Algorithm ](https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_backtracker)to Generate Maze here is the simple steps to solve it (From Wikipedia):

1. Initialize the board with four walls to each cell.
2. Pick first cell, mark it as visited & current, remove left wall(start point).
3. While there are unvisited cells.
    1. If the current cell has any neighbors which have not been visited.
        1. Choose randomly one of the unvisited neighbors.
        2. Make the wall a passage and mark the unvisited cell as part of the maze.
        3. Remove the wall between the current cell and the chosen cell.
        4. Make the chosen cell the current cell and mark it as visited
    2. Else if stack is not empty
        1. Pop a cell from the stack
        2. Make it the current cell

## Board Logic
The board logic of the game is very simple just create nxn cells(div) inside board and make walls using borders.

## Player Logic
Its also very simple. Create an div slightly smaller than the size of a cell, make its position absolute. It move on following steps:

1. Get underlying cell using position.
2. if the underlying cell don't have border where user wanted to move.
    1. Update the position of player according to direction.

## Solution Logic
Algorithm of Solving Puzzle:

1. If we have only one direction to move
    1. Just move in the dir
2. Else if more than one dirs to move
    1. Add restore point at the current state.
    2. try first possible dir
3. Else if there is no possible dir
    1. Restore most recent state


## TODO:
If there is no possible direction we just jump back to most recent saved state. We should have to save all the moves and restore step by step.