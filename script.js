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
            formmatedBoard += `${marksArr[i]}`;
        }

        return { formmatedBoard, marksArr };
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
    let winner = false;

    const switchTurn = () => {
        activePlayer == players.player1
            ? (activePlayer = players.player2)
            : (activePlayer = players.player1);
    };

    const playRound = (row, col) => {
        console.log(`${activePlayer.name}'s turn...`);

        if (!gameBoard.addMark(activePlayer.mark, row, col) || winner) {
            return;
        }

        let winnerResult = checkWinner();
        if (winnerResult == "TIE") {
            console.log("TIEEEEEEE");
            winner = true;
        } else if (winnerResult) {
            console.log(activePlayer.name, "WINS");
            winner = true;
        } else if (winnerResult == 3) {
            console.log("THERE IS A TIE");
            winner = true;
        }

        switchTurn();
    };

    const checkWinner = () => {
        const boardValues = gameBoard.getBoard();

        // Check rows
        for (let i = 0; i < 3; i++) {
            // Loop every cell in the row
            let firstCell = boardValues[i][0].getCellValue();
            let secondCell = boardValues[i][1].getCellValue();
            let thirdCell = boardValues[i][2].getCellValue();

            if (
                firstCell == secondCell &&
                secondCell == thirdCell &&
                firstCell != 0
            ) {
                return true;
            }
        }

        // Check columns
        for (let i = 0; i < 3; i++) {
            let firstCell = boardValues[0][i].getCellValue();
            let secondCell = boardValues[1][i].getCellValue();
            let thirdCell = boardValues[2][i].getCellValue();

            if (
                firstCell == secondCell &&
                secondCell == thirdCell &&
                firstCell != 0
            ) {
                return true;
            }
        }

        // Check diagonals
        let middleCell = boardValues[1][1].getCellValue();

        // First diagonal values
        let upleftCell = boardValues[0][0].getCellValue();
        let bottomRightCell = boardValues[2][2].getCellValue();

        // Second diagonal values
        let bottomLeftCell = boardValues[2][0].getCellValue();
        let upRightCell = boardValues[0][2].getCellValue();

        if (
            upleftCell === middleCell &&
            middleCell === bottomRightCell &&
            middleCell != 0
        ) {
            return true;
        }

        if (
            bottomLeftCell === middleCell &&
            middleCell === upRightCell &&
            middleCell != 0
        ) {
            return true;
        }

        // Check for ties
        let zeros = 0;
        for (let i = 0; i < 3; i++) {
            // Loop every cell in the row
            for (let j = 0; j < 3; j++) {
                if (boardValues[i][j].getCellValue() == 0)
                    boardValues[i][j].getCellValue() == 0 ? zeros++ : zeros;
            }

            if (i == 2 && zeros == 0) {
                return "TIE";
            }
        }

        return 0;
    };

    return { playRound, switchTurn, players, gameBoard };
}

const game = GameController();

const container = document.querySelector(".container");
const displayGame = {
    markDivs: document.querySelectorAll(".tic-item"),
    boardValues: game.gameBoard.getBoard(),
    displayValues: function () {
        this.boardValues.forEach((row, i) => {
            row.forEach((item, j) => {
                // Add content to buttons
                this.markDivs[i * 3 + j].textContent =
                    this.boardValues[i][j].getCellValue();
            });
        });
    },
    addDivsListeners: function () {
        this.boardValues.forEach((row, i) => {
            row.forEach((item, j) => {
                // Add events listeners
                this.markDivs[i * 3 + j].addEventListener("click", () => {
                    game.playRound(i, j);
                    displayGame.displayValues();
                });
            });
        });
    },
};

displayGame.displayValues();
displayGame.addDivsListeners();
