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
  settingsView : document.getElementById("settingsView"),
  FriendsView : document.getElementById("FriendsView"),
  friendsListView : document.getElementById("friendsListView"),
  addFriendView : document.getElementById("addFriendView"),
  removeFriendView : document.getElementById("removeFriendView"),
  GameView: document.getElementById("GameView")
};


function showViewFromHash(): void {
  let hash = window.location.hash.slice(1);
  if (!hash) {
    hash = "loginView";
  }
  switchView(hash);
}


export async function loadProfile(): Promise<void> {
  const username = document.getElementById("profileUsername");
  const email = document.getElementById("profileEmail");
  const avatar = document.getElementById("profileAvatar") as HTMLImageElement;

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
       if (avatar && data.avatar) {
        avatar.src = `${data.avatar}?t=${Date.now()}`;
        avatar.classList.remove("hidden");
      }
    }
  } catch (error) {
    console.error("Error loading profile:", error);
  }
}


 export async function handleSessionCheck(): Promise<void> {
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
    loadProfile();
  });

  document.getElementById("settingsBtn")?.addEventListener("click", () => {
    window.location.hash = "#settingsView";
    loadProfile();
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
    loadProfile();
  });
  document.getElementById("backToFriendsFromList")?.addEventListener('click', () =>{
    switchView("dashboardView");
    loadProfile();
  })
  document.getElementById("backToFriendsFromRemove")?.addEventListener('click', () =>{
    switchView("dashboardView");
    loadProfile();
  })
  document.getElementById("backToFriendsFromAdd")?.addEventListener('click', () =>{
    switchView("dashboardView");
    loadProfile();
  })
  document.getElementById("backToDashboardFromFriends")?.addEventListener('click', () =>{
    switchView("dashboardView");
    loadProfile();
  })
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
