import { createCell } from "./createCell";

const couples = [
  ["B", "D"],
  ["C", "D"],
  ["g", "q"],
  ["G", "6"],
  ["L", "I"],
  ["O", "0"],
  ["V", "U"],
  ["Z", "2"],
  ["F", "E"],
  ["K", "X"],
  ["p", "q"],
  ["B", "8"],
  ["W", "M"],
  ["S", "5"],
  ["l", "1"],
  ["n", "m"],
  ["r", "n"],
  ["T", "Y"],
  ["a", "o"],
  ["P", "R"],
  ["u", "v"],
  ["c", "e"],
  ["x", "k"],
  ["H", "M"],
];

export function createBoard() {
  const board = [];
  const randomIdx = Math.floor(Math.random() * (couples.length - 1));
  const randomCouple = couples[randomIdx];
  const randomLetter = Math.random() > 0.5 ? 1 : 0;
  const hiddenLetter = randomLetter === 1 ? 0 : 1;
  const randomRowSize = 20;
  const randomColSize = 15;

  for (let row = 0; row < randomRowSize; row++) {
    const newRow = [];

    for (let col = 0; col < randomColSize; col++) {
      newRow.push(createCell(row, col, randomCouple[randomLetter]));
    }
    board.push(newRow);
  }
  // insert random hidden letter
  insertRandomLetter(
    board,
    randomCouple[hiddenLetter],
    randomRowSize,
    randomColSize
  );
  return board;
}

function insertRandomLetter(board, letter, r, c) {
  const row = Math.floor(Math.random() * r);
  const col = Math.floor(Math.random() * c);

  if (board[row][col]) {
    board[row][col].letter = letter;
    board[row][col].isHidden = letter;
  }
}
