// Control the state of the board
function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const addMark = function (player, row, column) {
        const cell = board[row][column];
        // Check for available spaces
        if (cell.getValueCell() !== 0) {
            return;
        }

        cell.changeCellValue(player.mark);
    }

    return { board, addMark }
}

// Individual cell from the board
function Cell() {
    let value = 0;

    const changeCellValue = function (mark) {
        value = mark;
    };

    return { value, changeCellValue };
}

// Control the flow of the game

Gameboard();