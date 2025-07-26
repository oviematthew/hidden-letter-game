import * as React from "react";
import useSound from "use-sound";
import { createBoard } from "./utils/createBoard";
import Cell from "./components/Cell";
import "./App.css";
import ConfettiExplosion from "react-confetti-explosion";
import correctAnswerSound from "./media/sounds/correct.mp3";
import wrongAnswerSound from "./media/sounds/buzzer.mp3";
import countdownSound from "./media/sounds/3-2-1-countdown.mp3";
import finishedGameSound from "./media/sounds/victory.mp3";
import Leaderboard from "./components/Leaderboard";

function App() {
  const [board, setBoard] = React.useState(() => createBoard());
  const [gamesToWin, setGamesToWin] = React.useState(5);
  const [countdown, setCountdown] = React.useState(null);
  const [showCountdownText, setShowCountdownText] = React.useState(false);
  const [timer, setTimer] = React.useState(0);
  const [gameStarted, setGameStarted] = React.useState(false);
  const [isExploding, setIsExploding] = React.useState(false);
  const [gamesWon, setGamesWon] = React.useState(0);
  const [showLeaderboard, setShowLeaderboard] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  const [latestEntry, setLatestEntry] = React.useState(null);
  const [gameJustFinished, setGameJustFinished] = React.useState(false);
  const [leaderboard, setLeaderboard] = React.useState(() => {
    return JSON.parse(localStorage.getItem("leaderboard")) || [];
  });

  const milliseconds = (timer / 10).toFixed(2);

  const [playDoneSound] = useSound(finishedGameSound);
  const [playCorrectSound] = useSound(correctAnswerSound);
  const [playWrongSound] = useSound(wrongAnswerSound);
  const [playCountdownSound] = useSound(countdownSound);

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
      const updatedLeaderboard = [...leaderboard, entry]
        .sort((a, b) => a.time - b.time)
        .slice(0, 10); // Limit to top 10 entries

      setLeaderboard(updatedLeaderboard);
      setLatestEntry(entry); // Set latest entry for highlighting

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
    const cell = board[row][col];
    if (!cell.clicked) {
      const newBoard = board.map((r, rowIdx) =>
        r.map((c, colIdx) => {
          if (rowIdx === row && colIdx === col) {
            return { ...c, clicked: true }; // mark clicked
          }
          return c;
        })
      );
      setBoard(newBoard);

      if (cell.isHidden) {
        setGamesToWin((prev) => prev - 1);
        playCorrectSound();
        setTimeout(() => {
          setBoard(createBoard());
        }, 500);
      } else {
        playWrongSound();
      }
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
      setShowCountdownText(true);
      playCountdownSound();

      // Countdown from 3 to 0
      let count = 3;
      setCountdown(count);

      const countdownInterval = setInterval(() => {
        count -= 1;
        if (count >= 0) {
          setCountdown(count);
        }
        if (count < 0) {
          setShowLeaderboard(false);
          clearInterval(countdownInterval);
          setShowCountdownText(false);
          setGameStarted(true);
          setTimer(0);
          setGamesToWin(5);
          setBoard(createBoard());
        }
      }, 1000);
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

      {!gameStarted && !showCountdownText && (
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              startGame();
            }}
          >
            <input
              type="text"
              placeholder="Enter your username"
              className="username-input"
              value={userName}
              onChange={handleUsernameChange}
            />
            <br />
            <button className="btn" type="submit" disabled={!userName.trim()}>
              Start Game
            </button>
          </form>

          {showLeaderboard && (
            <div className="leaderboard">
              {leaderboard.length > 0 ? (
                <Leaderboard leaderboard={leaderboard} />
              ) : (
                <p className="empty-leaderboard">
                  No games played yet. Be the first!
                </p>
              )}
            </div>
          )}

          {/* 👇 Text-style leaderboard toggle */}
          <p
            className="toggle"
            onClick={() => setShowLeaderboard((prev) => !prev)}
          >
            {showLeaderboard ? "Hide Leaderboard" : "Show Leaderboard"}
          </p>
        </div>
      )}

      {showCountdownText && (
        <div className="countdown">
          <p className="countdown-text">
            {countdown > 0
              ? `🌀 ${countdown}...`
              : countdown === 0
              ? "🎯 GO!"
              : ""}
          </p>
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
            <p>Boards left: {gamesToWin}</p>
          ) : (
            <>
              <div className="flex">
                <p>
                  🎉 Congrats <span className="orange">{userName}</span>, your
                  time was:{" "}
                  <span className="orange">{milliseconds} seconds!</span>
                </p>

                {/* Removing gameswon till i add individual user games won */}
                {/* <p>Games Won: {gamesWon}</p> */}
              </div>
              <hr />
              <Leaderboard
                leaderboard={leaderboard}
                latestEntry={latestEntry}
              />
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
            <>
              <div className="buttons">
                <button className="btn" onClick={playAgain}>
                  Play Again
                </button>
                <button className="btn-secondary" onClick={changeUser}>
                  Change User
                </button>
              </div>
              <p className="toggle" onClick={() => changeUser()}>
                Go Home
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
