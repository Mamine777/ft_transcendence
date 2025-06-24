document.addEventListener("DOMContentLoaded", () => {
    const profileBtn = document.getElementById('profileBtn');
    const profileMenu = document.getElementById('profileMenu');
    const logoutBtnDropdown = document.getElementById('logoutBtnDropdown');
    const playBtn = document.getElementById("playBtn");
    const playView = document.getElementById("playView");
    const dashboardView = document.getElementById("dashboardView");
    const loginView = document.getElementById("loginView");
    const SettingsView = document.getElementById("SettingsView");
    const profileView = document.getElementById("profileView");
    const logoutBtnProfile = document.getElementById("logoutBtnProfile");

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
        else if (window.location.hash === "#profile")
        {
          profileView.style.display = "block";
          dashboardView.style.display = "none";
          SettingsView.style.display = "none";
          loginView.style.display = "none";
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
      //logout button
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
      logoutBtnProfile.addEventListener('click', async () =>{
        try {
          const res = await fetch("/logout", {
            method: "POST",
            credentials: "include"
          });
          const data = await res.json();
          if (data.success) {
              dashboardView.style.display = "none";
              profileView.style.display = "none";
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
      })
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
        profileView.style.display = "none";
    }
    else if (window.location.hash === "#login") {
        loginView.style.display = "block";
        dashboardView.style.display = "none";
        playView.style.display = "none";
        SettingsView.style.display = "none";
        profileView.style.display = "none";
    }
    else if (window.location.hash === "#dashboard") {
        dashboardView.style.display = "block";
        playView.style.display = "none";
        SettingsView.style.display = "none";
        profileView.style.display = "none";
    }
    else if (window.location.hash === "#settings") {
        SettingsView.style.display = "block";
        dashboardView.style.display = "none";
        playView.style.display = "none";
        profileView.style.display = "none";
    }
    else if (window.location.hash === "#profile") {
      profileView.style.display = "block";
      dashboardView.style.display = "none";
      SettingsView.style.display = "none";
      loginView.style.display = "none";
    }
    else {
        dashboardView.style.display = "block";
        playView.style.display = "none";
        SettingsView.style.display = "none";
        profileView.style.display = "none";
    }
}
  document.getElementById("profileBtnScroll").onclick = () =>{
    window.location.hash = "#profile";
    dashboardView.style.display = "none";
    profileView.style.display = "block";
    loadProfile();
  }
  document.getElementById("backToDashboardFromProfile").onclick = () =>{
    window.location.hash = "#dashboard";
    profileView.style.display = "none";
    dashboardView.style.display = "block";
  }
  window.addEventListener("hashchange", showViewFromHash);
});

document.getElementById("settingsForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const settingsMessage = document.getElementById("settingsMessage");

    const newUsername = document.getElementById("newUsername").value;
    const newEmail = document.getElementById("newEmail").value;
    const newPassword = document.getElementById("newPassword").value;
    try 
    {
      const response = await fetch("/check-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newEmail: newEmail,
          newPassword: newPassword,
          newUsername: newUsername
        })
      });
      const data = await response.json();
      if (data.success)
      {
        settingsMessage.textContent = data.message;
      }
    }
    catch (error) {
      console.error("Error during signup check:", error);
      settingsMessage.textContent = "An error occurred. Please try again.";
    }
});

async function loadProfile() {
  const username = document.getElementById("profileUsername");
  const email = document.getElementById("profileEmail");
  try {
    const response = await fetch("/user", {
      method: "GET",
      credentials: "include"
    });
    const data = await response.json();
    if (data.loggedIn) {
      username.textContent = data.username;
      email.textContent = data.email;
    }
  } catch (error) {
    console.error("Error loading profile:", error);
  }
}