const board = document.getElementById("board");
const status = document.querySelector(".status");
let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let againstAI = true;

function createBoard() {
    board.innerHTML = "";
    gameBoard.forEach((cell, index) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        cellElement.dataset.index = index;
        cellElement.innerText = cell;
        cellElement.addEventListener("click", handleCellClick);
        board.appendChild(cellElement);
    });
}

function handleCellClick(event) {
    const index = event.target.dataset.index;
    if (gameBoard[index] !== "" || (againstAI && currentPlayer === "O")) return;

    gameBoard[index] = currentPlayer;
    event.target.innerText = currentPlayer;
    event.target.classList.add("taken");

    if (checkWinner()) {
        status.innerText = `Player ${currentPlayer} wins!`;
        document.querySelectorAll(".cell").forEach(cell => cell.removeEventListener("click", handleCellClick));
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    status.innerText = `Player ${currentPlayer}'s turn`;

    if (againstAI && currentPlayer === "O") {
        setTimeout(aiMove, 500);
    }
}

function aiMove() {
    let bestMove = minimax(gameBoard, "O").index;
    if (bestMove !== undefined) {
        gameBoard[bestMove] = "O";
        document.querySelector(`[data-index='${bestMove}']`).innerText = "O";
        document.querySelector(`[data-index='${bestMove}']`).classList.add("taken");
        
        if (checkWinner()) {
            status.innerText = "AI wins!";
            document.querySelectorAll(".cell").forEach(cell => cell.removeEventListener("click", handleCellClick));
            return;
        }
        currentPlayer = "X";
        status.innerText = "Player X's turn";
    }
}
function celebrateWin(winner) {
    const celebration = document.getElementById("celebration");
    const floatingMessage = document.getElementById("floating-message");
    celebration.innerHTML = "";
    floatingMessage.innerText = `🎉 Player ${winner} Wins! 🎉`;
    floatingMessage.style.display = "block";
    celebration.style.display = "block";

    for (let i = 0; i < 20; i++) {
        const firework = document.createElement("div");
        firework.classList.add("firework");
        firework.style.left = `${Math.random() * 100}vw`;
        firework.style.top = `${Math.random() * 100}vh`;
        firework.style.backgroundColor = ["red", "blue", "gold", "green"][Math.floor(Math.random() * 4)];
        celebration.appendChild(firework);
    }

    setTimeout(() => {
        floatingMessage.style.display = "none";
        celebration.style.display = "none";
    }, 3000);
}

function handleCellClick(event) {
    const index = event.target.dataset.index;
    if (gameBoard[index] !== "" || (againstAI && currentPlayer === "O")) return;

    gameBoard[index] = currentPlayer;
    event.target.innerText = currentPlayer;
    event.target.classList.add("taken");

    if (checkWinner()) {
        status.innerText = `Player ${currentPlayer} wins!`;
        document.querySelectorAll(".cell").forEach(cell => cell.removeEventListener("click", handleCellClick));
        celebrateWin(currentPlayer);
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    status.innerText = `Player ${currentPlayer}'s turn`;

    if (againstAI && currentPlayer === "O") {
        setTimeout(aiMove, 500);
    }
}
function minimax(board, player) {
    let availableMoves = board.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
    
    if (checkWinner()) return { score: player === "O" ? -10 : 10 };
    if (availableMoves.length === 0) return { score: 0 };
    
    let moves = [];
    availableMoves.forEach(move => {
        let newBoard = [...board];
        newBoard[move] = player;
        let result = minimax(newBoard, player === "O" ? "X" : "O");
        moves.push({ index: move, score: result.score });
    });
    
    return moves.reduce((best, move) => (player === "O" ? (move.score < best.score ? move : best) : (move.score > best.score ? move : best)), player === "O" ? { score: Infinity } : { score: -Infinity });
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
    });
}

function resetGame() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    status.innerText = "Player X's turn";
    createBoard();
}

createBoard();