var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { switchView } from "./login";
export const views = {
    loginView: document.getElementById("loginView"),
    signupView: document.getElementById("signupView"),
    dashboardView: document.getElementById("dashboardView"),
    twoFAView: document.getElementById("twoFAView"),
    forgotPasswordView: document.getElementById("forgotPasswordView"),
    secretView: document.getElementById("secretView"),
    profileViewDrop: document.getElementById("profileViewDrop"),
    settingsView: document.getElementById("settingsView"),
    TournamentView: document.getElementById("TournamentView"),
    FriendsView: document.getElementById("FriendsView"),
    friendsListView: document.getElementById("friendsListView"),
    addFriendView: document.getElementById("addFriendView"),
    removeFriendView: document.getElementById("removeFriendView"),
    GameView: document.getElementById("GameView")
};
function showViewFromHash() {
    let hash = window.location.hash.slice(1);
    if (!hash) {
        hash = "loginView";
    }
    switchView(hash);
}
export function loadProfile() {
    return __awaiter(this, void 0, void 0, function* () {
        const username = document.getElementById("profileUsername");
        const email = document.getElementById("profileEmail");
        const avatar = document.getElementById("profileAvatar");
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
                if (avatar && data.avatar) {
                    avatar.src = `${data.avatar}?t=${Date.now()}`;
                    avatar.classList.remove("hidden");
                }
            }
        }
        catch (error) {
            console.error("Error loading profile:", error);
        }
    });
}
export function handleSessionCheck() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const headers = {};
            const jwt = localStorage.getItem('jwt');
            if (jwt) {
                headers['Authorization'] = `Bearer ${jwt}`;
            }
            const response = yield fetch("http://localhost:3000/me", {
                headers,
                credentials: "include"
            });
            const data = yield response.json();
            console.log("handleSessionCheck received:", data);
            if (data.loggedIn) {
                showViewFromHash();
            }
            else if (data.needs2FA) {
                switchView("twoFAView");
            }
            else if (window.location.hash === "#signupView" ||
                window.location.hash === "#forgotPasswordView" ||
                window.location.hash === "#secretView") {
                const hash = window.location.hash.slice(1);
                switchView(hash);
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
function redirectToLogin() {
    switchView("loginView");
}
function setupNavigationListeners() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    (_a = document.getElementById("backToDashboard")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        window.location.hash = "#dashboardView";
        loadProfile();
    });
    (_b = document.getElementById("settingsBtn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
        window.location.hash = "#settingsView";
        loadProfile();
    });
    (_c = document.getElementById("backFromSettings")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
        window.location.hash = "#dashboardView";
    });
    (_d = document.getElementById("profileBtnScroll")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => {
        window.location.hash = "#profileView";
        loadProfile();
    });
    (_e = document.getElementById("backToDashboardFromProfile")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", () => {
        window.location.hash = "#dashboardView";
        loadProfile();
    });
    (_f = document.getElementById("backToFriendsFromList")) === null || _f === void 0 ? void 0 : _f.addEventListener('click', () => {
        switchView("dashboardView");
        loadProfile();
    });
    (_g = document.getElementById("backToFriendsFromRemove")) === null || _g === void 0 ? void 0 : _g.addEventListener('click', () => {
        switchView("dashboardView");
        loadProfile();
    });
    (_h = document.getElementById("backToFriendsFromAdd")) === null || _h === void 0 ? void 0 : _h.addEventListener('click', () => {
        switchView("dashboardView");
        loadProfile();
    });
    (_j = document.getElementById("backToDashboardFromFriends")) === null || _j === void 0 ? void 0 : _j.addEventListener('click', () => {
        switchView("dashboardView");
        loadProfile();
    });
    (_k = document.getElementById("backToDashboardFromGame")) === null || _k === void 0 ? void 0 : _k.addEventListener('click', () => {
        switchView("dashboardView");
        loadProfile();
    });
    (_l = document.getElementById("backToDashboardFromTournament")) === null || _l === void 0 ? void 0 : _l.addEventListener('click', () => {
        switchView("dashboardView");
        loadProfile();
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
initialize();
