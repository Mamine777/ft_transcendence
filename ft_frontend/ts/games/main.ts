import {
  initGame,
  resetScore,
  startGameLoop,
  stopGameLoop
} from "./game";
import { resetGame, showWinner } from "./score";
import { initConnect4 } from "./puissance4";

window.addEventListener("DOMContentLoaded", () => {
  const canvasGame = document.getElementById("canva-game") as HTMLCanvasElement;
  const canvasTournament = document.getElementById("canva-2") as HTMLCanvasElement;
  const ctxGame = canvasGame.getContext("2d")!;
  const ctxTournament = canvasTournament.getContext("2d")!;

  const modeSelector = document.getElementById("mode") as HTMLSelectElement;
  const startBtn = document.getElementById("start") as HTMLButtonElement;
  const starttournamentBtn = document.getElementById("start-tournament") as HTMLButtonElement;
  const pongMenu = document.getElementById("pong-menu")!;
  const gameChoice = document.getElementById("game-choice") as HTMLSelectElement;
  const instruction = document.getElementById("instruction")!;
  const connect4Container = document.getElementById("connect4-container")!;
  const restartConnect4 = document.getElementById("restart-connect4") as HTMLButtonElement;

  const refreshBtn = document.getElementById("refresh") as HTMLButtonElement;

  const pongElements = [canvasGame, pongMenu];

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
  refreshBtn.addEventListener("click", () => {
  location.reload();
});
  switchGameView("pong");

startBtn.addEventListener("click", () => {
  const selectedMode = modeSelector.value === "BOT" ? "BOT" : "PVP";
  startBtn.classList.add("hidden"); // <-- ici on le cache
  stopGameLoop();
  resetGame();
  initGame(canvasGame, ctxGame, selectedMode);
  startGameLoop(handleWinnerGame);
});

starttournamentBtn.addEventListener("click", () => {
  const selectedMode = "PVP";
  startBtn.classList.add("hidden"); // <-- ici on le cache
  stopGameLoop();
  resetGame();
  initGame(canvasTournament, ctxTournament, selectedMode);
  startGameLoop(handleWinnerTournament);
});

function handleWinnerGame(winner: "left" | "right" | "") {
  if (winner !== "") {
    showWinner(ctxGame, canvasGame, winner);
  }
}

function handleWinnerTournament(winner: "left" | "right" | "") {
  if (winner !== "") {
    showWinner(ctxTournament, canvasTournament, winner);
  }
}

  initConnect4();

  restartConnect4.addEventListener("click", () => {
    initConnect4();
  });
});
