import { checkScore } from "./score";
import { updateBotAI, setDifficulty } from "./ai";
let currentMode = "BOT";
let canvas;
let ctx;
// Balle
let ballX;
let ballY;
let ballSpeedX = 3;
let ballSpeedY = 2;
let ballPaused = false;
// Raquettes
const paddleWidth = 10;
const paddleHeight = 100;
let leftPaddleY;
let rightPaddleY;
export const paddleSpeed = 6;
// Scores
export let leftScore = 0;
export let rightScore = 0;
const keysPressed = {};
export function initGame(c, context, mode) {
    canvas = c;
    ctx = context;
    currentMode = mode;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    leftPaddleY = canvas.height / 2 - paddleHeight / 2;
    rightPaddleY = canvas.height / 2 - paddleHeight / 2;
    document.addEventListener("keydown", (e) => {
        keysPressed[e.key] = true;
        // pour changer la difficulté en direct (optionnel)
        if (e.key === "1")
            setDifficulty("EASY");
        if (e.key === "2")
            setDifficulty("MEDIUM");
        if (e.key === "3")
            setDifficulty("HARD");
    });
    document.addEventListener("keyup", (e) => {
        keysPressed[e.key] = false;
    });
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
export function resetScore() {
    leftScore = 0;
    rightScore = 0;
}
export function update(callback) {
    if (!ctx)
        return;
    ctx.fillStyle = "pink";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Contrôle joueur 1
    if (keysPressed["w"] && leftPaddleY > 0)
        leftPaddleY -= paddleSpeed;
    if (keysPressed["s"] && leftPaddleY < canvas.height - paddleHeight)
        leftPaddleY += paddleSpeed;
    // Contrôle bot
    if (currentMode === "BOT") {
        updateBotAI(ballY, rightPaddleY, paddleHeight, ballX, ballSpeedX, canvas.width);
    }
    // Contrôle raquette droite (player ou bot)
    if (keysPressed["ArrowUp"] && rightPaddleY > 0)
        rightPaddleY -= paddleSpeed;
    if (keysPressed["ArrowDown"] && rightPaddleY < canvas.height - paddleHeight)
        rightPaddleY += paddleSpeed;
    // Mouvement balle
    if (!ballPaused) {
        ballX += ballSpeedX;
        ballY += ballSpeedY;
    }
    // Rebonds
    if (ballY <= 0 || ballY >= canvas.height)
        ballSpeedY = -ballSpeedY;
    // Raquette gauche
    if (ballX <= 20 &&
        ballY >= leftPaddleY &&
        ballY <= leftPaddleY + paddleHeight)
        ballSpeedX = -ballSpeedX;
    // Raquette droite
    if (ballX >= canvas.width - 20 &&
        ballY >= rightPaddleY &&
        ballY <= rightPaddleY + paddleHeight)
        ballSpeedX = -ballSpeedX;
    // Score
    if (ballX <= 0) {
        rightScore++;
        const winner = checkScore(leftScore, rightScore);
        if (winner === "")
            resetBall();
        callback(winner);
    }
    if (ballX >= canvas.width) {
        leftScore++;
        const winner = checkScore(leftScore, rightScore);
        if (winner === "")
            resetBall();
        callback(winner);
    }
    // Affichage
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
    requestAnimationFrame(() => update(callback));
}
export { keysPressed };
