import { Dashboard } from './dashboard.ts';
import { Play } from './play.ts';
import { Friends } from './friends.ts';
import { Profile } from './Profile.ts';
function init() {
	document.body.innerHTML = `
	
	<header class="mb-10 text-top">
	<h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-wide text-white drop-shadow-lg">
	🏓 ft_transcendence
	</h1>
	<p class="mt-2 text-lg text-purple-200">The Ultimate Ping Pong Showdown</p>
	</header>
	
	<main id="main-content" class="pt-16 container mx-auto px-4 py-8 flex-grow"> </main>
	`;
}

function renderSignup(): string {
    return `
        <div id="signupView" class="view active bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-gray-800">
            <h2 class="text-2xl font-bold mb-4 text-center">Sign Up</h2>
            <form id="signupForm" method="POST" class="flex flex-col gap-3">
                <input type="text" id="username" placeholder="Username" required class="p-2 border rounded" />
                <input type="email" id="signupEmail" placeholder="Email" required class="p-2 border rounded" />
                <input type="password" id="signupPassword" placeholder="Password" required class="p-2 border rounded" />
                <button type="submit" class="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">Register</button>
            </form>
            <p id="signupMessage" class="message text-sm text-red-500 text-center mt-2"></p>
            <div id="secretView" style="display:none; margin-top:1em;">
                <div id="secretMessage" class="text-green-700 font-bold"></div>
                <div id="secretNote" class="text-gray-700"></div>
                <div id="secretPhrase" class="text-blue-700 font-mono break-all"></div>
            </div>
            <p class="text-center mt-4">Already have an account?
                <button id="goToLogin" class="text-blue-600 hover:underline">Log In</button>
            </p>
        </div>
    `;
}

function renderforgotPassword(): string{
    return `
        <div id="forgotPasswordView" class="view active bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-gray-800">
        <h2 class="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        <form id="forgotPasswordForm" method="POST" class="flex flex-col gap-3">
            <input type="email" id="forgotEmail" placeholder="Your Email" required class="p-2 border rounded" />
            <input type="text" id="secretKey" placeholder="Enter Your Secret Key" required class="p-2 border rounded" />
            <input type="password" id="newPassword" placeholder="New Password" required class="p-2 border rounded" />
            <p id="forgotMessage" class="message text-sm text-red-500 text-center mt-2"></p>

            <button type="submit" class="bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 transition">Reset Password</button>
            <p class="text-center mt-4">Already have an account?
            <button id="goToLogin" class="text-blue-600 hover:underline">Log In</button>
            </p>
        </form>
        </div>
        `;
}

function render(): string{
	return `
	<div id="loginView" class="view active bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-gray-800">
	<h2 class="text-2xl font-bold mb-4 text-center">Login</h2>
	<form id="loginForm" method="POST" class="flex flex-col gap-3">
	<input type="email" id="email" placeholder="Email" required class="p-2 border rounded" />
	<input type="password" id="password" placeholder="Password" required class="p-2 border rounded" />
	<button type="submit" class="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Login</button>
	</form>
	<p id="loginMessage" class="message text-sm text-red-500 text-center mt-2"></p>
	<p class="text-center mt-4">Don't have an account?
	<button id="goToSignup" class="text-blue-600 hover:underline">Sign Up</button>
	</p>
	<p class="text-center mt-4">Dont remember The Password ?
	<button id="passwordBtn" class="text-blue-600 hover:underline">forgot password</button>
	</p>
	</div>
		`;
}

function attachFormEvents() {
    // const forgotBTn = document.getElementById("passwordBtn") as HTMLButtonElement | null;
    const goToLoginBtn = document.getElementById("goToLogin") as HTMLButtonElement | null;
    const signupBtn = document.getElementById("goToSignup") as HTMLButtonElement | null;
    if (signupBtn) {
        signupBtn.addEventListener("click", () => {
            console.log("Go to signup button clicked");
            window.location.hash = "#signup";
        });
    }
    if (goToLoginBtn) {
        goToLoginBtn.addEventListener("click", () => {
            console.log("Go to login button clicked");
            window.location.hash = "";
        });
    }
    // if (forgotBTn) {
    //     forgotBTn.addEventListener("click", () => {
    //         console.log("Forgot password button clicked");
    //         window.location.hash = "#forgotpassword";
    //     });
    // }
    const signupForm = document.getElementById("signupForm") as HTMLFormElement | null;
    // const forgotPasswordForm = document.getElementById("forgotPasswordForm") as HTMLFormElement | null;
    // const forgotPasswordView = document.getElementById("forgotPasswordView") as HTMLElement | null;
    const loginForm = document.getElementById("loginForm") as HTMLFormElement | null;
    const loginView = document.getElementById("loginView") as HTMLElement | null; 
    if (loginForm && loginView) {
        loginForm.addEventListener("submit", async (event: Event) => {
            event.preventDefault();
            const emailInput = document.getElementById("email") as HTMLInputElement | null;
            const passwordInput = document.getElementById("password") as HTMLInputElement | null;
            const messageDiv = document.getElementById("loginMessage") as HTMLElement | null;
            if (!emailInput || !passwordInput || !messageDiv) return;
            const email = emailInput.value;
            const password = passwordInput.value;
            try {
                const response = await fetch("http://localhost:3000/check", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                messageDiv.textContent = data.message;
                if (data.switch && data.switch === true) {
                    window.location.hash = "#dashboard";
                }
            } catch (error) {
                messageDiv.textContent = "An error occurred. Please try again.";
            }
        });
    }
   if (signupForm) {
    signupForm.addEventListener("submit", async (event: Event) => {
        event.preventDefault();
        const emailInput = document.getElementById("signupEmail") as HTMLInputElement | null;
        const passwordInput = document.getElementById("signupPassword") as HTMLInputElement | null;
        const usernameInput = document.getElementById("username") as HTMLInputElement | null;
        const messageDivsignUp = document.getElementById("signupMessage") as HTMLElement | null; // <-- correction ici
        const signupView = document.getElementById("signupView") as HTMLElement | null;
        // const secretView = document.getElementById("secretView") as HTMLElement | null;
        if (!emailInput || !passwordInput || !usernameInput || !messageDivsignUp || !signupView /*|| !secretView*/) return;
            const email = emailInput.value;
            const password = passwordInput.value;
            const username = usernameInput.value;
            try {
                const response = await fetch("http://localhost:3000/check-signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ signupEmail: email, signupPassword: password, username })
                });
                const data = await response.json();
                if (data.success) {
                    (document.getElementById("secretMessage") as HTMLElement).textContent = data.message;
                    (document.getElementById("secretNote") as HTMLElement).textContent = data.importantNote;
                    (document.getElementById("secretPhrase") as HTMLElement).textContent = data.secret;
                    (document.getElementById("secretView") as HTMLElement).style.display = "block";
                    let countdown = 120;
                    messageDivsignUp.textContent = `User registered successfully! Redirecting in ${countdown} seconds...`;
                    const timing = setInterval(() => {
                        countdown--;
                        if (countdown > 0)
                            messageDivsignUp.textContent = `User registered successfully! Redirecting in ${countdown} seconds...`;
                        else {
                            clearInterval(timing);
                        }
                    }, 1000);
                    // window.location.hash = "#login";
                } else {
                    messageDivsignUp.textContent = data.message;
                }
            } catch (error) {
                messageDivsignUp.textContent = "An error occurred. Please try again.";
            }
        });
        // if (forgotPasswordForm) {
        //     forgotPasswordForm.addEventListener("submit", async (event: Event) => {
        //     event.preventDefault();
        //     const messageDiv = document.getElementById("forgotMessage") as HTMLElement | null;
        //     const emailInput = document.getElementById("forgotEmail") as HTMLInputElement | null;
        //     const secretKeyInput = document.getElementById("secretKey") as HTMLInputElement | null;
        //     const newPasswordInput = document.getElementById("newPassword") as HTMLInputElement | null;
        //     if (!messageDiv || !emailInput || !secretKeyInput || !newPasswordInput) return;
        //     const email = emailInput.value;
        //     const secretKey = secretKeyInput.value;
        //     const newpassword = newPasswordInput.value;
        //     try {
        //         const response = await fetch("http://localhost:3000/check-forgot", {
        //             method: "POST",
        //             headers: { "Content-Type": "application/json" },
        //             body: JSON.stringify({ email, secretKey, newpassword })
        //         });
        //         const data = await response.json();
        //         messageDiv.textContent = data.message;
        //     } catch (error) {
        //         messageDiv.textContent = "An error occurred. Please try again.";
        //     }
        // });
        // }
    }
}

async function checkAuth(): Promise<boolean> {
    try {
        const response = await fetch("http://localhost:3000/me", {
            credentials: "include"
        });
        if (!response.ok) return false;
        const data = await response.json();
        return data.loggedIn === true;
    } catch {
        return false;
    }
}

async function updateView() {
    const main = document.getElementById("main-content");
    if (!main) return;
    const isLogged = await checkAuth();
    if (isLogged) {
        switch (window.location.hash) {
            case "#dashboard":
                const dashboard = new Dashboard();
                main.innerHTML = dashboard.render();
                dashboard.attachEvents();
                break;
            case "#play":
                const play = new Play();
                main.innerHTML = play.render();
                play.attachEvents(); // si besoin
                break;
            case "#friends":
                const friends = new Friends();
                main.innerHTML = friends.render();
                friends.attachEvents();
                break;
            case "#addfriends":
                const addfriends = new Friends();
                main.innerHTML = addfriends.renderAddFriend();
                addfriends.attachEvents();
                break;
            case "#listfriends":
                const listfriends = new Friends();
                main.innerHTML = listfriends.renderListFriends();
                listfriends.attachEvents();
                break;
            case "#removefriends":
                const removefriends = new Friends();
                main.innerHTML = removefriends.renderRemoveFriends();	
                removefriends.attachEvents();
                break;
            case "#request":
                const request = new Friends();
                main.innerHTML = request.renderRequest();
                request.attachEvents();
                break;
            case "#settings":
                const profileSettings = new Profile();
                main.innerHTML = profileSettings.renderSettings();
                profileSettings.attachEvents();
                break;
            case "#profile":
                const profile = new Profile();
                main.innerHTML = profile.render();
                profile.attachEvents();
                break ;
        }
    }
    else
    {
        switch (window.location.hash) {
            case "#signup":
                main.innerHTML = renderSignup();
                break;
            case "#forgotpassword":
                main.innerHTML = renderforgotPassword();
                break;
            case "#login":
                main.innerHTML = render();
                break;
            default:
                main.innerHTML = render();
        }
    }    
    attachFormEvents();
}

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    init();
    updateView();
});

window.addEventListener("hashchange", updateView);
// Mise à jour à chaque changement de hash
