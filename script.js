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

    const addMark = function (mark, row, column) {
        const cell = board[row][column];
        // Check if it is available
        if (cell.getCellValue() !== 0) {
            return;
        }

        cell.changeCellValue(mark);
        return cell;
    };

    const getBoard = () => {
        return board;
    };

    const getFormattedBoard = () => {
        let marksArr = [];
        let formmatedBoard = "";
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                marksArr.push(board[i][j].getCellValue());
            }
        }

        for (let i = 0; i < 9; i++) {
            if (i % 3 == 0 && i > 0) {
                formmatedBoard += "\n";
            }
            formmatedBoard += ` ${marksArr[i]}`;
        }

        return formmatedBoard;

    };

    return { getBoard, addMark, getFormattedBoard };
}

// Individual cell from the board
function Cell() {
    let value = 0;

    const getCellValue = () => {
        return value;
    };

    const changeCellValue = function (mark) {
        value = mark;
    };

    return { getCellValue, changeCellValue };
}

// Control the flow of the game
function GameController(name1 = "Player1", name2 = "Player2") {
    // Create players object
    const players = {
        player1: {
            name: name1,
            mark: 1,
        },
        player2: {
            name: name2,
            mark: 2,
        },
    };

    const gameBoard = Gameboard();
    let activePlayer = players.player1;

    const switchTurn = () => {
        activePlayer == players.player1
            ? (activePlayer = players.player2)
            : (activePlayer = players.player1);
    };

    const playRound = () => {
        console.log(`${activePlayer.name}'s turn...`);

        let row = prompt("Select a row (0 - 2)");
        let col = prompt("Select a column (0 - 2)");

        if (!gameBoard.addMark(activePlayer.mark, row, col)) {
        }

        console.log(gameBoard.getFormattedBoard());
        switchTurn();
    };

    return { playRound, switchTurn, players };
}

const game = GameController();
game.playRound();
game.playRound();
