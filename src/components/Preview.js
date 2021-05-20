import { useEffect, useState } from "react";
import "../styles/Preview.css";
function Preview() {
  let organisms = [
    {
      name: "block",
      startState: [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
      ],
      classification: "Still Life",
    },
    {
      name: "bee hive",
      startState: [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0],
        [0, 1, 0, 0, 1, 0],
        [0, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      classification: "Still Life",
    },
    {
      name: "loaf",
      startState: [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0],
        [0, 1, 0, 0, 1, 0],
        [0, 0, 1, 0, 1, 0],
        [0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      classification: "Still Life",
    },
    {
      name: "boat",
      startState: [
        [0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0],
      ],
      classification: "Still Life",
    },
    {
      name: "tub",
      startState: [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0],
      ],
      classification: "Still Life",
    },
    {
      name: "blinker",
      startState: [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0],
      ],
      classification: "Oscillator",
    },

    {
      name: "toad",
      startState: [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      classification: "Oscillator",
    },
    {
      name: "beacon",
      startState: [
        [0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0],
        [0, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 0],
        [0, 0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      classification: "Oscillator",
    },
    /*{
      name: "placeholder",
      startState: [],
      classification: "",
    },*/
  ];
  let [selection, setSelection] = useState(7);
  let [previewGrid, setPreviewGrid] = useState(organisms[selection].startState);
  //useEffect(() => {}, [previewGrid]);
  const changeSelection = (direction) => {
    let newSelection = 0;
    if (direction === "left") {
      setSelection((prevSelection) => {
        newSelection = prevSelection - 1;
        if (newSelection < 0) {
          newSelection = organisms.length - 1;
        }
        setPreviewGrid(organisms[newSelection].startState);
        return newSelection;
      });
    } else if (direction === "right") {
      setSelection((prevSelection) => {
        newSelection = prevSelection + 1;
        if (newSelection >= organisms.length) {
          newSelection = 0;
        }
        setPreviewGrid(organisms[newSelection].startState);
        return newSelection;
      });
    }
  };
  return (
    <div className="preview-container">
      <div className="preview-grid-container">
        <button
          className="left-button carousel-button"
          onClick={() => {
            changeSelection("left");
          }}
        >{`<`}</button>
        <div
          className="preview-grid"
          style={{
            gridTemplateColumns: `repeat(${previewGrid[0].length}, 1fr)`,
            gridTemplateRows: `repeat(${previewGrid.length}, 1fr)`,
          }}
        >
          {previewGrid.map((rows, i) =>
            rows.map((cell, j) => {
              return (
                <div
                  key={`${i}-${j}`}
                  style={{
                    backgroundColor:
                      previewGrid[i][j] === 1 ? "purple" : "transparent",
                    height: `calc(20/${previewGrid.length})rem`,
                  }}
                  className="preview-grid-cell"
                >
                  {" "}
                </div>
              );
            })
          )}
        </div>
        <button
          className="right-button  carousel-button"
          onClick={() => {
            changeSelection("right");
          }}
        >{`>`}</button>
      </div>
      <div className="preview-info">
        <p className="organism-name">Name: {organisms[selection].name}</p>
        <p className="organism-classification">
          Classification: {organisms[selection].classification}
        </p>
      </div>
    </div>
  );
}
export default Preview;
