import { useState } from "react";
import "../styles/App.css";

function App() {
  const ROWS = 50,
    COLS = 50;
  const [grid, setGrid] = useState(() => {
    let rows = [];
    let col = [];
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        col.push(0);
      }
      rows.push(col);
      col = [];
    }
    return rows;
  });
  const toggleCell = (i, j) => {
    console.log("toggling cell", i, j);
    setGrid((prevGrid) => {
      let gridClone = [...[...prevGrid]];
      gridClone[i][j] = gridClone[i][j] === 1 ? 0 : 1;
      return gridClone;
    });
  };
  return (
    <div className="App">
      <div className="grid">
        {grid.map((rows, i) =>
          rows.map((cell, j) => {
            return (
              <div
                key={`${i}-${j}`}
                style={{ backgroundColor: grid[i][j] === 1 ? "pink" : "white" }}
                className="grid-cell"
                onClick={toggleCell.bind(null, i, j)}
              >
                {" "}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
// <div> key={`${i}-${j}`} className="grid-cell"> </div>

export default App;
