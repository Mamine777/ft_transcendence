export class Friends {
	constructor() {}
	render(): string {
		return `
			<div class="flex flex-col items-center justify-center h-full space-y-8">
			<button id="backToDashboard" class="absolute top-6 left-6 bg-gray-300 text-gray-900 py-2 px-6 rounded shadow hover:bg-gray-400 transition">  ← Back </button>
			<div class="flex flex-col items-center justify-center text-center w-full h-full max-w-md mx-auto">
				<h2 class="text-4xl font-bold mb-8 drop-shadow-lg">👥 Friends List</h2>
				<div class="flex flex-col gap-6 w-full max-w-md">   
					<button id="ListBtn" class="bg-gray-300 text-gray-900 px-10 py-4 w-full text-lg rounded-xl shadow hover:bg-gray-400 transition"> Liste </button>
					<button id="addfriendBtn" class="bg-gray-300 text-gray-900 px-10 py-4 w-full text-lg rounded-xl shadow hover:bg-gray-400 transition"> Add friend </button>
					<button id="RemoveBtn" class="bg-gray-300 text-gray-900 px-10 py-4 w-full text-lg rounded-xl shadow hover:bg-gray-400 transition"> Remove friend </button>
				</div>
			</div>
			</div>
			`;
	}
	attachEvents() {
		const addfriendBtn = document.getElementById("addfriendBtn");
		const listBtn = document.getElementById("ListBtn");
		const removeBtn = document.getElementById("RemoveBtn");
		const backToDashboard = document.getElementById("backToDashboard");

		if (listBtn) {
			listBtn.addEventListener("click", () => {
				window.location.hash = "#listfriends";
			});
		}
		if (addfriendBtn) {
			addfriendBtn.addEventListener("click", () => {
				window.location.hash = "#addfriends";
			});
		}
		if (removeBtn) {
			removeBtn.addEventListener("click", () => {
				window.location.hash = "#removefriends";
			});
		}
		if (backToDashboard) {
			backToDashboard.addEventListener("click", () => {
				window.location.hash = "#dashboard";
			});
		}
	}
}



// export const addfriendBtn = document.getElementById("addfriendBtn");
// export const addfriendView = document.getElementById("addfriendView");
// export const sendFriendRequestBtn = document.getElementById("sendFriendRequestBtn");
// export const friendNameInput = document.getElementById("friendNameInput");
// export const addFriendMessage = document.getElementById("addFriendMessage");

// document.addEventListener("DOMContentLoaded", () => {
//     window.addEventListener("DOMContentLoaded", async () => {
// try {
// 	  const res = await fetch("/me", {
// 		method: "GET",
// 		credentials: "include",
// 	  });
	
// 	  const data = await res.json();
  
// 	  if (data.loggedIn) {
// 		loginView.style.display = "none";
// 		if (window.location.hash === "#friends") {
// 		  friendView.style.display = "block";
// 		  dashboardView.style.display = "none";
// 		}
// 		else if (window.location.hash === "#addfriends") {
// 		  addfriendView.style.display = "block";
// 		  friendView.style.display = "none";
// 		  dashboardView.style.display = "none";
// 		}
// 	  }
// 	  else {
// 		loginView.style.display = "block";
// 		dashboardView.style.display = "none";
// 		playView.style.display = "none";
// 	  }
// 	}
// 	catch (err) {
// 	  console.error("Session check failed", err);
// 	  loginView.style.display = "block";
// 	  dashboardView.style.display = "none";
// 	}
// 	finally {
// 	  document.body.classList.remove("initializing");
// 	}
// 	});

// 	document.getElementById("addfriendBtn").onclick = () => {
// 		window.location.hash = "addfriends";
// 		dashboardView.style.display = "none";
// 		addfriendView.style.display = "block";
// 	}

// 	function showViewFromHash() {
// 		if (window.location.hash === "#addfriends") {
// 			addfriendView.style.display = "block";
// 			dashboardView.style.display = "none";
// 			playView.style.display = "none";
// 			SettingsView.style.display = "none";
// 			profileView.style.display = "none";
// 		}
// 		else {
// 			dashboardView.style.display = "block";
// 			playView.style.display = "none";
// 			SettingsView.style.display = "none";
// 			profileView.style.display = "none";
// 		}
// 	}

// 	if (sendFriendRequestBtn && friendNameInput) {
//    		sendFriendRequestBtn.onclick = async () => {
// 			const friendName = friendNameInput.value.trim();
// 			if (!friendName) {
// 				addFriendMessage.textContent = "Veuillez entrer un nom.";
// 				return;
// 			}
// 			try {
// 				const res = await fetch("/addfriend", {
// 				method: "POST",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify({ friendName }),
// 				credentials: "include"
// 			});
// 			const data = await res.json();
// 			if (data.success) {
// 				addFriendMessage.textContent = "Ami ajouté avec succès !";
// 			} 
// 			else {
// 				addFriendMessage.textContent = data.message || "Erreur lors de l'ajout.";
// 			}
// 		} 	
// 		catch (err) {
// 				addFriendMessage.textContent = "Erreur réseau.";
// 			}
// 		};
// 	}
// });