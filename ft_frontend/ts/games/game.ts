import { checkScore, getWinner } from "./score";
import { updateBotAI, setDifficulty } from "./ai";
import { getMode, Botin } from "./main";

type Winner2 = "left" | "right";
let listeners: ((winner: Winner2) => void)[] = [];

export type GameMode = "PVP" | "BOT";
let currentMode: GameMode = "BOT";

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

let animationId: number | null = null;
let winnerCallback: ((winner: "left" | "right" | "") => void) | null = null;

// Balle
let ballX: number;
let ballY: number;
let ballSpeedX = 3;
let ballSpeedY = 2;
let ballPaused = false;

// Raquettes
const paddleWidth = 10;
const paddleHeight = 100;
let leftPaddleY: number;
let rightPaddleY: number;
export const paddleSpeed = 6;

// Scores
export let leftScore = 0;
export let rightScore = 0;

const keysPressed: { [key: string]: boolean } = {};

export function initGame(
  c: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  mode: GameMode
) {
  canvas = c;
  ctx = context;
  currentMode = mode;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  leftPaddleY = canvas.height / 2 - paddleHeight / 2;
  rightPaddleY = canvas.height / 2 - paddleHeight / 2;
  ballSpeedX = 3;
  ballSpeedY = 2;

  document.addEventListener("keydown", (e) => {
    if (Botin === false)
      keysPressed[e.key] = true;

    if (e.key === "1") setDifficulty("EASY");
    if (e.key === "2") setDifficulty("MEDIUM");
    if (e.key === "3") setDifficulty("HARD");
  });

  document.addEventListener("keyup", (e) => {
    if (Botin === false)
      keysPressed[e.key] = false;
  });
}

export function stopBall() {
  ballSpeedX = 0;
  ballSpeedY = 0;
}

export function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = 0;
  ballSpeedY = 0;
  ballPaused = true;

  const directionX = Math.random() > 0.5 ? 1 : -1;
  const directionY = Math.random() > 0.5 ? 1 : -1;
  const newSpeedX = 3 * directionX;
  const newSpeedY = 2 + Math.random();

  setTimeout(() => {
    ballSpeedX = newSpeedX;
    ballSpeedY = directionY * newSpeedY;
    ballPaused = false;
  }, 500);
}

export function LookScore() {
  console.log(`Score: ${leftScore} - ${rightScore}`);
}


export function resetScore() {
  leftScore = 0;
  rightScore = 0;
}

export function updateFrame(callback: (winner: "left" | "right" | "") => void) {
  if (!ctx) return;

  ctx.fillStyle = "pink";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (keysPressed["w"] && leftPaddleY > 0) leftPaddleY -= paddleSpeed;
  if (keysPressed["s"] && leftPaddleY < canvas.height - paddleHeight)
    leftPaddleY += paddleSpeed;

  if (currentMode === "BOT") {
    updateBotAI(ballY, rightPaddleY, paddleHeight, ballX, ballSpeedX, canvas.width);
  }

  if (keysPressed["ArrowUp"] && rightPaddleY > 0)
    rightPaddleY -= paddleSpeed;
  if (keysPressed["ArrowDown"] && rightPaddleY < canvas.height - paddleHeight)
    rightPaddleY += paddleSpeed;

  if (!ballPaused) {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
  }

  if (ballY <= 0 || ballY >= canvas.height) ballSpeedY = -ballSpeedY;

  if (
    ballX <= 20 &&
    ballY >= leftPaddleY &&
    ballY <= leftPaddleY + paddleHeight
  )
    ballSpeedX = -ballSpeedX;

  if (
    ballX >= canvas.width - 20 &&
    ballY >= rightPaddleY &&
    ballY <= rightPaddleY + paddleHeight
  )
    ballSpeedX = -ballSpeedX;

  if (ballX <= 0) {
    rightScore++;
    const winner = checkScore(leftScore, rightScore);
    if (winner === "") resetBall();
    callback(winner);
    return;
  }

  if (ballX >= canvas.width) {
    leftScore++;
    const winner = checkScore(leftScore, rightScore);
    if (winner === "") resetBall();
    callback(winner);
    return;
  }

  ctx.beginPath();
  ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();

  ctx.fillStyle = "white";
  ctx.fillRect(10, leftPaddleY, paddleWidth, paddleHeight);
  ctx.fillRect(canvas.width - 20, rightPaddleY, paddleWidth, paddleHeight);

  ctx.font = "32px Arial";
  ctx.fillText(`${leftScore}`, canvas.width / 4, 50);
  ctx.fillText(`${rightScore}`, (canvas.width * 3) / 4, 50);
}

export function startGameLoop(callback: (w: "left" | "right" | "") => void) {
  winnerCallback = callback;

  function loop() {
    updateFrame((winner) => {
      if (winner !== "") {
        stopGameLoop();
        if (winnerCallback) winnerCallback(winner);
        return;
      }
    });
    animationId = requestAnimationFrame(loop);
  }

  stopGameLoop();
  loop();
}

export function stopGameLoop() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

export function playAndReturnWinner(player1 : string, player2 : string): Promise<typeof player1 | typeof player2> {
  return new Promise((resolve) => {
    startGameLoop((w) => {
      if (w !== "") {
        resolve(w)
      };
    });
  });
}

export { keysPressed };

export async function runMatch(player1 : string, player2 : string): Promise<void> {
  const winner = await playAndReturnWinner(player1, player2);
}