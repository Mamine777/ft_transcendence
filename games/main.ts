import { initGame, resetScore, update } from "./game";
import { resetGame, showWinner } from "./score";
import { initConnect4 } from "./puissance4";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;

  const modeSelector = document.getElementById("mode") as HTMLSelectElement;
  const startBtn = document.getElementById("start") as HTMLButtonElement;
  const pongMenu = document.getElementById("pong-menu")!;
  const gameChoice = document.getElementById("game-choice") as HTMLSelectElement;
  const instruction = document.getElementById("instruction")!;
  const connect4Container = document.getElementById("connect4-container")!;
  const restartConnect4 = document.getElementById("restart-connect4") as HTMLButtonElement;

  const pongElements = [canvas, pongMenu];

  function switchGameView(choice: string) {
    if (choice === "pong") {
      pongElements.forEach(el => el?.classList.remove("hidden"));
      connect4Container.classList.add("hidden");
      instruction.textContent = "Choisis le mode BOT ou PVP puis clique sur Start.";
    } else {
      pongElements.forEach(el => el?.classList.add("hidden"));
      connect4Container.classList.remove("hidden");
      instruction.textContent = "Le jeu Puissance 4 démarre automatiquement.";
    }
  }

  gameChoice.addEventListener("change", (e) => {
    const selected = (e.target as HTMLSelectElement).value;
    switchGameView(selected);
  });

  switchGameView("pong");

  startBtn.addEventListener("click", () => {
    const selectedMode = modeSelector.value === "BOT" ? "BOT" : "PVP";
    resetGame();
    initGame(canvas, ctx, selectedMode);
    requestAnimationFrame(() => update(handleWinner));
  });

  function handleWinner(winner: "left" | "right" | "") {
    if (winner !== "") {
      showWinner(ctx, canvas, winner);
    }
  }

  initConnect4();

  restartConnect4.addEventListener("click", () => {
    initConnect4();
  });
});
