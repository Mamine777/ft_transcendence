import { keysPressed } from "./game.js";

let difficulte = 0.7;
let lastMoveTime = 0;
const baseReactionInterval = 100;

let lastBotDirection = null;

export function updateBotAI(
  ballY,
  paddleY,
  paddleHeight,
  ballX,
  ballVX,
  canvasWidth
) {
  const now = performance.now();
  if (now - lastMoveTime < baseReactionInterval / difficulte) return;
  lastMoveTime = now;

  if (ballVX < 0 || ballX < canvasWidth / 2) return;

  const paddleCenter = paddleY + paddleHeight / 2;

  const randomness = (1 - difficulte) * 50;
  const predictedBallY = ballY + ballVX * 0.15 * (Math.random() * randomness - randomness / 2);

  const deadZone = 55;

  let direction = null;

  if (predictedBallY > paddleCenter + deadZone) {
    direction = "ArrowDown";
  } else if (predictedBallY < paddleCenter - deadZone) {
    direction = "ArrowUp";
  }

  if (direction) simulateKey(direction);
}

export function setDifficulty(level) {
  if (level === "EASY") difficulte = 0.3;
  if (level === "MEDIUM") difficulte = 0.6;
  if (level === "HARD") difficulte = 0.9;
  console.log("🤖 Bot en mode :", level);
}

function simulateKey(key) {
  if (lastBotDirection === key) return;

  keysPressed[key] = true;
  lastBotDirection = key;

  setTimeout(() => {
    keysPressed[key] = false;
    lastBotDirection = null;
  }, 150);
}
