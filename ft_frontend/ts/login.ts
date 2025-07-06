export function switchView(targetViewId: string): void {
	const views = document.querySelectorAll(".view");
  
	views.forEach((view) => {
	  (view as HTMLElement).style.display = "none";
	});
  
	const targetView = document.getElementById(targetViewId);
	if (targetView) {
	  (targetView as HTMLElement).style.display = "block";
  
	  window.location.hash = `#${targetViewId}`;
	} else {
	  console.error(`View with ID "${targetViewId}" not found.`);
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
		const verifyMessage = document.getElementById("twoFAMessage") as HTMLParagraphElement;
		const code2fa = (document.getElementById("twoFACode") as HTMLInputElement).value;
	  
		try {
		  const response = await fetch("http://localhost:3000/verify-2fa", {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ code2fa })
		  });
	  
		  const data = await response.json();
		  localStorage.setItem('jwt', data);
		  if (data.success) {
			verifyMessage.textContent = data.message;
			verifyMessage.classList.remove("text-red-500");
			verifyMessage.classList.add("text-green-600");
			switchView("dashboardView"); // Navigate to the dashboard view
		  } else {
			verifyMessage.textContent = data.message;
			verifyMessage.classList.remove("text-green-600");
			verifyMessage.classList.add("text-red-500");
		  }
		} catch (error) {
		  console.error("Error during 2FA verification:", error);
		  verifyMessage.textContent = "An error occurred. Please try again.";
		  verifyMessage.classList.remove("text-green-600");
		  verifyMessage.classList.add("text-red-500");
		}
	});
	document.getElementById("forgotPasswordForm")?.addEventListener("submit", async (event) => {
		const messageDiv = document.getElementById("forgotMessage") as HTMLInputElement;
		const email = document.getElementById("forgotEmail") as HTMLInputElement;
		const secretKey = document.getElementById("secretKey") as HTMLInputElement;
		const newpassword = document.getElementById("newPassword") as HTMLInputElement;

		try {
			const response = await fetch("http://localhost:3000/check-forgot", {
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
	
			const data = await response.json();
			messageDiv.textContent = data.message;
	
	
		} catch (error) {
			messageDiv.textContent = "An error occurred. Please try again.";
		}
	});
	document.getElementById("signupView")?.addEventListener("submit", async (event) =>{
		const email = document.getElementById("email") as HTMLInputElement
		const password = document.getElementById("password") as HTMLInputElement;
		const username = document.getElementById("username") as HTMLInputElement;
		const messageDivsignUp = document.getElementById("signupMessage") as HTMLInputElement;

		try {
			const response = await fetch("http://localhost:3000/check-signup", {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					signupEmail: email.value,
					signupPassword: password.value,
					username: username.value
				  })
				  
			});
			const data = await response.json();
			if (data.success)
			{
				switchView("secretView");
				(document.getElementById("secretMessage")!).textContent = data.message;
				(document.getElementById("secretNote")!).textContent = data.importNote;
				(document.getElementById("secretPhrase")!).textContent = data.secretPhrase;
			}
			else
				messageDivsignUp.textContent = data.message;
		} catch (error) {
			messageDivsignUp.textContent = "An error occurred. Please try again.";
		}
	
	})
});