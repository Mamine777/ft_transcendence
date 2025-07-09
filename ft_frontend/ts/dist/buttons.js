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
    // Event listener for "Continue to Login" button in the Secret Phrase view
    const continueToLogin = document.getElementById("continueToLogin");
    if (continueToLogin) {
        continueToLogin.addEventListener("click", () => {
            switchView("loginView");
        });
    }
    // Event listener for "Logout" button in the Dashboard view
    const logoutBtnDropdown = document.getElementById("logoutBtnDropdown");
    if (logoutBtnDropdown) {
        logoutBtnDropdown.addEventListener("click", () => {
            switchView("loginView");
        });
    }
    const cancelTwoFABtn = document.getElementById("cancelTwoFABtn");
    if (cancelTwoFABtn) {
        cancelTwoFABtn.addEventListener("click", () => {
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
            document.getElementById("loginMessage").innerText = "";
            switchView("loginView");
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
    const profileBtn = document.getElementById("profileBtn");
    if (profileBtn) {
        profileBtn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const response = yield fetch("http://localhost:3000/user", {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" }
                });
                const data = yield response.json();
                if (data.loggedIn) {
                    const profileUsernameElem = document.getElementById("profileUsername");
                    if (profileUsernameElem) {
                        profileUsernameElem.textContent = data.username;
                    }
                    const profileEmailEl = document.getElementById("profileEmail");
                    if (profileUsernameElem && profileEmailEl)
                        profileEmailEl.textContent = data.email;
                    switchView("profileViewDrop");
                }
            }
            catch (error) {
                console.error("Error fetching /user:", error);
            }
        }));
    }
});
