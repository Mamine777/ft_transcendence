var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function switchView(targetViewId) {
    const views = document.querySelectorAll(".view");
    views.forEach((view) => {
        view.style.display = "none";
    });
    const targetView = document.getElementById(targetViewId);
    if (targetView) {
        targetView.style.display = "block";
        window.location.hash = `#${targetViewId}`;
    }
    else {
        console.error(`View with ID "${targetViewId}" not found.`);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    var _a, _b, _c, _d;
    (_a = document.getElementById("loginForm")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        const email = document.getElementById("email");
        const password = document.getElementById("password");
        const message = document.getElementById("loginMessage");
        try {
            const response = yield fetch("http://localhost:3000/login-check", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ email: email.value, password: password.value })
            });
            const data = yield response.json();
            message.textContent = data.message;
            if (data.switch && data.switch === true) {
                switchView("twoFAView");
            }
        }
        catch (error) {
            message.textContent = `Error: ${error}`;
        }
    }));
    (_b = document.getElementById("twoFAForm")) === null || _b === void 0 ? void 0 : _b.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        const verifyMessage = document.getElementById("twoFAMessage");
        const code2fa = document.getElementById("twoFACode").value;
        try {
            const response = yield fetch("http://localhost:3000/verify-2fa", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code2fa })
            });
            const data = yield response.json();
            localStorage.setItem('jwt', data);
            if (data.success) {
                verifyMessage.textContent = data.message;
                verifyMessage.classList.remove("text-red-500");
                verifyMessage.classList.add("text-green-600");
                switchView("dashboardView"); // Navigate to the dashboard view
            }
            else {
                verifyMessage.textContent = data.message;
                verifyMessage.classList.remove("text-green-600");
                verifyMessage.classList.add("text-red-500");
            }
        }
        catch (error) {
            console.error("Error during 2FA verification:", error);
            verifyMessage.textContent = "An error occurred. Please try again.";
            verifyMessage.classList.remove("text-green-600");
            verifyMessage.classList.add("text-red-500");
        }
    }));
    (_c = document.getElementById("forgotPasswordForm")) === null || _c === void 0 ? void 0 : _c.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
        const messageDiv = document.getElementById("forgotMessage");
        const email = document.getElementById("forgotEmail");
        const secretKey = document.getElementById("secretKey");
        const newpassword = document.getElementById("newPassword");
        try {
            const response = yield fetch("http://localhost:3000/check-forgot", {
                method: "POST",
                headers: {
                    credentials: "include",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email.value,
                    secretKey: secretKey.value,
                    newpassword: newpassword.value
                })
            });
            const data = yield response.json();
            messageDiv.textContent = data.message;
        }
        catch (error) {
            messageDiv.textContent = "An error occurred. Please try again.";
        }
    }));
    (_d = document.getElementById("signupView")) === null || _d === void 0 ? void 0 : _d.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
        const email = document.getElementById("email");
        const password = document.getElementById("password");
        const username = document.getElementById("username");
        const messageDivsignUp = document.getElementById("signupMessage");
        try {
            const response = yield fetch("http://localhost:3000/check-signup", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    signupEmail: email.value,
                    signupPassword: password.value,
                    username: username.value
                })
            });
            const data = yield response.json();
            if (data.success) {
                switchView("secretView");
                (document.getElementById("secretMessage")).textContent = data.message;
                (document.getElementById("secretNote")).textContent = data.importNote;
                (document.getElementById("secretPhrase")).textContent = data.secretPhrase;
            }
            else
                messageDivsignUp.textContent = data.message;
        }
        catch (error) {
            messageDivsignUp.textContent = "An error occurred. Please try again.";
        }
    }));
});
