import {
  initGame,
  resetBall,
  resetScore,
  startGameLoop,
  stopGameLoop,
  stopBall,
  runMatch,
  leftScore,
  rightScore,
} from "./game";
export let Botin = false;
import { resetGame, showWinner, getWinner2 } from "./score";
import { initConnect4 } from "./puissance4";
import { setDifficulty } from "./ai";

window.addEventListener("DOMContentLoaded", () => {
  const canvasGame = document.getElementById("canva-game") as HTMLCanvasElement;
  const canvasTournament = document.getElementById("canva-2") as HTMLCanvasElement;
  const ctxGame = canvasGame.getContext("2d")!;
  const ctxTournament = canvasTournament.getContext("2d")!;

  let selectedMode: "BOT" | "PVP" = "BOT";
  const PVPstartBtn = document.getElementById("PVPstart") as HTMLButtonElement;
  const EASYstartBtn = document.getElementById("EASYstart") as HTMLButtonElement;
  const MEDIUMstartBtn = document.getElementById("MEDIUMstart") as HTMLButtonElement;
  const HARDstartBtn = document.getElementById("HARDstart") as HTMLButtonElement;
  const starttournamentBtn = document.getElementById("start-tournament") as HTMLButtonElement;
  const pongMenu = document.getElementById("pong-menu")!;
  const gameChoice = document.getElementById("game-choice") as HTMLSelectElement;
  const instruction = document.getElementById("instruction")!;
  const connect4Container = document.getElementById("connect4-container")!;
  const restartConnect4 = document.getElementById("restart-connect4") as HTMLButtonElement;

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
  switchGameView("pong");

async function startGame() {
  if (selectedMode === "BOT") {
    Botin = true;
  }
    Botin = false;
  const playerLeftName = "gauche";
  const playerRightName = "droit ";
  EASYstartBtn.classList.add("hidden");
  MEDIUMstartBtn.classList.add("hidden");
  HARDstartBtn.classList.add("hidden");
  PVPstartBtn.classList.add("hidden");
  resetGame();
  initGame(canvasGame, ctxGame, selectedMode);
  startGameLoop((winner: "left" | "right" | "") => handleWinnerGame(winner, playerLeftName, playerRightName));
	const winner = await getWinner2();
  stopGameLoop();
  fetch("http://localhost:3000/History/PongHistory", {
      method: "POST",
      credentials: "include",
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": "application/json" 
      },
    body: JSON.stringify({ 
      scoreleft: leftScore,
      scoreright: rightScore,
      mode: getMode(),
      date: Date().toLocaleString()
     })
  })
}

EASYstartBtn.addEventListener("click", async () => {
  setDifficulty("EASY");
  selectedMode = "BOT";
  await startGame();
});
MEDIUMstartBtn.addEventListener("click", async () => {
  setDifficulty("MEDIUM");
  selectedMode = "BOT";
  await startGame();
});
HARDstartBtn.addEventListener("click", async () => {
  setDifficulty("HARD");
  selectedMode = "BOT";
  await startGame();
});
PVPstartBtn.addEventListener("click", async () => {
  selectedMode = "PVP";
  await startGame();
});
starttournamentBtn.addEventListener("click", () => {
  const selectedMode = "PVP";
  const playerLeftName = "gauche";
  const playerRightName = "droit";
  resetGame();
  initGame(canvasTournament, ctxTournament, selectedMode);
  runMatch(playerLeftName, playerRightName).then(() => {
    startGameLoop((winner: "left" | "right" | "") => handleWinnerTournament(winner, playerLeftName, playerRightName));
  })
  resetScore();
});

function handleWinnerGame(winner: "left" | "right" | "", playerleft: string, playerright: string) {
  if (winner !== "") {
    const winnerName = winner === "left" ? playerleft : playerright;
    stopBall();
    EASYstartBtn.classList.remove("hidden");
    MEDIUMstartBtn.classList.remove("hidden");
    HARDstartBtn.classList.remove("hidden");
    PVPstartBtn.classList.remove("hidden");
    showWinner(ctxGame, canvasGame, winnerName);
  }
}

function handleWinnerTournament(winner: "left" | "right" | "", playerleft: string, playerright: string) {
  if (winner !== "") {
    const winnerName = winner === "left" ? playerleft : playerright;
    stopBall();
    starttournamentBtn.classList.remove("hidden");
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
    EASYstartBtn.classList.remove("hidden");
    MEDIUMstartBtn.classList.remove("hidden");
    HARDstartBtn.classList.remove("hidden");
  });

});

export function getMode() {
  const modeSelector = document.getElementById("mode") as HTMLSelectElement;
  return modeSelector.value === "BOT" ? "BOT" : "PVP";
}