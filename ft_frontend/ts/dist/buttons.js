var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { switchView } from './login';
// Ensure the DOM is fully loaded before attaching event listeners
document.addEventListener("DOMContentLoaded", () => {
    // Event listener for "Sign Up" button
    const goToSignup = document.getElementById("goToSignup");
    if (goToSignup) {
        goToSignup.addEventListener("click", () => {
            switchView("signupView");
        });
    }
    // Event listener for "Log In" button in the Sign Up view
    const goToLogin = document.getElementById("goToLogin");
    if (goToLogin) {
        goToLogin.addEventListener("click", () => {
            switchView("loginView");
        });
    }
    // Event listener for "Reset Password" button
    const goToForgotPassword = document.getElementById("goToForgotPassword");
    if (goToForgotPassword) {
        goToForgotPassword.addEventListener("click", () => {
            switchView("forgotPasswordView");
        });
    }
    // Event listener for "Back to Login" button in the Forgot Password view
    const backToLogin = document.getElementById("backtoLogin");
    if (backToLogin) {
        backToLogin.addEventListener("click", () => {
            switchView("loginView");
        });
    }
    const FriendsBtn = document.getElementById("FriendsBtn");
    if (FriendsBtn)
        FriendsBtn.addEventListener("click", () => {
            switchView("FriendsView");
        });
    // Event listener for "Continue to Login" button in the Secret Phrase view
    const continueToLogin = document.getElementById("continueToLogin");
    if (continueToLogin) {
        continueToLogin.addEventListener("click", () => {
            switchView("loginView");
        });
    }
    const showRemoveFriendBtn = document.getElementById("showRemoveFriendBtn");
    if (showRemoveFriendBtn) {
        showRemoveFriendBtn.addEventListener("click", () => {
            switchView("removeFriendView");
        });
    }
    // Event listener for "Logout" button in the Dashboard view
    const logoutBtnDropdown = document.getElementById("logoutBtnDropdown");
    if (logoutBtnDropdown) {
        logoutBtnDropdown.addEventListener("click", () => {
            switchView("loginView");
        });
    }
    const showAddFriendBtn = document.getElementById("showAddFriendBtn");
    if (showAddFriendBtn) {
        showAddFriendBtn.addEventListener("click", () => {
            switchView("addFriendView");
        });
    }
    const profileMenuBtn = document.getElementById("profileMenuBtn");
    const dropdownMenu = document.getElementById("dropdownMenu");
    if (profileMenuBtn && dropdownMenu) {
        profileMenuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle("hidden");
        });
        document.addEventListener("click", (e) => {
            if (!dropdownMenu.classList.contains("hidden")) {
                dropdownMenu.classList.add("hidden");
            }
        });
        dropdownMenu.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    }
    const settinsBtn = document.getElementById("settingsBtn");
    if (settinsBtn) {
        settinsBtn.addEventListener('click', () => {
            switchView("settingsView");
        });
    }
    //fill the profile with info
    const profileBtn = document.getElementById("profileBtn");
    if (profileBtn) {
        profileBtn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const jwt = localStorage.getItem('jwt');
                const headers = { "Content-Type": "application/json" };
                if (jwt) {
                    headers["Authorization"] = `Bearer ${jwt}`;
                }
                const response = yield fetch("http://localhost:3000/user", {
                    method: "GET",
                    credentials: "include",
                    headers
                });
                const data = yield response.json();
                if (data.loggedIn) {
                    const profileUsernameElem = document.getElementById("profileUsername");
                    if (profileUsernameElem) {
                        profileUsernameElem.textContent = data.username;
                    }
                    const profileEmailEl = document.getElementById("profileEmail");
                    if (profileEmailEl) {
                        profileEmailEl.textContent = data.email;
                        const avatarProfile = document.getElementById("profileAvatar");
                        if (avatarProfile && avatarProfile instanceof HTMLImageElement) {
                            avatarProfile.src = data.avatar;
                        }
                    }
                    switchView("profileViewDrop");
                }
                const historyRes = yield fetch("http://localhost:3000/AllHistory", {
                    method: "GET",
                    credentials: "include",
                    headers
                });
                const historyData = yield historyRes.json();
                if (!historyData.success) {
                    console.error("Could not load game history:", historyData.error);
                    return;
                }
                // Update Pong stats
                const pong = historyData.pong;
                if (pong) {
                    const wins = pong.wins;
                    const losses = pong.played - pong.wins;
                    document.getElementById("profileWins").textContent = wins.toString();
                    document.getElementById("profileLosses").textContent = losses.toString();
                }
                const row = historyData.row;
                if (row) {
                    const totalWins = row.YellowWins + row.RedWins;
                    let rank = "Bronze";
                    if (totalWins > 20)
                        rank = "Silver";
                    if (totalWins > 50)
                        rank = "Gold";
                    if (totalWins > 100)
                        rank = "Platinum";
                    document.getElementById("profileRank").textContent = rank;
                }
                // Finally show the profile view
                switchView("profileViewDrop");
            }
            catch (err) {
                console.error("Error loading profile:", err);
            }
        }));
    }
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const jwt = localStorage.getItem('jwt');
                const headers = { "Content-Type": "application/json" };
                if (jwt) {
                    headers["Authorization"] = `Bearer ${jwt}`;
                }
                yield fetch("http://localhost:3000/logout", {
                    method: "POST",
                    credentials: "include",
                    headers,
                    body: JSON.stringify({})
                });
            }
            catch (error) {
                console.error("Error fetching /logout:", error);
            }
            finally {
                localStorage.removeItem('jwt');
                switchView("loginView");
            }
        }));
    }
    const logoutBtnProfile = document.getElementById("logoutBtnProfile");
    if (logoutBtnProfile) {
        logoutBtnProfile.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const jwt = localStorage.getItem('jwt');
                const headers = { "Content-Type": "application/json" };
                if (jwt) {
                    headers["Authorization"] = `Bearer ${jwt}`;
                }
                yield fetch("http://localhost:3000/logout", {
                    method: "POST",
                    credentials: "include",
                    headers,
                    body: JSON.stringify({})
                });
            }
            catch (error) {
                console.error("Error fetching /logout:", error);
            }
            finally {
                localStorage.removeItem('jwt');
                switchView("loginView");
            }
        }));
    }
});
