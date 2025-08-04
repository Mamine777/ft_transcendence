document.addEventListener("DOMContentLoaded", () => {
	const addBtn = document.getElementById("ADDplayerBtn");
	const usernameInput = document.getElementById("PlayerUsername") as HTMLInputElement;
	const playersList = document.getElementById("playersList");

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
		});
	}
	addBtn?.addEventListener("click", () => {
	const username = usernameInput.value.trim();
	const CreateTournamentBtn = document.getElementById("CreateTournamentBtn");
	if (username) {
		players.push(username);
		updatePlayersList();
		usernameInput.value = "";
		console.log("Player added:", username);
		console.log("Current players:", players);
	}
	if (players.length >= 2) {
		CreateTournamentBtn?.classList.remove("disabled");
		CreateTournamentBtn?.addEventListener("click", () => {
			
			startTournament();
			console.log("Tournament started with players:", players);
		});
	}
	else {
		CreateTournamentBtn?.classList.add("disabled");
	}
	});
});

let players: string[] = [];
let newPlayer: string = "";

function addPlayer() {
  players.push(newPlayer);
  newPlayer = "";
}