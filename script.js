const cells = document.querySelectorAll('.cell');
const boardState = Array.from({ length: 9 }, () => null);
let currentPlayer = 'X';
let gameOver = false;

const restartButton = document.getElementById('restartBtn'); // Get the restart button

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

// Ensure the restart button triggers resetGame
restartButton.addEventListener('click', resetGame);

function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = parseInt(cell.getAttribute('data-index'));

    if (boardState[cellIndex] || gameOver) {
        return;
    }

    // Make the move
    cell.textContent = currentPlayer;
    boardState[cellIndex] = currentPlayer;

    // Check if the current player has won
    if (checkWinner()) {
        showWinnerAlert(currentPlayer);
        highlightWinningMove();
        gameOver = true;
    } else if (boardState.every(cell => cell)) {
        // Check if the game ended in a draw
        alert('Draw!');
        resetGame();
    } else {
        // Switch player and make computer move after a delay
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (currentPlayer === 'O' && !gameOver) {
            setTimeout(makeComputerMove, 1000);
        }
    }
}

function makeComputerMove() {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * 9);
    } while (boardState[randomIndex]);

    const randomCell = cells[randomIndex];
    randomCell.textContent = currentPlayer;
    boardState[randomIndex] = currentPlayer;

    if (checkWinner()) {
        showWinnerAlert(currentPlayer);
        highlightWinningMove();
        gameOver = true;
    } else if (boardState.every(cell => cell)) {
        alert('Draw!');
        resetGame();
    } else {
        currentPlayer = 'X';
    }
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            highlightWinningCells([a, b, c]);
            return true;
        }
    }
    return false;
}

function highlightWinningCells(cellsArray) {
    cellsArray.forEach(index => {
        cells[index].classList.add('winning-move');
    });
}

function showWinnerAlert(winner) {
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert-box');
    alertBox.textContent = `${winner} wins!`;
    document.body.appendChild(alertBox);

    setTimeout(() => {
        alertBox.classList.add('show');
    }, 100);

    setTimeout(() => {
        alertBox.classList.remove('show');
        document.body.removeChild(alertBox);
    }, 3000);
}

function resetGame() {
    // Reset the board and game state
    boardState.fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winning-move');
    });
    currentPlayer = 'X';
    gameOver = false;

    // Reset any winner alert that may still be visible
    const alertBox = document.querySelector('.alert-box');
    if (alertBox) {
        alertBox.classList.remove('show');
        document.body.removeChild(alertBox);
    }
}
