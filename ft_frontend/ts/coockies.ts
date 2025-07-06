type ViewElement = HTMLElement | null;

// Map of views
const views: Record<string, ViewElement> = {
  login: document.getElementById("loginView"),
  dashboard: document.getElementById("dashboardView"),
  play: document.getElementById("playView"),
  settings: document.getElementById("settingsView"),
  profile: document.getElementById("profileView"),
  twoFA: document.getElementById("verify2faContainer"),
  secret: document.getElementById("secretView"),
};

// Hide all views
function hideAllViews(): void {
  Object.values(views).forEach((view) => {
    if (view) view.style.display = "none";
  });
}

// Show a single view
function showView(view: ViewElement): void {
  if (view) view.style.display = "block";
}

// Show the correct view based on the hash
function showViewFromHash(): void {
  hideAllViews();

  let hash = window.location.hash.slice(1);
  if (!hash) {
    hash = "dashboard"; // Default to dashboard if no hash
    window.location.hash = "#dashboard";
  }

  const viewKey = hash === "2fa" ? "twoFA" : hash;
  const view = views[viewKey];
  if (view) {
    showView(view);
  } else {
    showView(views.dashboard); // Fallback
  }
}

// Load user profile data
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

// Check if the session is valid
async function handleSessionCheck(): Promise<void> {
  try {
    const response = await fetch("http://localhost:3000/me", {
      credentials: "include"
    });
    const data = await response.json();

    if (data.loggedIn) {
      showViewFromHash();
    } else {
      redirectToLogin();
    }
  } catch (err) {
    console.error("Session check failed", err);
    redirectToLogin();
  } finally {
    document.body.classList.remove("initializing");
  }
}

// Force to login view
function redirectToLogin(): void {
  hideAllViews();
  showView(views.login);
  window.location.hash = "#login";
}

// Wire navigation button clicks
function setupNavigationListeners(): void {
  document.getElementById("backToDashboard")?.addEventListener("click", () => {
    window.location.hash = "#dashboard";
  });

  document.getElementById("settingsBtn")?.addEventListener("click", () => {
    window.location.hash = "#settings";
  });

  document.getElementById("backFromSettings")?.addEventListener("click", () => {
    window.location.hash = "#dashboard";
  });

  document.getElementById("profileBtnScroll")?.addEventListener("click", () => {
    window.location.hash = "#profile";
    loadProfile();
  });

  document.getElementById("backToDashboardFromProfile")?.addEventListener("click", () => {
    window.location.hash = "#dashboard";
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

// Start app
initialize();
