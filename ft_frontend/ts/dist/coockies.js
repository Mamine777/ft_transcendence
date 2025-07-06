"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Map of views
const views = {
    login: document.getElementById("loginView"),
    dashboard: document.getElementById("dashboardView"),
    play: document.getElementById("playView"),
    settings: document.getElementById("settingsView"),
    profile: document.getElementById("profileView"),
    twoFA: document.getElementById("verify2faContainer"),
    secret: document.getElementById("secretView"),
};
// Hide all views
function hideAllViews() {
    Object.values(views).forEach((view) => {
        if (view)
            view.style.display = "none";
    });
}
// Show a single view
function showView(view) {
    if (view)
        view.style.display = "block";
}
// Show the correct view based on the hash
function showViewFromHash() {
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
    }
    else {
        showView(views.dashboard); // Fallback
    }
}
// Load user profile data
function loadProfile() {
    return __awaiter(this, void 0, void 0, function* () {
        const username = document.getElementById("profileUsername");
        const email = document.getElementById("profileEmail");
        try {
            const response = yield fetch("http://localhost:3000/user", {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                method: "GET",
                credentials: "include"
            });
            const data = yield response.json();
            if (data.loggedIn) {
                if (username)
                    username.textContent = data.username;
                if (email)
                    email.textContent = data.email;
            }
        }
        catch (error) {
            console.error("Error loading profile:", error);
        }
    });
}
// Check if the session is valid
function handleSessionCheck() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("http://localhost:3000/me", {
                credentials: "include"
            });
            const data = yield response.json();
            if (data.loggedIn) {
                showViewFromHash();
            }
            else {
                redirectToLogin();
            }
        }
        catch (err) {
            console.error("Session check failed", err);
            redirectToLogin();
        }
        finally {
            document.body.classList.remove("initializing");
        }
    });
}
// Force to login view
function redirectToLogin() {
    hideAllViews();
    showView(views.login);
    window.location.hash = "#login";
}
// Wire navigation button clicks
function setupNavigationListeners() {
    var _a, _b, _c, _d, _e;
    (_a = document.getElementById("backToDashboard")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        window.location.hash = "#dashboard";
    });
    (_b = document.getElementById("settingsBtn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
        window.location.hash = "#settings";
    });
    (_c = document.getElementById("backFromSettings")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
        window.location.hash = "#dashboard";
    });
    (_d = document.getElementById("profileBtnScroll")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => {
        window.location.hash = "#profile";
        loadProfile();
    });
    (_e = document.getElementById("backToDashboardFromProfile")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", () => {
        window.location.hash = "#dashboard";
    });
}
// Initialization
function initialize() {
    window.addEventListener("DOMContentLoaded", () => __awaiter(this, void 0, void 0, function* () {
        yield handleSessionCheck();
    }));
    // Hash change = view change
    window.addEventListener("hashchange", () => {
        handleSessionCheck();
    });
    setupNavigationListeners();
}
// Start app
initialize();
