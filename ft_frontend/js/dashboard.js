



document.addEventListener("DOMContentLoaded", () => {
    const profileBtn = document.getElementById('profileBtn');
    const profileMenu = document.getElementById('profileMenu');
    const logoutBtnDropdown = document.getElementById('logoutBtnDropdown');
    const playBtn = document.getElementById("playBtn");
    const playView = document.getElementById("playView");
    const dashboardView = document.getElementById("dashboardView");
    const loginView = document.getElementById("loginView");

    profileBtn.addEventListener('click', () => {
        profileMenu.classList.toggle('hidden');
      });
      logoutBtnDropdown.addEventListener('click', async () => {
        try {
            const res = await fetch("/logout", {
              method: "POST",
              credentials: "include"
            });
            const data = await res.json();
            if (data.success) {
                dashboardView.style.display = "none";
                loginView.style.display = "block";
                const emailInput = document.getElementById("email");
                const passwordInput = document.getElementById("password");
                const loginMessage = document.getElementById("loginMessage");
      
                if (emailInput) emailInput.value = "";
                if (passwordInput) passwordInput.value = "";
                if (loginMessage) loginMessage.textContent = "";
            } else {
                alert("Logout failed. Please try again.");
            }
          } catch (err) {
            console.error("Logout error:", err);
            alert("An error occurred during logout.");
          }
      });
      
      document.addEventListener('click', (e) => {
        if (!profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
          profileMenu.classList.add('hidden');
        }
      });
      
      document.getElementById("playBtn").onclick = () =>{
        window.location.hash = "#play";
        dashboardView.style.display = "none";
        playView.style.display = "block";
      }

    document.getElementById("backToDashboard").onclick = () => {
        playView.style.display = "none";
        dashboardView.style.display = "block";
    }

});

