import { leftScore, rightScore, resetScore } from "./game";

export const WIN = 10;
export let gameOver = false;

export function checkScore(leftScore: number, rightScore: number): "left" | "right" | "" {
  if (leftScore >= WIN) {
    gameOver = true;
    return "left";
  } else if (rightScore >= WIN) {
    gameOver = true;
    return "right";
  }
  return "";
}

export function resetGame(): void {
    resetScore();
    gameOver = false;
}

export function showWinner(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  winner: "left" | "right"
): void {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  const text = winner === "left" ? "Gauche gagne !" : "Droite gagne !";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}