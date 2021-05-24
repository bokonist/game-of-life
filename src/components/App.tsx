import { useCallback, useState, useRef } from "react";

import "../styles/App.css";

import Preview from "./Preview";

import { ThemeContext } from "../contexts/ThemeContext";

import logo from "../assets/logo.svg";

function App() {
  const ROWS:number = 50,
    COLS:number = 50;

  let emptyGrid = (() => {
    let rows: number[][] = [];
    let col:number[] = [];
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        col.push(0);
      }
      rows.push(col);
      col = [];
    }
    return rows;
  })();
  let simulationReference:any = useRef(null);
  const [running, setRunning] = useState(false);
  const [grid, setGrid] = useState(emptyGrid);
  const [speed, setSpeed] = useState(500);
  const [infiniteGrid, setInfiniteGrid] = useState(true);
  const [theme, setTheme] = useState(true); //true for dark mode, false for light mode

  const runningRef = useRef(running);
  runningRef.current = running;

  const speedRef = useRef(speed);
  speedRef.current = speed;

  const infiniteRef = useRef(infiniteGrid);
  infiniteRef.current = infiniteGrid;

  const deepClone = (grid: number[][]) => {
    let newGrid:number[][] = [];
    grid.forEach((row:number[], i:number) => {
      let col: number[]= [];
      row.forEach((cell, j) => {
        col.push(grid[i][j]);
      });
      newGrid.push(col);
      col = [];
    });
    return newGrid;
  };
  const toggleCell = (i:number, j:number) => {
    setGrid((prevGrid) => {
      let gridClone = deepClone(prevGrid);
      gridClone[i][j] = gridClone[i][j] ? 0 : 1;
      return gridClone;
    });
  };

  const toggleTheme = () => {
    setTheme(!theme);
  };

  const runSimulation = useCallback(() => {
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
            if (infiniteRef.current) {
              //organisms wrap around the grid and come out the other side
              if (newI < 0) newI = ROWS - 1;
              if (newJ < 0) newJ = COLS - 1;
              if (newI >= ROWS) newI = 0;
              if (newJ >= COLS) newJ = 0;
              aliveNeighbors += prevGrid[newI][newJ];
            } else {
              if (newI >= 0 && newI < ROWS && newJ >= 0 && newJ < COLS) {
                aliveNeighbors += prevGrid[newI][newJ];
              }
            }
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
    if (simulationReference.current) clearTimeout(simulationReference.current);
    simulationReference.current = setTimeout(runSimulation, speedRef.current);
  }, []);

  const populateRandom = useCallback(() => {
    let rows = [];
    let col = [];
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        Math.random() > 0.5 ? col.push(0) : col.push(1);
      }
      rows.push(col);
      col = [];
    }
    setGrid(rows);
  }, []);
  const reset = useCallback(() => {
    setGrid(emptyGrid);
    setRunning(false);
  }, [emptyGrid]);
  const loadOrganism = useCallback(
    (organismBody) => {
      runningRef.current = true;
      setRunning(true);
      let gridCopy = deepClone(emptyGrid);
      //below logic is to load the organism body in the middle of the grid
      let freeHorizontalSpace = ROWS - organismBody[0].length;
      let freeVerticalSpace = COLS - organismBody.length;
      let gridColumnPointer = Math.floor(freeHorizontalSpace / 2),
        gridRowPointer = Math.floor(freeVerticalSpace / 2);

      for (let i = 0; i < organismBody.length; i++) {
        for (let j = 0; j < organismBody[0].length; j++) {
          gridCopy[gridRowPointer][gridColumnPointer] = organismBody[i][j];
          gridColumnPointer++;
        }
        gridColumnPointer = Math.floor(freeHorizontalSpace / 2);
        gridRowPointer++;
      }
      setGrid(gridCopy);
      runSimulation();
    },
    [emptyGrid, runSimulation]
  );
  return (
    <ThemeContext.Provider value={theme}>
      <div className={"App" + (theme ? "-dark" : "-light")}>
        <button
          className={"toggle-theme-button" + (theme ? "-dark" : "-light")}
          onClick={toggleTheme}
        >
          {theme ? "Light Mode" : "Dark Mode"}
        </button>
        <div className={"main-title-container"}>GAME OF LIFE</div>
        <div className={"main-body-container"}>
          <div className={"instructions"}>
            <img className={"logo"} alt="tree logo" src={logo}></img>
            <h1>INTRO</h1>
            <p>
              The Game of Life, is a Turing complete, cellular automaton devised
              by the British mathematician John Horton Conway in 1970.{" "}
              <a
                href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
                target="_"
              >
                Wikipedia
              </a>
            </p>
            <h1>RULES:</h1>
            <ul>
              <li>
                Any live cell with fewer than two live neighbours dies, as if by
                underpopulation.
              </li>
              <li>
                Any live cell with two or three live neighbours lives on to the
                next generation.
              </li>
              <li>
                Any live cell with more than three live neighbours dies, as if
                by overpopulation.
              </li>
              <li>
                Any dead cell with exactly three live neighbours becomes a live
                cell, as if by reproduction.
              </li>
            </ul>
          </div>
          <div className={"grid"}>
            {grid.map((rows, i) =>
              rows.map((cell, j) => {
                return (
                  <div
                    key={`${i}-${j}`}
                    style={{
                      backgroundColor:
                        grid[i][j] === 1 ? "#009c60" : "transparent",
                      border:
                        grid[i][j] === 1
                          ? "1px solid black"
                          : "1px solid #666666",
                    }}
                    className={"grid-cell"}
                    onClick={toggleCell.bind(null, i, j)}
                  >
                    {" "}
                  </div>
                );
              })
            )}
          </div>
          <div className={"options"}>
            <button
              className={"option-button"}
              onClick={() => {
                setRunning(!running);
                if (!running) {
                  runningRef.current = true;
                  runSimulation();
                }
              }}
            >
              {running ? "PAUSE SIMULATION" : "START SIMULATION"}
            </button>
            <div className={"options-tray"}>
              <button
                className={`${"option-tray-button"}  ${"reset-button"}`}
                onClick={() => {
                  reset();
                }}
              >
                {`RESET`}
              </button>
              <button
                className={`${"option-tray-button"}  ${"random-button"}`}
                onClick={() => {
                  populateRandom();
                }}
              >
                {`RANDOM POPULATION`}
              </button>
              <button
                className={`${"option-tray-button"}  ${"infinite-button"}`}
                onClick={() => {
                  setInfiniteGrid(!infiniteGrid);
                  infiniteRef.current = !infiniteGrid;
                }}
              >
                {`INFINITE GRID: ${infiniteGrid ? "ON" : "OFF"}`}
              </button>
            </div>

            <div className={"simulation-speed"}>
              <label htmlFor="speed">
                Simulation Interval: {speedRef.current}ms
              </label>
              <input
                type="range"
                id="speed"
                name="speed"
                min="50"
                max="1000"
                step="50"
                onInput={(e) => {
                  setSpeed(Number(e.currentTarget.value));
                }}
              />
            </div>
            <Preview loadOrganism={loadOrganism}></Preview>
          </div>
        </div>
        <div className="attributions">
          Icons made by{" "}
          <a href="https://www.freepik.com" title="Freepik">
            Freepik
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
