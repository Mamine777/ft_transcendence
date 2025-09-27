import { views } from "./coockies"
import { addPlayerbase } from "./tournament";
import { exportPongHistory } from "./buttons";

export function switchView(viewKey: string): void {
  Object.values(views).forEach((view) => {
    if (view) view.style.display = "none";
  });

	const targetView = views[viewKey];
	if (targetView) {
		targetView.style.display = "block";
		window.location.hash = `#${viewKey}`;
	} else {                                                                                                                                        
		console.error(`View "${viewKey}" not found.`);
	}
	if (viewKey === "TournamentView")
	{
		addPlayerbase();
	}
}
document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("loginForm")?.addEventListener("submit", async (event) => {
		event.preventDefault();
		const email = document.getElementById("email") as HTMLInputElement;
		const password = document.getElementById("password") as HTMLInputElement;
		const message = document.getElementById("loginMessage") as HTMLTextAreaElement;
		try {
			const response = await fetch("http://localhost:3000/login-check", {
				method: "POST",
			headers: { 
			'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
			"Content-Type": "application/json" 
			},
				credentials: "include",
				body: JSON.stringify({ email: email.value, password: password.value })
			  });
			  const data = await response.json();
			  message.textContent = data.message;
			  if (data.switch && data.switch === true)
			  {
				switchView("twoFAView");
			  }
		} catch (error) {
			message.textContent = `Error: ${error}`;
		}
	});
	document.getElementById("twoFAForm")?.addEventListener("submit", async (event) => {
		event.preventDefault();
		const verifyMessage = document.getElementById("twoFAMessage") as HTMLParagraphElement | null;
		const code2fa = (document.getElementById("twoFACode") as HTMLInputElement).value;
	  
		if (!verifyMessage) {
			console.error('Element with id "twoFAMessage" not found.');
			return;
		}

		try {
		  const response = await fetch("http://localhost:3000/verify-2fa", {
			method: "POST",
			credentials: "include",
			headers: { 
			'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
			"Content-Type": "application/json" 
			},
			body: JSON.stringify({ code2fa })
		  });
	  
		  const data = await response.json();
		  if (data.success) {
			localStorage.setItem('jwt', data.token);
			verifyMessage.textContent = data.message;
			verifyMessage.classList.remove("text-red-500");
			verifyMessage.classList.add("text-green-600");
			switchView("dashboardView");
		  } else {
			verifyMessage.textContent = data.message;
			verifyMessage.classList.remove("text-green-600");
			verifyMessage.classList.add("text-red-500");
		  }
		} catch (error) {
		  console.error("Error during 2FA verification:", error);
		}
	});
	document.getElementById("forgotPasswordForm")?.addEventListener("submit", async (event) => {
		event.preventDefault();
		const messageDiv = document.getElementById("forgotMessage") as  HTMLElement;
		const email = document.getElementById("forgotEmail") as HTMLInputElement;
		const secretKey = document.getElementById("secretKey") as HTMLInputElement;
		const newpassword = document.getElementById("newPassword") as HTMLInputElement;

		try {
			const response = await fetch("http://localhost:3000/check-forgot", {
				method: "POST",
				credentials: "include",
				headers: { 
				'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
				"Content-Type": "application/json" 
				},
				body: JSON.stringify({ 
					email: email.value, 
					secretKey: secretKey.value, 
					newpassword: newpassword.value 
				  })
				  
			});
	
			const data = await response.json();
			messageDiv.textContent = data.message;
	
	
		} catch (error) {
			messageDiv.textContent = "An error occurred. Please try again.";
		}
	});
	document.getElementById("signupForm")?.addEventListener("submit", async (event) => {
	event.preventDefault();

	const email = document.getElementById("signupEmail") as HTMLInputElement;
	const password = document.getElementById("signupPassword") as HTMLInputElement;
	const username = document.getElementById("username") as HTMLInputElement;
	const messageDivSignUp = document.getElementById("signupMessage") as HTMLElement;
	const secretPhrase = document.getElementById("secretPhrase") as HTMLElement;

	messageDivSignUp.textContent = "";
	
	if (!email.value || !password.value || !username.value) {
		messageDivSignUp.textContent = "Please fill out all fields.";
		return;
	}

	try {
		const response = await fetch("http://localhost:3000/check-signup", {
		method: "POST",
		credentials: "include",
		headers: { 
			'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
			"Content-Type": "application/json" 
			},
		body: JSON.stringify({
			signupEmail: email.value,
			signupPassword: password.value,
			username: username.value
		})
		});

		const data = await response.json();

		if (data.success) {
		switchView("secretView");

		const secretMessage = document.getElementById("secretMessage");
		const secretNote = document.getElementById("secretNote");

		if (secretMessage) secretMessage.textContent = data.message || "Registration successful.";
		if (secretNote) secretNote.textContent = data.importNote || "Save this recovery key securely.";
		if (secretPhrase) secretPhrase.textContent = data.secret || "No secret provided.";
		} else {
		messageDivSignUp.textContent = data.message || "Registration failed.";
		}
	} catch (error) {
		messageDivSignUp.textContent = "An error occurred. Please try again.";
		console.error(error);
	}
	});	
});