import { Dashboard } from './dashboard.ts';
import { Play } from './play.ts';
import { Friends } from './friends.ts';
// const form = document.getElementById("loginForm");
// const loginView = document.getElementById("loginView");
// const signupView = document.getElementById("signupView");
// const forgotPasswordView = document.getElementById("forgotPasswordView");
// const secretView = document.getElementById("secretView");

// document.getElementById("loginForm").addEventListener("submit", async (event) => {
// 	event.preventDefault();
  
// 	const email = document.getElementById("email").value;
// 	const password = document.getElementById("password").value;
// 	const messageDiv = document.getElementById("loginMessage");

// 	try {
// 	  const response = await fetch("/check", {
// 		method: "POST",
// 		headers: {
// 		  "Content-Type": "application/json"
// 		},
// 		credentials: "include",
// 		body: JSON.stringify({ email, password })
// 	  });
  
// 	  const data = await response.json(); 
// 	  messageDiv.textContent = data.message;
// 	  if (data.switch && data.switch === true)
// 	  {
// 		window.location.hash = "#dashboard";
// 		loginView.style.display = "none";
// 		dashboardView.style.display = "block";
// 	  }
  
// 	} catch (error) {
// 	  messageDiv.textContent = "An error occurred. Please try again.";
// 	}
//   });



// document.getElementById("signupForm").addEventListener("submit", async (event) => {
// 	event.preventDefault();

// 	const email = document.getElementById("signupEmail").value;
// 	const password = document.getElementById("signupPassword").value;
// 	const username = document.getElementById("username").value;
// 	const messageDivsignUp = document.getElementById("redirect");


// 	try {
// 		const response = await fetch("/check-signup", {
// 			method: "POST",
// 			headers: { "Content-Type": "application/json" },
// 			body: JSON.stringify({
// 				signupEmail: email,
// 				signupPassword: password,
// 				username: username
// 			})
// 		});
// 		const data = await response.json();
// 		if (data.success)
// 		{
// 			document.getElementById("signupView").style.display = "none";
// 			document.getElementById("secretMessage").textContent = data.message;
// 			document.getElementById("secretNote").textContent = data.importantNote;
// 			document.getElementById("secretPhrase").textContent = data.secret;
// 			document.getElementById("secretView").style.display = "block";	
// 			let countdown = 120;
// 			messageDivsignUp.textContent = `User registered successfully! Redirecting in ${countdown} seconds...`;
// 			const timing = setInterval(() =>{
// 				countdown--;
// 				if (countdown > 0)
// 					messageDivsignUp.textContent = `User registered successfully! Redirecting in ${countdown} seconds...`;
// 				else
// 				{
// 					clearInterval(timing);
// 					secretView.style.display = "none";
// 					loginView.style.display = "block";
// 				}
// 			}, 1000);
			
// 		}
// 		else
// 			messageDivsignUp.textContent = data.message;
// 	} catch (error) {
// 		messageDivsignUp.textContent = "An error occurred. Please try again.";
// 	}
// });


// document.getElementById("forgotPasswordForm").addEventListener("submit", async (event) => {
// 	event.preventDefault();

// 	const messageDiv = document.getElementById("forgotMessage");
// 	const email = document.getElementById("forgotEmail").value;
// 	const secretKey = document.getElementById("secretKey").value;
// 	const newpassword = document.getElementById("newPassword").value;

// 	try {
// 		const response = await fetch("/check-forgot", {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json"
// 			},
// 			body: JSON.stringify({ email, secretKey, newpassword })
// 		});

// 		const data = await response.json();
// 		messageDiv.textContent = data.message;


// 	} catch (error) {
// 		messageDiv.textContent = "An error occurred. Please try again.";
// 	}
// });


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


function render(): string{
	console.log("Login script initialized");
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
		<button id="goToForgotPassword" class="text-blue-600 hover:underline">forgot password</button>
		</p>
		</div>
		`
	};
	
// document.addEventListener("DOMContentLoaded", () => {
// 	init();
// 	const main = document.getElementById("main-content");
// 	if (!main) return ;
// 	main.innerHTML = render();
//     switch (window.location.hash) {
// 		case "#dashboard":
// 			console.log("Dashboard view");
// 			const dashboard = new Dashboard();
//             main.innerHTML = dashboard.render();
// 			dashboard.attachEvents();
//             break;
// 		case "#play":
// 			console.log("Play view");
// 			const play = new Play();
// 			main.innerHTML = play.render();
// 			break;
// 		default:
// 			main.innerHTML = render();
// 	}
// 	console.log(window.location.hash);
// });

function updateView() {
    const main = document.getElementById("main-content");
    if (!main) return;
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
        default:
            main.innerHTML = render();
    }
}

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    init();
    updateView();
});

// Mise à jour à chaque changement de hash
window.addEventListener("hashchange", updateView);

// document.addEventListener("DOMContentLoaded", () => {
//     init();
//     const main = document.getElementById("main-content");
//     if (!main) return;
//     main.innerHTML = render();

//     const loginForm = document.getElementById("loginForm") as HTMLFormElement | null;
//     const loginView = document.getElementById("loginView") as HTMLElement | null;
//     const dashboardView = document.getElementById("dashboardView") as HTMLElement | null;
//     if (loginForm && loginView) {
//         loginForm.addEventListener("submit", async (event: Event) => {
//             event.preventDefault();
//             const emailInput = document.getElementById("email") as HTMLInputElement | null;
//             const passwordInput = document.getElementById("password") as HTMLInputElement | null;
//             const messageDiv = document.getElementById("loginMessage") as HTMLElement | null;
//             if (!emailInput || !passwordInput || !messageDiv) return;
//             const email = emailInput.value;
//             const password = passwordInput.value;
//             try {
//                 const response = await fetch("/check", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     credentials: "include",
//                     body: JSON.stringify({ email, password })
//                 });
//                 const data = await response.json();
//                 messageDiv.textContent = data.message;
//                 if (data.switch && data.switch === true && dashboardView) {
//                     window.location.hash = "#dashboard";
//                     loginView.style.display = "none";
//                     dashboardView.style.display = "block";
//                 }
//             } catch (error) {
//                 messageDiv.textContent = "An error occurred. Please try again.";
//             }
//         });
//     }

//     // Signup form
//     const signupForm = document.getElementById("signupForm") as HTMLFormElement | null;
//     if (signupForm) {
//         signupForm.addEventListener("submit", async (event: Event) => {
//             event.preventDefault();
//             const emailInput = document.getElementById("signupEmail") as HTMLInputElement | null;
//             const passwordInput = document.getElementById("signupPassword") as HTMLInputElement | null;
//             const usernameInput = document.getElementById("username") as HTMLInputElement | null;
//             const messageDivsignUp = document.getElementById("redirect") as HTMLElement | null;
//             const signupView = document.getElementById("signupView") as HTMLElement | null;
//             const secretView = document.getElementById("secretView") as HTMLElement | null;
//             if (!emailInput || !passwordInput || !usernameInput || !messageDivsignUp || !signupView || !secretView) return;
//             const email = emailInput.value;
//             const password = passwordInput.value;
//             const username = usernameInput.value;
//             try {
//                 const response = await fetch("/check-signup", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ signupEmail: email, signupPassword: password, username })
//                 });
//                 const data = await response.json();
//                 if (data.success) {
//                     signupView.style.display = "none";
//                     (document.getElementById("secretMessage") as HTMLElement).textContent = data.message;
//                     (document.getElementById("secretNote") as HTMLElement).textContent = data.importantNote;
//                     (document.getElementById("secretPhrase") as HTMLElement).textContent = data.secret;
//                     secretView.style.display = "block";
//                     let countdown = 120;
//                     messageDivsignUp.textContent = `User registered successfully! Redirecting in ${countdown} seconds...`;
//                     const timing = setInterval(() => {
//                         countdown--;
//                         if (countdown > 0)
//                             messageDivsignUp.textContent = `User registered successfully! Redirecting in ${countdown} seconds...`;
//                         else {
//                             clearInterval(timing);
//                             secretView.style.display = "none";
//                             loginView.style.display = "block";
//                         }
//                     }, 1000);
//                 } else {
//                     messageDivsignUp.textContent = data.message;
//                 }
//             } catch (error) {
//                 messageDivsignUp.textContent = "An error occurred. Please try again.";
//             }
//         });
//     }

//     // Forgot password form
//     const forgotPasswordForm = document.getElementById("forgotPasswordForm") as HTMLFormElement | null;
//     if (forgotPasswordForm) {
//         forgotPasswordForm.addEventListener("submit", async (event: Event) => {
//             event.preventDefault();
//             const messageDiv = document.getElementById("forgotMessage") as HTMLElement | null;
//             const emailInput = document.getElementById("forgotEmail") as HTMLInputElement | null;
//             const secretKeyInput = document.getElementById("secretKey") as HTMLInputElement | null;
//             const newPasswordInput = document.getElementById("newPassword") as HTMLInputElement | null;
//             if (!messageDiv || !emailInput || !secretKeyInput || !newPasswordInput) return;
//             const email = emailInput.value;
//             const secretKey = secretKeyInput.value;
//             const newpassword = newPasswordInput.value;
//             try {
//                 const response = await fetch("/check-forgot", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ email, secretKey, newpassword })
//                 });
//                 const data = await response.json();
//                 messageDiv.textContent = data.message;
//             } catch (error) {
//                 messageDiv.textContent = "An error occurred. Please try again.";
//             }
//         });
//     }
// });