import { switchView } from "./login";

export type ViewElement = HTMLElement | null;

export const views: Record<string, ViewElement> = {
  loginView: document.getElementById("loginView"),
  signupView: document.getElementById("signupView"),
  dashboardView: document.getElementById("dashboardView"),
  twoFAView: document.getElementById("twoFAView"),
  forgotPasswordView: document.getElementById("forgotPasswordView"),
  secretView: document.getElementById("secretView"),
  profileViewDrop : document.getElementById("profileViewDrop"),
  settingsView : document.getElementById("settingsView")
};


function showViewFromHash(): void {
  let hash = window.location.hash.slice(1);
  if (!hash) {
    hash = "loginView";
  }
  switchView(hash);
}


async function loadProfile(): Promise<void> {
  const username = document.getElementById("profileUsername");
  const email = document.getElementById("profileEmail");

  try {
    const response = await fetch("http://localhost:3000/user", {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      },
      method: "GET",
      credentials: "include"
    });
    const data = await response.json();
    if (data.loggedIn) {
      if (username) username.textContent = data.username;
      if (email) email.textContent = data.email;
    }
  } catch (error) {
    console.error("Error loading profile:", error);
  }
}


async function handleSessionCheck(): Promise<void> {
    try {
    const headers: HeadersInit = {};
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      headers['Authorization'] = `Bearer ${jwt}`;
    }
    const response = await fetch("http://localhost:3000/me", {
      headers,
      credentials: "include"
    });
    const data = await response.json();
    console.log("handleSessionCheck received:", data);

    if (data.loggedIn) {
      showViewFromHash();
    }
    else if (data.needs2FA) {
      switchView("twoFAView");
    }
    else if (
      window.location.hash === "#signupView" ||
      window.location.hash === "#forgotPasswordView" ||
      window.location.hash === "#secretView"
    ) {
      const hash = window.location.hash.slice(1);
      switchView(hash);
    }
    else {
      redirectToLogin();
    }
  } catch (err) {
    console.error("Session check failed", err);
    redirectToLogin();
  } finally {
    document.body.classList.remove("initializing");
  }
}


function redirectToLogin(): void {
  switchView("loginView");
}


function setupNavigationListeners(): void {
  document.getElementById("backToDashboard")?.addEventListener("click", () => {
    window.location.hash = "#dashboardView";
  });

  document.getElementById("settingsBtn")?.addEventListener("click", () => {
    window.location.hash = "#settingsView";
  });

  document.getElementById("backFromSettings")?.addEventListener("click", () => {
    window.location.hash = "#dashboardView";
  });

  document.getElementById("profileBtnScroll")?.addEventListener("click", () => {
    window.location.hash = "#profileView";
    loadProfile();
  });

  document.getElementById("backToDashboardFromProfile")?.addEventListener("click", () => {
    window.location.hash = "#dashboardView";
  });
}


// Initialization
function initialize(): void {
  window.addEventListener("DOMContentLoaded", async () => {
    await handleSessionCheck();
  });

  // Hash change = view change
  window.addEventListener("hashchange", () => {
    handleSessionCheck();
  });

  setupNavigationListeners();
}

initialize();
