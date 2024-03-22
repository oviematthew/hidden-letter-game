import * as React from "react";
import { createBoard } from "./utils/createBoard";
import Cell from "./components/Cell";
import "./App.css";

function App() {
  const [board, setBoard] = React.useState(() => createBoard());

  return (
    <div className="App">
      {board.map((row, rowIdx) => (
        <div key={rowIdx} className="row">
          {row.map((letter, letterIdx) => (
            <Cell key={letterIdx} {...letter} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
