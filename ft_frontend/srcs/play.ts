export class Play {
	constructor() {}
	render(): string {
		return `
			<div class="flex flex-col items-center justify-center h-full space-y-8">
			<button id="backToDashboard" class="absolute top-10 left-6 bg-gray-300 text-gray-900 py-2 px-6 rounded shadow hover:bg-gray-400 transition">
				← Back
			</button>
				<h2 class="text-4xl font-bold mb-10 drop-shadow-lg">🎮 Choose Your Opponent</h2>
				<div class="flex flex-col gap-6 w-full">
				<button id="challengeFriend" class="bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl shadow text-lg transition">
					Challenge a Friend
				</button>
				<button id="challengeRandom" class="bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-xl shadow text-lg transition">
					Challenge a Random
				</button>
				<button id="challengeBot" class="bg-pink-600 hover:bg-pink-700 text-white py-4 px-6 rounded-xl shadow text-lg transition">
					Challenge a Bot
				</button>
				</div>
			</div>
			</div>
		`	;
	}

  attachEvents() {
		const BotBtn = document.getElementById("challengeBot");
		const RdmBtn = document.getElementById("Rdm");
		const FrndBtn = document.getElementById("challengeFriend");
		const BackBtn = document.getElementById("backToDashboard");
		if (BotBtn) {
		BotBtn.addEventListener("click", () => {
			window.location.hash = "#challengeBot";
		});
		}
		if (RdmBtn) {
		RdmBtn.addEventListener("click", () => {
			window.location.hash = "#challengeRandom";
		});
		}
		if (FrndBtn) {
		FrndBtn.addEventListener("click", () => {
			window.location.hash = "#challengeFriend";
		});
		}
		if (BackBtn) {
			BackBtn.addEventListener("click", () => {
			window.location.hash = "#dashboard";
		});
		}
	}
}