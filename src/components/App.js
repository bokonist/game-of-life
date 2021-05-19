import { useCallback, useState, useRef } from "react";
import "../styles/App.css";

function App() {
  const ROWS = 50,
    COLS = 50;
  const [running, setRunning] = useState(false);
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
  const deepClone = (grid) => {
    let newGrid = [];
    grid.forEach((row, i) => {
      let col = [];
      row.forEach((cell, j) => {
        col.push(grid[i][j]);
      });
      newGrid.push(col);
      col = [];
    });
    return newGrid;
  };
  const toggleCell = (i, j) => {
    console.log("toggling cell", i, j);
    setGrid((prevGrid) => {
      let gridClone = deepClone(prevGrid);
      gridClone[i][j] = gridClone[i][j] ? 0 : 1;
      return gridClone;
    });
  };

  const runningRef = useRef(running);
  runningRef.current = running;
  const operations = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
  ];
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((prevGrid) => {
      let gridClone = deepClone(prevGrid);
      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          let aliveNeighbors = 0;
          operations.forEach(([x, y]) => {
            let newI = i + x;
            let newJ = j + y;
            newI < 0 ? (newI = ROWS - 1) : (newI = newI);
            newJ < 0 ? (newJ = COLS - 1) : (newJ = newJ);
            newI >= ROWS ? (newI = 0) : (newI = newI);
            newJ >= COLS ? (newJ = 0) : (newJ = newJ);
            aliveNeighbors += prevGrid[newI][newJ];
          });
          if (aliveNeighbors < 2 || aliveNeighbors > 3) {
            gridClone[i][j] = 0;
          } else if (aliveNeighbors === 3 && prevGrid[i][j] === 0) {
            gridClone[i][j] = 1;
          }
        }
      }
      return gridClone;
    });

    setTimeout(runSimulation, 200);
  }, []);
  return (
    <div className="App">
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "Stop simulation" : "Start simulation"}
      </button>
      <div className="grid">
        {grid.map((rows, i) =>
          rows.map((cell, j) => {
            return (
              <div
                key={`${i}-${j}`}
                style={{
                  backgroundColor: grid[i][j] === 1 ? "#1b5e1896" : "white",
                }}
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
