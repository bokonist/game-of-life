import { useState } from "react";
import "../styles/Preview.css";
function Preview() {
  let options = {
    block: [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    beeHive: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0],
      [0, 1, 0, 0, 1, 0],
      [0, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ],
    loaf: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0],
      [0, 1, 0, 0, 1, 0],
      [0, 0, 1, 0, 1, 0],
      [0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ],
  };
  let [previewGrid, setPreviewGrid] = useState(options.beeHive);

  return (
    <div className="preview-container">
      <div className="preview-grid-container">
        <button className="left-button carousel-button">{`<`}</button>
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
        <button className="right-button  carousel-button">{`>`}</button>
      </div>
      <div className="preview-info">
        <p className="organism-name">Name: Block</p>
        <p className="organism-classification">Classification: Still-life</p>
      </div>
    </div>
  );
}
export default Preview;
