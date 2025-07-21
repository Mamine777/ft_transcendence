import { keysPressed } from "./game";

let difficulte = 0.7;
let directionMemoire: "ArrowUp" | "ArrowDown" | null = null;
let directionTimer = 0;

export function updateBotAI(
  ballY: number,
  paddleY: number,
  paddleHeight: number,
  ballX: number,
  ballVX: number,
  canvasWidth: number
) {
  const paddleCenter = paddleY + paddleHeight / 2;

  // ⛔ Ignore si la balle va à gauche (donc pas vers lui)
  if (ballVX < 0) return;

  // ⛔ Ignore si la balle est encore loin
  if (ballX < canvasWidth / 2) return;

  // Continue dans la même direction pour quelques frames
  if (directionTimer > 0 && directionMemoire) {
    simulateKey(directionMemoire);
    directionTimer--;
    return;
  }

  // ➕ Comportement humain : erreur possible
  const erreur = Math.random() < (1 - difficulte);
  let direction: "ArrowUp" | "ArrowDown" | null = null;

  const tolerance_px = 20;
  if (erreur)
  {
    if (ballY > paddleCenter) direction = "ArrowUp"; // erreur
    else if (ballY < paddleCenter) direction = "ArrowDown";
  } 
  else 
  {
    // On ajoute une tolerence de pixels pour influencer vers où il doit se diriger
    const diff = ballY - paddleCenter;
    if (Math.abs(diff) > tolerance_px)
    {
      if (diff >= 0)
        direction = "ArrowDown";
      else if (diff < 0)
        direction = "ArrowUp";
    }
  }

  if (direction) {
    directionMemoire = direction;
    directionTimer = 5;
    simulateKey(direction);
  }
}

export function setDifficulty(level: "EASY" | "MEDIUM" | "HARD") {
  if (level === "EASY") difficulte = 0.5;
  if (level === "MEDIUM") difficulte = 0.75;
  if (level === "HARD") difficulte = 0.95;
  console.log("🤖 Bot en mode :", level);
}

function simulateKey(key: "ArrowUp" | "ArrowDown") {
  keysPressed[key] = true;
  setTimeout(() => {
    keysPressed[key] = false;
  }, 500);
}