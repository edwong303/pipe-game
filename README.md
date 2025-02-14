# Pipe Game Helper  

This is a **Pipe Game Helper**, an assisting tool allowing you to solve the [**Pipe Game**](https://www.puzzle-pipes.com/) easily.  

## How to Start  

1. Install dependencies by running:  
   ```sh
   npm install
   ```
2. Start the application:  
   ```sh
   npm run dev
   ```
3. Open **DevTools** in the Pipe Game, then go to the **Console** tab.  
4. Copy the code from `pipe.js`, paste it into the Console, and run it. You will see three variables generated.  
5. Copy the generated text and overwrite content in `puzzles/pipe.ts`.  
6. Refresh the page to see the updated puzzle.  
7. If **wrap mode** is enabled, two arrows will appear at the bottom left. You can use these to shift the puzzle for better readability.  

## How to Play  

1. The goal is to rotate the tiles on the grid so that all pipes are connected in a single group. **Closed loops are not allowed.** (Reference: [Puzzle Pipes](https://www.puzzle-pipes.com/))  
2. **Click** a tile to rotate it.  
3. **Right-click** a tile to lock it.  
4. You win when **all pipes turn blue** and no closed loops are present.  

## Tile Representations  

- **Grey pipe**: Unconnected pipe  
- **Blue pipe with a red dot at the center**: Source pipe  
- **Blue pipe**: Connected pipe  
- **Solid red pixel next to a pipe**: The pipe **must not** be rotated in that direction (e.g., connecting to an edge in non-wrapped mode).  
- **Semi-transparent red pixel next to a pipe**: The neighboring tile is **locked**, making it impossible for the pipe to rotate in that direction.  

## TODO  

- **Close loop detection**
- **Improve UI responsiveness**