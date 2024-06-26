import * as React from "react";
import useSound from "use-sound";
import { createBoard } from "./utils/createBoard";
import Cell from "./components/Cell";
import "./App.css";
import ConfettiExplosion from "react-confetti-explosion";
import correctAnswerSound from "./media/sounds/correct.mp3";
import wrongAnswerSound from "./media/sounds/buzzer.mp3";
import finishedGameSound from "./media/sounds/victory.mp3";

function App() {
  const [board, setBoard] = React.useState(() => createBoard());
  const [gamesToWin, setGamesToWin] = React.useState(5);
  const [timer, setTimer] = React.useState(0);
  const [gameStarted, setGameStarted] = React.useState(false);
  const [isExploding, setIsExploding] = React.useState(false);
  const [gamesWon, setGamesWon] = React.useState(0);

  const milliseconds = (timer / 10).toFixed(2);

  const [playDoneSound] = useSound(finishedGameSound);
  const [playCorrectSound] = useSound(correctAnswerSound);
  const [playWrongSound] = useSound(wrongAnswerSound);

  React.useEffect(() => {
    if (gameStarted && gamesToWin > 0) {
      const interval = setInterval(() => {
        setTimer(timer + 1);
      }, 100);
      return () => clearInterval(interval);
    } else if (gamesToWin === 0) {
      setIsExploding(true);
      setGamesWon(gamesWon + 1);

      setTimeout(() => {
        playDoneSound();
      }, 600);
    }
  }, [gameStarted, gamesToWin, timer]);

  function handleClick(row, col) {
    if (board[row][col].isHidden) {
      setGamesToWin(gamesToWin - 1);
      playCorrectSound();

      setTimeout(() => {
        setBoard(createBoard());
      }, 500);
    } else {
      playWrongSound();
    }
  }

  function playAgain() {
    setGamesToWin(5);
    setGameStarted(false);
    setTimer(0);
  }

  function startGame() {
    setGameStarted(true);
  }

  return (
    <div className="App">
      <h1>Hidden Letter Game</h1>
      <div className="flex">
        <p>Games Won: {gamesWon}</p>
      </div>

      {!gameStarted && (
        <button className="btn" onClick={startGame}>
          Start Game
        </button>
      )}

      {gameStarted && (
        <div>
          {gamesToWin > 0 && <p>Time: {milliseconds} seconds </p>}

          {gamesToWin === 0 ? (
            <p> Congratulations 🥳, your time was: {milliseconds} seconds </p>
          ) : (
            <p>Games needed to win: {gamesToWin} </p>
          )}

          <div>
            {gamesToWin > 0 && (
              <div className="gameboard">
                {board.map((row, rowIdx) => (
                  <div key={rowIdx} className="row">
                    {row.map((letter, letterIdx) => (
                      <Cell
                        key={letterIdx}
                        handleClick={handleClick}
                        {...letter}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}

            {gamesToWin === 0 && isExploding && <ConfettiExplosion />}

            {gamesToWin === 0 && (
              <button className="btn" onClick={playAgain}>
                Play Again
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
