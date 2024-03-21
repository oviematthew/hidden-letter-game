import * as React from "react";
import {createBoard} from "./utils/createBoard"
import './App.css';

function App() {
 const [board, setBoard] = React.useState(() => createBoard())

  return (
    <div>
     {board.map((row, rowIdx) => (
      <div key={rowIdx}>{row.map((letter, letterIdx) => {
        <div key={letterIdx}>Cell</div>
      })}</div>
     ))}
    </div>
  );
}

export default App;
