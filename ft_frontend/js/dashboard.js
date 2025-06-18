



document.addEventListener("DOMContentLoaded", () => {
    const profileBtn = document.getElementById('profileBtn');
    const profileMenu = document.getElementById('profileMenu');
    const logoutBtnDropdown = document.getElementById('logoutBtnDropdown');
    const playBtn = document.getElementById("playBtn");
    const playView = document.getElementById("playView");
    const dashboardView = document.getElementById("dashboardView");
    const loginView = document.getElementById("loginView");
    const SettingsView = document.getElementById("SettingsView");

    window.addEventListener("DOMContentLoaded", async () => {
    try {
      const res = await fetch("/me", {
        method: "GET",
        credentials: "include",
      });
    
      const data = await res.json();
      if (data.loggedIn) {
        loginView.style.display = "none";
        if (window.location.hash === "#play") {
          playView.style.display = "block";
          dashboardView.style.display = "none";
        }
        else if (window.location.hash === "#dashboard") {
          dashboardView.style.display = "block";
          playView.style.display = "none";
        }
        else if (window.location.hash === "#settings") {
          SettingsView.style.display = "block";
          dashboardView.style.display = "none";
        }
        else {
          dashboardView.style.display = "block";
          playView.style.display = "none";
          SettingsView.style.display = "none";
        }
      }
      else {
        loginView.style.display = "block";
        dashboardView.style.display = "none";
        playView.style.display = "none";
      }
    }

    catch (err) {
      console.error("Session check failed", err);
      loginView.style.display = "block";
      dashboardView.style.display = "none";
    }
    finally {
      document.body.classList.remove("initializing");
    }
});

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
                window.location.hash = "login";
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
        window.location.hash = "#dashboard";
        playView.style.display = "none";
        dashboardView.style.display = "block";
    }
       document.getElementById("settingsBtn").onclick = () => {
        window.location.hash = "#settings";
        dashboardView.style.display = "none";
        document.getElementById("SettingsView").style.display = "block";
    }
    document.getElementById("backFromSettings").onclick = () => {
        window.location.hash = "#dashboard";
        SettingsView.style.display = "none";
        dashboardView.style.display = "block";
    }
  function showViewFromHash() {
      if (window.location.hash === "#play") {
          playView.style.display = "block";
          dashboardView.style.display = "none";
          SettingsView.style.display = "none";
      }
      else if(window.location.hash === "#login") {
          loginView.style.display = "block";
          dashboardView.style.display = "none";
          playView.style.display = "none";
          SettingsView.style.display = "none";
      }
       else if (window.location.hash === "#dashboard") {
          dashboardView.style.display = "block";
          playView.style.display = "none";
          SettingsView.style.display = "none";
      } else if (window.location.hash === "#settings") {
          SettingsView.style.display = "block";
          dashboardView.style.display = "none";
          playView.style.display = "none";
      } else {
          dashboardView.style.display = "block";
          playView.style.display = "none";
          SettingsView.style.display = "none";
      }
  }

  window.addEventListener("hashchange", showViewFromHash);
});

document.addEventListener("DOMContentLoaded", () => {
    const settingsForm = document.getElementById("settingsForm");
    const settingsMessage = document.getElementById("settingsMessage");

    settingsForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("/check-settings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                    
                  },
                  credentials: "include",
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            settingsMessage.textContent = result.message || "Settings updated successfully!";
        } catch (error) {
            console.error("Error updating settings:", error);
            settingsMessage.textContent = "Failed to update settings. Please try again.";
        }
    });
}
);