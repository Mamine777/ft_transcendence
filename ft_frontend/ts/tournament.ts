import { runMatch, scoreLeft, scoreRight, onWinner, resetScore } from "./games/game";
import { getWinner } from "./games/score";
import { switchView } from "./login";
// import { Tournament, tournaments} from "../../ft_backend/tournament/tournament";

document.addEventListener("DOMContentLoaded", () => {
	const addBtn = document.getElementById("ADDplayerBtn");
	const usernameInput = document.getElementById("PlayerUsername") as HTMLInputElement;
	const playersList = document.getElementById("playersList");
	const Player = document.getElementById("Player_tournament")!;
	const CreateTournamentBtn = document.getElementById("CreateTournamentBtn");

	function updatePlayersList() {
		if (playersList) {
			playersList.innerHTML = players
			.map((player, idx) => `
				<li style="display: flex; justify-content: space-between; align-items: center;">
				<span>${player}</span>
				<button class="remove-btn" data-idx="${idx}" style="margin-left: 10px; color: red;">✖</button>
				</li>
			`)
			.join("");
			// Ajoute l'écouteur sur chaque bouton "Retirer"
			playersList.querySelectorAll('.remove-btn').forEach(btn => {
			btn.addEventListener('click', (e) => {
				const index = parseInt((btn as HTMLButtonElement).dataset.idx || "0");
				players.splice(index, 1);
				updatePlayersList();
			});
			});
		}
	}

	function startTournament() {
		fetch("http://localhost:3000/tournament/start", {
			method: "POST",
			credentials: "include",
			headers: { 
			'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
			"Content-Type": "application/json" 
			},
			body: JSON.stringify({ players }),
		})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			console.log("Tournoi démarré:", data);
			const firstmatch = data.data.matches[0];
			if (Player)
				Player.innerHTML = "Match 1 " + firstmatch.player1 + " vs " + firstmatch.player2;
			onWinner((winner) => {
				let result;
				if (winner === "left")
					result = firstmatch.player1;
				else
					result = firstmatch.player2;
				const secondMatch = data.data.matches[1];
				if (Player)
					Player.innerHTML = "Match 2 " + secondMatch.player1 + " vs " + secondMatch.player2;
				onWinner((winner2) => {
					let result2;
					if (winner2 === "left")
						result2 = secondMatch.player1;
					else
						result2 = secondMatch.player2;
					if (Player)
						Player.innerHTML = "Finale " + result + " vs " + result2;
				});
			});
		})
		.catch((err) => {
			console.error("Erreur fetch:", err);
		});
	}
	addBtn?.addEventListener("click", () => {
    const username = usernameInput.value.trim();
        if (username) {
            players.push(username);
            updatePlayersList();
            usernameInput.value = "";
        }
        if (players.length >= 2) {
            CreateTournamentBtn?.classList.remove("enabled");
        } else {
            CreateTournamentBtn?.classList.add("disabled");
        }
    });

    CreateTournamentBtn?.addEventListener("click", () => {
        if (players.length == 4) {
            switchView("TournamentPlayView");
            startTournament();
		}
		else {
			console.log("nop");
		}
	});
	document.getElementById("leftBtn")?.addEventListener("click", () => scoreLeft());
	document.getElementById("rightBtn")?.addEventListener("click", () => scoreRight());
});

let players: string[] = [];
let newPlayer: string = "";
			console.log("ihi");