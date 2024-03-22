import * as React from "react";
import { createBoard } from "./utils/createBoard";
import Cell from "./components/Cell";
import "./App.css";

function App() {
  const [board, setBoard] = React.useState(() => createBoard());
  const [gamesToWin, setGamesToWin] = React.useState(5);
  const [timer, setTimer] = React.useState(0);
  const miliseconds = (timer / 10).toFixed(2);

  React.useEffect(() => {
    if (gamesToWin > 0) {
      const interval = setInterval(() => {
        setTimer(timer + 1);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [gamesToWin, timer]);

  function handleClick(row, col) {
    if (board[row][col].isHidden) {
      setGamesToWin(gamesToWin - 1);

      setTimeout(() => {
        setBoard(createBoard());
      }, 500);
    }
  }

  return (
    <div className="App">
      <h1>Hidden Letter Game</h1>
      {gamesToWin > 0 && <p>Time Taken: {miliseconds} </p>}

      {gamesToWin === 0 ? (
        <p> Congratulations 🥳, your time was: {miliseconds} </p>
      ) : (
        <p>Games needed to win: {gamesToWin} </p>
      )}

      <div>
        {gamesToWin > 0 && (
          <div>
            {board.map((row, rowIdx) => (
              <div key={rowIdx} className="row">
                {row.map((letter, letterIdx) => (
                  <Cell key={letterIdx} handleClick={handleClick} {...letter} />
                ))}
              </div>
            ))}
          </div>
        )}

        {gamesToWin === 0 && (
          <button onClick={() => window.location.reload()}>Restart Game</button>
        )}
      </div>
    </div>
  );
}

export default App;
