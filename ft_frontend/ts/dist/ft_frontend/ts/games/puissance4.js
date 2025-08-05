export function initConnect4() {
    console.log("initConnect4 ok ✅");
    const rows = 6;
    const columns = 7;
    const board = [];
    const currColumns = new Array(columns).fill(rows - 1);
    let currPlayer = "R";
    let gameOver = false;
    const boardElement = document.getElementById("board");
    const winnerText = document.getElementById("winner");
    if (!boardElement || !winnerText)
        return;
    boardElement.innerHTML = "";
    winnerText.textContent = "";
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < columns; c++) {
            row.push(" ");
            const colIndex = c; // ✅ capture la colonne pour l'event
            const tile = document.createElement("div");
            tile.id = `${r}-${c}`;
            tile.className =
                "w-14 h-14 rounded-full bg-gray-300 border-2 border-gray-600 hover:scale-105 transition-transform cursor-pointer";
            tile.addEventListener("click", () => {
                if (gameOver)
                    return;
                let rowToFill = currColumns[colIndex];
                if (rowToFill < 0)
                    return;
                board[rowToFill][colIndex] = currPlayer;
                const filledTile = document.getElementById(`${rowToFill}-${colIndex}`);
                if (filledTile) {
                    filledTile.classList.remove("bg-gray-300");
                    filledTile.classList.add(currPlayer === "R" ? "bg-red-500" : "bg-yellow-400");
                }
                currColumns[colIndex]--;
                checkWinner();
                currPlayer = currPlayer === "R" ? "Y" : "R";
            });
            boardElement.appendChild(tile);
        }
        board.push(row);
    }
    function checkWinner() {
        const win = (r, c) => {
            winnerText.textContent =
                board[r][c] === "R" ? "🔴 Red Wins!" : "🟡 Yellow Wins!";
            gameOver = true;
        };
        // horizontal
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c <= columns - 4; c++) {
                const cell = board[r][c];
                if (cell !== " " &&
                    cell === board[r][c + 1] &&
                    cell === board[r][c + 2] &&
                    cell === board[r][c + 3])
                    return win(r, c);
            }
        }
        // vertical
        for (let c = 0; c < columns; c++) {
            for (let r = 0; r <= rows - 4; r++) {
                const cell = board[r][c];
                if (cell !== " " &&
                    cell === board[r + 1][c] &&
                    cell === board[r + 2][c] &&
                    cell === board[r + 3][c])
                    return win(r, c);
            }
        }
        // diagonal \
        for (let r = 0; r <= rows - 4; r++) {
            for (let c = 0; c <= columns - 4; c++) {
                const cell = board[r][c];
                if (cell !== " " &&
                    cell === board[r + 1][c + 1] &&
                    cell === board[r + 2][c + 2] &&
                    cell === board[r + 3][c + 3])
                    return win(r, c);
            }
        }
        // diagonal /
        for (let r = 3; r < rows; r++) {
            for (let c = 0; c <= columns - 4; c++) {
                const cell = board[r][c];
                if (cell !== " " &&
                    cell === board[r - 1][c + 1] &&
                    cell === board[r - 2][c + 2] &&
                    cell === board[r - 3][c + 3])
                    return win(r, c);
            }
        }
    }
}
