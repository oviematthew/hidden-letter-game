import * as React from "react";

export default function Cell({ row, col, isHidden, letter, handleClick }) {
  const [correct, setCorrect] = React.useState(false);
  const [incorrect, setIncorrect] = React.useState(false);

  function handleCell() {
    if (isHidden) {
      setCorrect(true);

      //Reset status
      setTimeout(() => {
        setCorrect(false);
      }, 500);
    } else {
      setIncorrect(true);

      //Reset status
      setTimeout(() => {
        setIncorrect(false);
      }, 500);
    }
    handleClick(row, col);
  }

  return (
    <div
      onClick={handleCell}
      className={
        correct ? "correct cell" : incorrect ? "incorrect cell" : "cell"
      }
    >
      {letter}
    </div>
  );
}
