export function initConnect4(): void {
  const rows = 6;
  const columns = 7;
  const board: string[][] = [];
  const currColumns: number[] = new Array(columns).fill(rows - 1);
  let currPlayer: "R" | "Y" = "R";
  let gameOver = false;

  const boardElement = document.getElementById("board");
  const winnerText = document.getElementById("winner")!;

  if (!boardElement || !winnerText) return;

  boardElement.innerHTML = "";
  winnerText.textContent = "";

  for (let r = 0; r < rows; r++) {
    const row: string[] = [];
    for (let c = 0; c < columns; c++) {
      row.push(" ");

      const colIndex = c;

      const tile = document.createElement("div");
      tile.id = `${r}-${c}`;
      tile.className =
        "w-14 h-14 rounded-full bg-gray-300 border-2 border-gray-600 hover:scale-105 transition-transform cursor-pointer";

      tile.addEventListener("click", () => {
        if (gameOver) {
          return;
        }
        let rowToFill = currColumns[colIndex];
        if (rowToFill < 0) return;

        board[rowToFill][colIndex] = currPlayer;
        const filledTile = document.getElementById(`${rowToFill}-${colIndex}`);
        if (filledTile) {
          filledTile.classList.remove("bg-gray-300");
          filledTile.classList.add(
            currPlayer === "R" ? "bg-red-500" : "bg-yellow-400"
          );
        }

        currColumns[colIndex]--;
        checkWinner();
        currPlayer = currPlayer === "R" ? "Y" : "R";
      });

      boardElement.appendChild(tile);
    }
    board.push(row);
  }

  function checkWinner(): void {
    const win = (r: number, c: number) => {
      winnerText.textContent =
        board[r][c] === "R" ? "🔴 Red Wins!" : "🟡 Yellow Wins!";
      gameOver = true;
       fetch("http://localhost:3000/History/UpdateRow", {
            method: "POST",
            credentials: "include",
            headers: { 
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
              "Content-Type": "application/json" 
            },
          body: JSON.stringify({ 
            color : board[r][c] === "R" ? "red" : "yellow",
            date: Date().toLocaleString()
           })
        })
    };

    // horizontal
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c <= columns - 4; c++) {
        const cell = board[r][c];
        if (
          cell !== " " &&
          cell === board[r][c + 1] &&
          cell === board[r][c + 2] &&
          cell === board[r][c + 3]
        )
          return win(r, c);
      }
    }

    // vertical
    for (let c = 0; c < columns; c++) {
      for (let r = 0; r <= rows - 4; r++) {
        const cell = board[r][c];
        if (
          cell !== " " &&
          cell === board[r + 1][c] &&
          cell === board[r + 2][c] &&
          cell === board[r + 3][c]
        )
          return win(r, c);
      }
    }

    // diagonal \
    for (let r = 0; r <= rows - 4; r++) {
      for (let c = 0; c <= columns - 4; c++) {
        const cell = board[r][c];
        if (
          cell !== " " &&
          cell === board[r + 1][c + 1] &&
          cell === board[r + 2][c + 2] &&
          cell === board[r + 3][c + 3]
        )
          return win(r, c);
      }
    }

    // diagonal /
    for (let r = 3; r < rows; r++) {
      for (let c = 0; c <= columns - 4; c++) {
        const cell = board[r][c];
        if (
          cell !== " " &&
          cell === board[r - 1][c + 1] &&
          cell === board[r - 2][c + 2] &&
          cell === board[r - 3][c + 3]
        )
          return win(r, c);
      }
    }
  }
}
