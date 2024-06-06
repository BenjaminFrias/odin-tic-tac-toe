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

    const resetBoard = function () {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                board[i][j].changeCellValue(0);
            }
        }
    };

    const getBoard = () => {
        return board;
    };

    return { getBoard, addMark, resetBoard };
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
            name: name1 || "Player1",
            mark: 1,
        },
        player2: {
            name: name2 || "Player2",
            mark: 2,
        },
    };

    const gameBoard = Gameboard();
    let activePlayer = players.player1;
    let winner = false;
    let tie = false;

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
            tie = true;
            winner = true;
        } else if (winnerResult) {
            console.log(activePlayer.name, "WINS");
            winner = true;
        } else {
            switchTurn();
        }
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

    const getActivePlayer = () => {
        return activePlayer;
    };

    const getWinner = () => {
        return winner;
    };

    const getGameBoard = () => {
        return gameBoard;
    };

    const resetGame = () => {
        winner = false;

        gameBoard.resetBoard();
    };

    const isTie = () => {
        return tie;
    };

    return {
        playRound,
        switchTurn,
        getGameBoard,
        getActivePlayer,
        getWinner,
        resetGame,
        isTie,
    };
}

const startBtn = document.querySelector(".start-btn");
const startPage = document.querySelector(".start-page");
const gameBoardDiv = document.querySelector(".game-page");
const resultsPage = document.querySelector(".results-page");
const restartBtn = document.querySelector(".new-game-btn");
const inputP1 = document.querySelector("#player1-name");
const inputP2 = document.querySelector("#player2-name");

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);

function startGame() {
    gameBoardDiv.classList.remove("hidden");
    startPage.classList.add("hidden");

    // Get players name
    const player1 = inputP1.value.trim();
    const player2 = inputP2.value.trim();

    let game = GameController(player1, player2);

    const displayGame = {
        markDivs: document.querySelectorAll(".tic-item"),
        activePlayerTitle: document.querySelector(".active-player"),
        winnerText: document.querySelector(".results-page h2"),
        boardValues: game.getGameBoard().getBoard(),
        displayCellValues: function () {
            this.boardValues.forEach((row, i) => {
                row.forEach((item, j) => {
                    // restart divs
                    this.markDivs[i * 3 + j].innerHTML = "";

                    // Add event listeners
                    this.markDivs[i * 3 + j].addEventListener("click", () => {
                        // when clicked, if not winner play round
                        if (!game.getWinner()) {
                            game.playRound(i, j);

                            // Show value of the cell when clicked
                            let cellDiv = this.markDivs[i * 3 + j];
                            let value = this.boardValues[i][j].getCellValue();
                            if (value == 1) {
                                value = `
                                        <svg class="x-icon mark-icon" fill="none" height="24" stroke="currentColor"
                                            stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <line x1="18" x2="6" y1="6" y2="18" />
                                            <line x1="6" x2="18" y1="6" y2="18" />
                                        </svg>
                                        `;
                            } else if (value == 2) {
                                value = `
                                            <svg class="circle-icon mark-icon" fill="none" height="24" stroke="currentColor"
                                            stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="10" />
                                            </svg>
                                            `;
                            } else {
                                value = "";
                            }

                            cellDiv.innerHTML = value;
                            cellDiv
                                .querySelector("svg")
                                .classList.add("placed");

                            displayGame.displayActivePlayer();
                        }

                        if (game.getWinner()) {
                            this.displayResults();
                            game.resetGame();
                        }
                    });
                });
            });
        },
        displayActivePlayer: function () {
            this.activePlayerTitle.textContent = `${
                game.getActivePlayer().name
            } turn...`;
        },
        displayResults: function () {
            gameBoardDiv.classList.add("hidden");
            resultsPage.classList.remove("hidden");
            this.winnerText.textContent = `${game.getActivePlayer().name} WINS`;
        },
    };

    displayGame.displayCellValues();
    displayGame.displayActivePlayer();
}

function restartGame() {
    startPage.classList.remove("hidden");
    resultsPage.classList.add("hidden");
    gameBoardDiv.classList.add("hidden");

    inputP1.value = "";
    inputP2.value = "";
}
