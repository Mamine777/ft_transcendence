import { initGame, update } from "./game";
import { resetGame, showWinner } from "./score";
import { initConnect4 } from "./puissance4";
window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const modeSelector = document.getElementById("mode");
    const startBtn = document.getElementById("start");
    const pongMenu = document.getElementById("pong-menu");
    const gameChoice = document.getElementById("game-choice");
    const instruction = document.getElementById("instruction");
    const connect4Container = document.getElementById("connect4-container");
    const restartConnect4 = document.getElementById("restart-connect4");
    const pongElements = [canvas, pongMenu];
    function switchGameView(choice) {
        if (choice === "pong") {
            pongElements.forEach(el => el === null || el === void 0 ? void 0 : el.classList.remove("hidden"));
            connect4Container.classList.add("hidden");
            instruction.textContent = "Choisis le mode BOT ou PVP puis clique sur Start.";
        }
        else {
            pongElements.forEach(el => el === null || el === void 0 ? void 0 : el.classList.add("hidden"));
            connect4Container.classList.remove("hidden");
            instruction.textContent = "Le jeu Puissance 4 démarre automatiquement.";
        }
    }
    gameChoice.addEventListener("change", (e) => {
        const selected = e.target.value;
        switchGameView(selected);
    });
    switchGameView("pong");
    startBtn.addEventListener("click", () => {
        const selectedMode = modeSelector.value === "BOT" ? "BOT" : "PVP";
        resetGame();
        initGame(canvas, ctx, selectedMode);
        requestAnimationFrame(() => update(handleWinner));
    });
    function handleWinner(winner) {
        if (winner !== "") {
            showWinner(ctx, canvas, winner);
        }
    }
    initConnect4();
    restartConnect4.addEventListener("click", () => {
        initConnect4();
    });
});
