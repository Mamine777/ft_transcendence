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
		
		.then(res => {
			console.log("Réponse reçue", res);
			return res.json();
		})
		.then((data) => {
			console.log("Data reçue", data);
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
            console.log("Player added:", username);
            console.log("Current players:", players);
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
            console.log("Tournament started with players:", players);
            startTournament();
        }
		else {
			console.log("nop");
		}
	});
});

let players: string[] = [];
let newPlayer: string = "";
			console.log("ihi");