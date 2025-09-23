import { leftScore, rightScore, resetScore, resetBall } from "./game";


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

export function getWinner(): "left" | "right" | "" {
  if (leftScore >= WIN) return "left";
  if (rightScore >= WIN) return "right";
  return "";
}

export async function getWinner2(): Promise <"left" | "right"> {
  while (true) {
    if (leftScore >= WIN) return "left";
    if (rightScore >= WIN) return "right";
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
export function resetGame(): void {
    resetScore();
    gameOver = false;
}

export function 
showWinner(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  winner: string
): void {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  const text = `${winner} gagne !`;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}
