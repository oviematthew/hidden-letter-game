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

]

export function createBoard(){
    const board = []
    const randomIdx = Math.floor(Math.random() * (couples.length - 1));
    const randomCouple = couples[randomIdx];
    const randomLetter = Math.random() > .5 ? 1 : 0;
    const hiddenLetter = randomLetter === 1 ? 0 : 1;
    const randomRowSize = Math.floor(Math.random() * 25);
    const randomColSize = Math.floor(Math.random() * 20);
    

    for(let row = 0; row < randomRowSize + 1; row++ ) {
        const newRow = []

        for(let col = 0; col < randomColSize + 1; col++ ) {
            newRow.push(createCell(row, col, randomCouple[randomLetter]))
        }
        board.push(newRow);
    }
    // insert random hidden letter
    return board;
}