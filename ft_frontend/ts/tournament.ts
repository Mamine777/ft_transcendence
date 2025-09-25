import { resetScore, stopGameLoop } from "./games/game";
import { getWinner2} from "./games/score";
import { switchView } from "./login";

let ExportUpdateList: () => void;
let ExportErrorList: HTMLElement;
let sizemax = 4;
let size = 1;
let players: string[] = [];
let FinalWinner: string = "";
export { ExportUpdateList, ExportErrorList };

document.addEventListener("DOMContentLoaded", () => {
	const addBtn = document.getElementById("ADDplayerBtn");
	const usernameInput = document.getElementById("PlayerUsername") as HTMLInputElement;
	const playersList = document.getElementById("playersList");
	const Player = document.getElementById("Player_tournament")!;
	const Winner = document.getElementById("Winner_tournament")!;
	const CreateTournamentBtn = document.getElementById("CreateTournamentBtn");
	const ErrorList = document.getElementById("ErrorList");

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
		.then(async (data) => {
			const username = await getusername();
			const firstmatch = data.data.matches[0];
			const secondMatch = data.data.matches[1];

			if (Player)
				Player.innerHTML = "Match 1 " + firstmatch.player1 + " vs " + firstmatch.player2;

			let winner1 = await getWinner2();
			const result = winner1 === "left" ? firstmatch.player1 : firstmatch.player2;
			if (Player)
				Player.innerHTML = "Match 2 " + secondMatch.player1 + " vs " + secondMatch.player2;
			resetScore();
			stopGameLoop();
			const winner2 = await getWinner2();
			resetScore();
			stopGameLoop();
			const result2 = winner2 === "left" ? secondMatch.player1 : secondMatch.player2;
			if (Player)
				Player.innerHTML = "Finale " + result + " vs " + result2;
			resetScore();
			stopGameLoop();
			const finalWinner = await getWinner2();
			const finalResult = finalWinner === "left" ? result : result2;
			if (finalResult === "left")
				FinalWinner = result + " is the Winner!";
			else
			 	FinalWinner = result2 + " is the Winner!";
			switchView("WinnerView");
			if (finalResult == username) {
				fetch("http://localhost:3000/TournamentWinner", {
					method: "POST",
					credentials: "include",
					headers: { 
						'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
						"Content-Type": "application/json" 
					},
					body: JSON.stringify({ Result: 1 }),
				})
			}
			else {
				fetch("http://localhost:3000/TournamentWinner", {
					method: "POST",
					credentials: "include",
					headers: { 
						'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
						"Content-Type": "application/json" 
					},
					body: JSON.stringify({ Result: 0}),
				})
			}

		}
	)
		.catch((err) => {
			console.error("Erreur fetch:", err);
		});
	}
	addBtn?.addEventListener("click", () => {
		const username = usernameInput.value.trim();
		
        if (username) {
			if (playername(username) === false) {
				ErrorList!.innerText = "Error: Player already added";
				usernameInput.value = "";
			}
			else if (size >= 4) {
				ErrorList!.innerText = "Error: Tournament is full";
				usernameInput.value = "";
			}
			else {
				players.push(username);
				updatePlayersList();
				usernameInput.value = "";
				ErrorList!.innerText = "";
				size++;
			}
		}
    });

    CreateTournamentBtn?.addEventListener("click", () => {
        if (size == 4) {
            switchView("TournamentPlayView");
            startTournament();
		}
		else if (size > 4) {
			ErrorList!.innerText = "Error: Need 4 players to start the tournament";
		}
	});
	if (Winner)
		Winner.innerText = FinalWinner;
	ExportErrorList = ErrorList!;
	ExportUpdateList = updatePlayersList;

});

async function getusername(): Promise<string> {
  const response = await fetch("http://localhost:3000/PlayerUsername", {
    method: "GET",
    credentials: "include",
    headers: { 
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
      "Content-Type": "application/json" 
    },
  });
  const data = await response.json();
  return data.username;
}

export function resetPlayer() {
		players = [];
		ExportUpdateList();
		ExportErrorList.innerText = "";
		size = 1;
}


function playername(name: string) {
	let i = 0;
	while (i <= players.length) {
		if (players[i] === name)
			return (false);
		i++;
	}
	return (true);
}

export async function addPlayerbase() {
    const username = await getusername();
	if (playername(username) === true) {
   		players.push(username);
	}
	ExportUpdateList();
}