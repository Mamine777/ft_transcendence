import { keysPressed } from "./game";

let difficulte = 0.7; 
let lastMoveTime = 0;
const baseReactionInterval = 100; // c'est le temps de reaction en ms

export function updateBotAI(
  ballY: number,
  paddleY: number,
  paddleHeight: number,
  ballX: number,
  ballVX: number,
  canvasWidth: number
) {
  const now = performance.now();
  if (now - lastMoveTime < baseReactionInterval / difficulte) return;
  lastMoveTime = now;
  if (ballVX < 0 || ballX < canvasWidth / 2) return;

  const paddleCenter = paddleY + paddleHeight / 2;
  const randomness = (1 - difficulte) * 50; 
  const predictedBallY = ballY + ballVX * 0.15 * (Math.random() * randomness - randomness / 2);
  const deadZone = 100;

  let direction: "ArrowUp" | "ArrowDown" | null = null;

  if (predictedBallY > paddleCenter + deadZone) {
    direction = "ArrowDown";
  } else if (predictedBallY < paddleCenter - deadZone) {
    direction = "ArrowUp";
  }

  if (direction) simulateKey(direction);
}

export function setDifficulty(level: "EASY" | "MEDIUM" | "HARD") {
  if (level === "EASY") difficulte = 1;
  if (level === "MEDIUM") difficulte = 3;
  if (level === "HARD") difficulte = 6;
}

let lastBotDirection: "ArrowUp" | "ArrowDown" | null = null;

function simulateKey(key: "ArrowUp" | "ArrowDown") {
  if (lastBotDirection === key) return;

  keysPressed[key] = true;
  lastBotDirection = key;

  setTimeout(() => {
    keysPressed[key] = false;
    lastBotDirection = null;
  }, 150); 
}
