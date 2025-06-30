export class Profile {
	constructor() {}
	render(): string {
		return `
			<div id="profileView" div class="flex flex-col items-center justify-center h-full space-y-8">
			<button id="backBtn" class="absolute top-6 left-6 bg-gray-300 text-gray-900 py-2 px-6 rounded shadow hover:bg-gray-400 transition">  ← Back </button>
			<button id="settingsBtn" class="absolute top-6 right-6 bg-gray-300 text-gray-900 py-2 px-6 rounded shadow hover:bg-gray-400 transition">  settings </button>


			<div class="flex flex-col items-center justify-center h-full px-4">
				<h2 class="text-4xl font-bold text-center mb-6">👤 My Profile</h2>

				<div class="w-full max-w-md bg-gray-100 rounded-2xl shadow-lg p-6">
				<div class="flex flex-col items-center space-y-4">
					<img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=User" alt="avatar" class="w-24 h-24 rounded-full shadow-md" />
					<div class="text-center">
					<h3 id="profileUsername" class="text-2xl font-semibold"></h3>
					<p id="profileEmail" class="text-gray-600"></p>
					</div>
					<div class="w-full mt-4">
					<p class="font-medium text-lg">Stats:</p>
					<ul class="mt-2 space-y-1 text-gray-700">
						<li>🏆 Wins: <span id="profileWins">0</span></li>
						<li>❌ Losses: <span id="profileLosses">0</span></li>
						<li>🔥 Rank: <span id="profileRank">Bronze</span></li>
					</ul>
					</div>
					<button id="logoutBtnProfile" class="mt-6 bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700 transition">
					Logout
					</button>
				</div>
				</div>
			</div>
			</div>`
	}
	renderSettings(): string {
		return `
			<div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-gray-800 mx-auto">
			<button id="backProfileBtn" type="button" class="mb-4 bg-gray-300 text-gray-900 py-1 px-4 rounded shadow hover:bg-gray-400 transition">
				← Back
			</button>
			<h2 class="text-3xl font-bold mb-6 text-center">Settings</h2>
			<form id="settingsForm" method="post" class="flex flex-col gap-6">
				<div>
				<label for="newUsername" class="block font-semibold mb-1">Change Username</label>
				<input type="text" id="newUsername" name="newUsername" placeholder="New Username" class="w-full p-2 border rounded" />
				</div>
				<div>
				<label for="newEmail" class="block font-semibold mb-1">Change Email</label>
				<input type="email" id="newEmail" name="newEmail" placeholder="New Email" class="w-full p-2 border rounded" />
				</div>
				<div>
				<label for="newPassword" class="block font-semibold mb-1">Change Password</label>
				<input type="password" id="newPassword" name="newPassword" placeholder="New Password" class="w-full p-2 border rounded" />
				</div>
				<div>
				<label for="avatarSeed" class="block font-semibold mb-1">Change Avatar (Pixel Animal)</label>
				<div class="flex items-center gap-4">
					<input type="text" id="avatarSeed" name="avatarSeed" placeholder="Avatar Seed (e.g. cat, dog, fox)" class="p-2 border rounded flex-1" />
					<img id="avatarPreview" src="https://api.dicebear.com/7.x/pixel-art/svg?seed=cat" alt="Avatar Preview" class="w-12 h-12 rounded-full border" />
				</div>
				<button type="button" id="randomAvatarBtn" class="mt-2 bg-gray-300 text-gray-900 py-1 px-4 rounded shadow hover:bg-gray-400 transition">Random</button>
				</div>
				<button type="submit" class="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Save Changes</button>
				<p id="settingsMessage" class="message text-sm text-red-500 text-center mt-2"></p>
			</form>
</div>
			`;
	}


	attachEvents() {
		const backBtn = document.getElementById("backBtn");
		const logoutBtn = document.getElementById("logoutBtnProfile");
		const settingsBtn = document.getElementById("settingsBtn");
		const avatarBtn = document.getElementById("avatarBtn");
		const emailBtn = document.getElementById("Email");
		const passwordBtn = document.getElementById("Password");
		const usernameBtn = document.getElementById("Username");
		const backProfileBtn = document.getElementById("backProfileBtn");
		const settingsForm = document.getElementById("settingsForm") as HTMLFormElement | null;
		if (settingsForm) {
			settingsForm.addEventListener("submit", async function (event) {
				event.preventDefault();
				const settingsMessage = document.getElementById("settingsMessage") as HTMLElement | null;

				const newUsername = (document.getElementById("newUsername") as HTMLInputElement).value;
				const newEmail = (document.getElementById("newEmail") as HTMLInputElement).value;
				const newPassword = (document.getElementById("newPassword") as HTMLInputElement).value;
				try {
					const response = await fetch("http://localhost:3000/check-settings", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							newEmail: newEmail,
							newPassword: newPassword,
							newUsername: newUsername
						})
					});
					const data = await response.json();
					if (settingsMessage) {
						if (data.success) {
							settingsMessage.textContent = data.message;
						} else {
							settingsMessage.textContent = data.message || "An error occurred.";
						}
					}
				} catch (error) {
					console.error("Error during settings check:", error);
					if (settingsMessage)
						settingsMessage.textContent = "An error occurred. Please try again.";
				}
			});
		}
		if (backProfileBtn) {
			backProfileBtn.addEventListener("click", () => {
				window.location.hash = "#profile";
			});
		}
		if (backBtn) {
			backBtn.addEventListener("click", () => {
				window.location.hash = "#dashboard";
			});
		}
		if (logoutBtn) {
			logoutBtn.addEventListener("click", () => {
				window.location.hash = "#login";
			});
		}
		if (settingsBtn) {
			settingsBtn.addEventListener("click", () => {
				window.location.hash = "#settings";
			});
		}
		if (avatarBtn) {
			avatarBtn.addEventListener("click", () => {
				alert("Avatar clicked!");
				// Or open a menu, modal, etc.
			});
		}
		if (emailBtn) {
			emailBtn.addEventListener("click", () => {
				window.location.hash = "#change-email";
			});
		}
		if (passwordBtn) {
			passwordBtn.addEventListener("click", () => {
				window.location.hash = "#change-password";
			});
		}
		if (usernameBtn) {
			usernameBtn.addEventListener("click", () => {
				window.location.hash = "#change-username";
			});
		}
	}
};