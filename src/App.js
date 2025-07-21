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
  const [userName, setUserName] = React.useState("");
  const [gameJustFinished, setGameJustFinished] = React.useState(false);
  const [leaderboard, setLeaderboard] = React.useState(() => {
    return JSON.parse(localStorage.getItem("leaderboard")) || [];
  });

  const milliseconds = (timer / 10).toFixed(2);

  const [playDoneSound] = useSound(finishedGameSound);
  const [playCorrectSound] = useSound(correctAnswerSound);
  const [playWrongSound] = useSound(wrongAnswerSound);

  React.useEffect(() => {
    if (gameStarted && gamesToWin > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 100);
      return () => clearInterval(interval);
    } else if (gamesToWin === 0 && !gameJustFinished) {
      setGameJustFinished(true); // mark that game just ended
      setIsExploding(true);
      setGamesWon((prev) => prev + 1);

      const entry = {
        name: userName,
        time: parseFloat(milliseconds),
      };

      // Sort leaderboard and add new entry
      const updatedLeaderboard = [...leaderboard, entry].sort(
        (a, b) => a.time - b.time
      );

      setLeaderboard(updatedLeaderboard);
      localStorage.setItem("leaderboard", JSON.stringify(updatedLeaderboard));

      setTimeout(() => {
        playDoneSound();
      }, 600);
    }
  }, [
    gameJustFinished,
    gameStarted,
    gamesToWin,
    leaderboard,
    milliseconds,
    playDoneSound,
    userName,
  ]);

  // Function to handle cell click
  function handleClick(row, col) {
    if (board[row][col].isHidden) {
      setGamesToWin((prev) => prev - 1);
      playCorrectSound();
      setTimeout(() => {
        setBoard(createBoard());
      }, 500);
    } else {
      playWrongSound();
    }
  }
  // Function to play again
  function playAgain() {
    setGamesToWin(5);
    setGameStarted(false);
    setTimer(0);
    setIsExploding(false);
    setGameJustFinished(false);
    startGame();
  }

  // Function to capitalize the first letter of the username
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Function to start the game
  function startGame() {
    if (userName.trim()) {
      setUserName(capitalizeFirstLetter(userName));
      setGameStarted(true);
      setTimer(0);
      setGamesToWin(5);
      setBoard(createBoard());
    }
  }

  // Function to handle username input change
  function handleUsernameChange(e) {
    setUserName(e.target.value);
  }

  // Function to change user and reset game state
  function changeUser() {
    setUserName("");
    setGameStarted(false);
    setGamesToWin(5);
    setTimer(0);
    setIsExploding(false);
    setGameJustFinished(false);
  }

  return (
    <div className="App">
      <h1>Hidden Letter Game</h1>

      {!gameStarted && (
        <div>
          <input
            type="text"
            placeholder="Enter your username"
            className="username-input"
            value={userName}
            onChange={handleUsernameChange}
          />
          <br />
          <button
            className="btn"
            onClick={startGame}
            disabled={!userName.trim()}
          >
            Start Game
          </button>
        </div>
      )}

      {gameStarted && (
        <div>
          {gamesToWin > 0 && (
            <div className="flex">
              <p className="orange">Hey {userName}!</p>
              <p>Time: {milliseconds}secs</p>
            </div>
          )}

          {gamesToWin > 0 ? (
            <p>Games left: {gamesToWin}</p>
          ) : (
            <>
              <div className="flex">
                <p>
                  🎉 Congrats <span className="orange">{userName}</span>, your
                  time was: {milliseconds} seconds!
                </p>

                <p>Games Won: {gamesWon}</p>
              </div>

              <div className="leaderboard">
                <h3>🏆 All Time Leaderboard</h3>
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Username</th>
                      <th>Time (s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{entry.name}</td>
                        <td>{entry.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

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
            <div className="buttons">
              <button className="btn" onClick={playAgain}>
                Play Again
              </button>
              <button className="btn-secondary" onClick={changeUser}>
                Change User
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
