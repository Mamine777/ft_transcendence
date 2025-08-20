import {
  initGame,
  resetBall,
  resetScore,
  startGameLoop,
  stopGameLoop,
  stopBall
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
  const playerLeftName = "gauche";
  const playerRightName = "droit ";
  startBtn.classList.add("hidden"); // <-- ici on le cache
  resetGame();
  initGame(canvasGame, ctxGame, selectedMode);
  startGameLoop((winner: "left" | "right" | "") => handleWinnerGame(winner, playerLeftName, playerRightName));
});

starttournamentBtn.addEventListener("click", () => {
  const selectedMode = "PVP";
  const playerLeftName = "gauche";
  const playerRightName = "droit proute";
  startBtn.classList.add("hidden");
  resetGame();
  initGame(canvasTournament, ctxTournament, selectedMode);
  startGameLoop((winner: "left" | "right" | "") => handleWinnerTournament(winner, playerLeftName, playerRightName));
});

function handleWinnerGame(winner: "left" | "right" | "", playerleft: string, playerright: string) {
  if (winner !== "") {
    const winnerName = winner === "left" ? playerleft : playerright;
    stopBall();
    startBtn.classList.remove("hidden");
    showWinner(ctxGame, canvasGame, winnerName);
  }
}

function handleWinnerTournament(winner: "left" | "right" | "", playerleft: string, playerright: string) {
  if (winner !== "") {
    const winnerName = winner === "left" ? playerleft : playerright;
    stopBall();
    startBtn.classList.remove("hidden");
    showWinner(ctxTournament, canvasTournament, winnerName);
  }
}

  initConnect4();

  restartConnect4.addEventListener("click", () => {
    initConnect4();
  });

  window.addEventListener("hashchange", () => {
    stopGameLoop();
    resetScore();
    resetBall();
    startBtn.classList.remove("hidden");
  });

});

