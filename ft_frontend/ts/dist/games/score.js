<<<<<<< HEAD
import { leftScore, resetScore } from "./game";



export const WIN = 2;
=======
import { resetScore } from "./game";
export const WIN = 10;
>>>>>>> origin/tournament
export let gameOver = false;
export function checkScore(leftScore, rightScore) {
    if (leftScore >= WIN) {
        gameOver = true;
        return "left";
    }
    else if (rightScore >= WIN) {
        gameOver = true;
        return "right";
    }
    return "";
}
export function resetGame() {
    resetScore();
    gameOver = false;
}
export function showWinner(ctx, canvas, winner) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    const text = winner === "left" ? "Gauche gagne !" : "Droite gagne !";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
<<<<<<< HEAD
<<<<<<< HEAD
    //resetScore();
=======
    resetScore();
>>>>>>> origin/tournament
=======
    gameOver = true;
    leftScore = 0;
    rightScore = 0;
>>>>>>> origin/main
}
