// export const profileBtn = document.getElementById('profileBtn');
// export const profileMenu = document.getElementById('profileMenu');
// export const logoutBtnDropdown = document.getElementById('logoutBtnDropdown');
// export const playBtn = document.getElementById("playBtn");
// export const playView = document.getElementById("playView");
// export const friendBtn = document.getElementById("friendBtn");
// export const friendView = document.getElementById("friendView");
// export const dashboardView = document.getElementById("dashboardView");
// export const loginView = document.getElementById("loginView");
// export const SettingsView = document.getElementById("SettingsView");
// export const profileView = document.getElementById("profileView");
// export const logoutBtnProfile = document.getElementById("logoutBtnProfile");

export class Dashboard {
  constructor() {}
  render(): string {
    return `
      <!-- Centered Main Buttons -->
      <div class="flex flex-col items-center justify-center h-full space-y-8">
      <button id="profileBtn" class="absolute top-10 right-6 bg-gray-300 text-gray-900 py-2 px-6 rounded shadow-md hover:bg-gray-400 transition">Profile</button>
        <h1 class="text-white text-4xl font-bold mb-6 drop-shadow-lg">ft_transcendence</h1>
        <p class="text-white text-lg mb-8">The Ultimate Ping Pong Showdown</p>
        <div class="flex flex-col gap-6 w-full max-w-md">
          <button id="play" class="bg-gray-300 text-gray-900 px-10 py-4 w-full text-lg rounded-xl shadow hover:bg-gray-400 transition">Play</button>
          <button class="bg-gray-300 text-gray-900 px-10 py-4 w-full text-lg rounded-xl shadow hover:bg-gray-400 transition">Tournament</button>
          <button id="friendBtn" class="bg-gray-300 text-gray-900 px-10 py-4 w-full text-lg rounded-xl shadow hover:bg-gray-400 transition">Friends</button>
        </div>
      </div>
      <button id="chatBtn" class="absolute bottom-6 right-6 bg-gray-300 text-gray-900 py-2 px-6 rounded shadow-md hover:bg-gray-400 transition">Chat</button>
      </div>
      `;
  }

  attachEvents() {
    const playBtn = document.getElementById("play");
    const friendBtn = document.getElementById("friendBtn");
    const profileBtn = document.getElementById("profileBtn");
    if (playBtn) {
      playBtn.addEventListener("click", () => {
        window.location.hash = "#play";
      });
    }
    if (friendBtn) {
      friendBtn.addEventListener("click", () => {
        window.location.hash = "#friends";
      });
    }
      if (profileBtn) {
        profileBtn.addEventListener("click", () => {
        window.location.hash = "#profile";
      });
    }
  }

}

// document.addEventListener("DOMContentLoaded", () => {
//     window.addEventListener("DOMContentLoaded", async () => {
//     try {
//       const res = await fetch("/me", {
//         method: "GET",
//         credentials: "include",
//       });
    
//       const data = await res.json();
  
//       if (data.loggedIn) {
//         loginView.style.display = "none";
//         if (window.location.hash === "#play") {
//           playView.style.display = "block";
//           dashboardView.style.display = "none";
//         }
//         else if (window.location.hash === "#dashboard") {
//           dashboardView.style.display = "block";
//           playView.style.display = "none";
//         }
//         else if (window.location.hash === "#settings") {
//           SettingsView.style.display = "block";
//           dashboardView.style.display = "none";
//         }
//         else if (window.location.hash === "#profile")
//         {
//           profileView.style.display = "block";
//           dashboardView.style.display = "none";
//           SettingsView.style.display = "none";
//           loginView.style.display = "none";
//         }
//         else if (window.location.hash === "#friends") {
//           friendView.style.display = "block";
//           dashboardView.style.display = "none";
//           playView.style.display = "none";
//           SettingsView.style.display = "none";
//         }
//         else {
//           dashboardView.style.display = "block";
//           playView.style.display = "none";
//           SettingsView.style.display = "none";
//         }
//       }
//       else {
//         loginView.style.display = "block";
//         dashboardView.style.display = "none";
//         playView.style.display = "none";
//       }
//     }

//     catch (err) {
//       console.error("Session check failed", err);
//       loginView.style.display = "block";
//       dashboardView.style.display = "none";
//     }
//     finally {
//       document.body.classList.remove("initializing");
//     }
//   });

//     profileBtn.addEventListener('click', () => {
//         profileMenu.classList.toggle('hidden');
//       });
//       //logout button
//       logoutBtnDropdown.addEventListener('click', async () => {
//         try {
//             const res = await fetch("/logout", {
//               method: "POST",
//               credentials: "include"
//             });
//             const data = await res.json();
//             if (data.success) {
//                 dashboardView.style.display = "none";
//                 loginView.style.display = "block";
//                 const emailInput = document.getElementById("email");
//                 const passwordInput = document.getElementById("password");
//                 const loginMessage = document.getElementById("loginMessage");
//                 window.location.hash = "#login";
//                 if (emailInput) emailInput.value = "";
//                 if (passwordInput) passwordInput.value = "";
//                 if (loginMessage) loginMessage.textContent = "";
//             } else {
//                 alert("Logout failed. Please try again.");
//             }
//           } catch (err) {
//             console.error("Logout error:", err);
//             alert("An error occurred during logout.");
//           }
//       });
//       logoutBtnProfile.addEventListener('click', async () =>{
//         try {
//           const res = await fetch("/logout", {
//             method: "POST",
//             credentials: "include"
//           });
//           const data = await res.json();
//           if (data.success) {
//               dashboardView.style.display = "none";
//               profileView.style.display = "none";
//               loginView.style.display = "block";
//               const emailInput = document.getElementById("email");
//               const passwordInput = document.getElementById("password");
//               const loginMessage = document.getElementById("loginMessage");
//               window.location.hash = "login";
//               if (emailInput) emailInput.value = "";
//               if (passwordInput) passwordInput.value = "";
//               if (loginMessage) loginMessage.textContent = "";
//           } else {
//               alert("Logout failed. Please try again.");
//           }
//         } catch (err) {
//           console.error("Logout error:", err);
//           alert("An error occurred during logout.");
//         }
//       })
//       document.addEventListener('click', (e) => {
//         if (!profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
//           profileMenu.classList.add('hidden');
//         }
//       });
      
//       document.getElementById("playBtn").onclick = () =>{
//         window.location.hash = "#play";
//         dashboardView.style.display = "none";
//         playView.style.display = "block";
//       }

//       document.getElementById("friendBtn").onclick = () => {
//         window.location.hash = "#friends";
//         dashboardView.style.display = "none";
//         friendView.style.display = "block";
//     }

//     document.getElementById("backToDashboard").onclick = () => {
//         window.location.hash = "#dashboard";
//         playView.style.display = "none";
//         friendView.style.display = "none";
//         dashboardView.style.display = "block";
//     }
//        document.getElementById("settingsBtn").onclick = () => {
//         window.location.hash = "#settings";
//         dashboardView.style.display = "none";
//         document.getElementById("SettingsView").style.display = "block";
//     }
//     document.getElementById("backFromSettings").onclick = () => {
//         window.location.hash = "#dashboard";
//         SettingsView.style.display = "none";
//         dashboardView.style.display = "block";
//     }

//   function showViewFromHash() {
//     if (window.location.hash === "#play") {
//         playView.style.display = "block";
//         dashboardView.style.display = "none";
//         SettingsView.style.display = "none";
//         profileView.style.display = "none";
//     }
//     else if (window.location.hash === "#friends") {
//         friendView.style.display = "block";
//         dashboardView.style.display = "none";
//         playView.style.display = "none";
//         SettingsView.style.display = "none";
//         profileView.style.display = "none";
//     }
//     else if (window.location.hash === "#login") {
//         loginView.style.display = "block";
//         dashboardView.style.display = "none";
//         playView.style.display = "none";
//         SettingsView.style.display = "none";
//         profileView.style.display = "none";
//     }
//     else if (window.location.hash === "#dashboard") {
//         dashboardView.style.display = "block";
//         playView.style.display = "none";
//         SettingsView.style.display = "none";
//         profileView.style.display = "none";
//         friendView.style.display = "none";
//     }
//     else if (window.location.hash === "#settings") {
//         SettingsView.style.display = "block";
//         dashboardView.style.display = "none";
//         playView.style.display = "none";
//         profileView.style.display = "none";
//     }
//     else if (window.location.hash === "#profile") {
//       profileView.style.display = "block";
//       dashboardView.style.display = "none";
//       SettingsView.style.display = "none";
//       loginView.style.display = "none";
//     }
//     else {
//         dashboardView.style.display = "block";
//         playView.style.display = "none";
//         SettingsView.style.display = "none";
//         profileView.style.display = "none";
//     }
// }
//   document.getElementById("profileBtnScroll").onclick = () =>{
//     window.location.hash = "#profile";
//     dashboardView.style.display = "none";
//     profileView.style.display = "block";
//   }
//   document.getElementById("backToDashboardFromProfile").onclick = () =>{
//     window.location.hash = "#dashboard";
//     profileView.style.display = "none";
//     dashboardView.style.display = "block";
//   }
//   window.addEventListener("hashchange", showViewFromHash);
// });

// document.getElementById("settingsForm").addEventListener("submit", async function (event) {
//     event.preventDefault();
//     const settingsMessage = document.getElementById("settingsMessage");

//     const newUsername = document.getElementById("newUsername").value;
//     const newEmail = document.getElementById("newEmail").value;
//     const newPassword = document.getElementById("newPassword").value;
//     try 
//     {
//       const response = await fetch("/check-settings", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           newEmail: newEmail,
//           newPassword: newPassword,
//           newUsername: newUsername
//         })
//       });
//       const data = await response.json();
//       if (data.success)
//       {
//         settingsMessage.textContent = data.message;
//       }
//     }
//     catch (error) {
//       console.error("Error during signup check:", error);
//       settingsMessage.textContent = "An error occurred. Please try again.";
//     }
// });
