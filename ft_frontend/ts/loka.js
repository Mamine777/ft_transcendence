const form = document.getElementById("loginForm");
const loginView = document.getElementById("loginView");
const signupView = document.getElementById("signupView");

const forgotPasswordView = document.getElementById("forgotPasswordView");
const secretView = document.getElementById("secretView");
const	verify2faContianer =  document.getElementById("verify-2fa-container");




document.getElementById("goToForgotPassword").onclick = () => {
	window.location.hash = "#forgot"
	loginView.style.display = "none";
	forgotPasswordView.style.display = "block"
};

document.getElementById("continueToLogin").onclick = () => {
	secretView.style.display = "none";
	loginView.style.display = "block";

};
document.getElementById("backtoLogin").onclick = () => {
	forgotPasswordView.style.display = "none";
	loginView.style.display = "block";

};


document.getElementById("goToSignup").onclick = () => {
	loginView.style.display = "none";
	signupView.style.display = "block";
}

document.getElementById("goToLogin").onclick = () => {
	signupView.style.display = "none";
	loginView.style.display = "block";
  };

document.getElementById("loginForm").addEventListener("submit", async (event) => {
	event.preventDefault();
  
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;
	const messageDiv = document.getElementById("loginMessage");

	try {
	  const response = await fetch("/check", {
		method: "POST",
		headers: {
		  "Content-Type": "application/json"
		},
		credentials: "include",
		body: JSON.stringify({ email, password })
	  });
  
	  const data = await response.json(); 
	  messageDiv.textContent = data.message;
	  if (data.switch && data.switch === true)
	  {
		window.location.hash = "#2fa";
		loginView.style.display = "none";
		verify2faContianer.style.display = "block";
	  }
  
	} catch (error) {
	  messageDiv.textContent = "An error occurred. Please try again.";
	}
  });



document.getElementById("signupForm").addEventListener("submit", async (event) => {
	event.preventDefault();

	const email = document.getElementById("signupEmail").value;
	const password = document.getElementById("signupPassword").value;
	const username = document.getElementById("username").value;
	const messageDivsignUp = document.getElementById("redirect");


	try {
		const response = await fetch("/check-signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				signupEmail: email,
				signupPassword: password,
				username: username
			})
		});
		const data = await response.json();
		if (data.success)
		{
			document.getElementById("signupView").style.display = "none";
			document.getElementById("secretMessage").textContent = data.message;
			document.getElementById("secretNote").textContent = data.importantNote;
			document.getElementById("secretPhrase").textContent = data.secret;
			document.getElementById("secretView").style.display = "block";	
			let countdown = 120;
			messageDivsignUp.textContent = `User registered successfully! Redirecting in ${countdown} seconds...`;
			const timing = setInterval(() =>{
				countdown--;
				if (countdown > 0)
					messageDivsignUp.textContent = `User registered successfully! Redirecting in ${countdown} seconds...`;
				else
				{
					clearInterval(timing);
					secretView.style.display = "none";
					loginView.style.display = "block";
				}
			}, 1000);
			
		}
		else
			messageDivsignUp.textContent = data.message;
	} catch (error) {
		messageDivsignUp.textContent = "An error occurred. Please try again.";
	}
});


document.getElementById("forgotPasswordForm").addEventListener("submit", async (event) => {
	event.preventDefault();

	const messageDiv = document.getElementById("forgotMessage");
	const email = document.getElementById("forgotEmail").value;
	const secretKey = document.getElementById("secretKey").value;
	const newpassword = document.getElementById("newPassword").value;

	try {
		const response = await fetch("/check-forgot", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ email, secretKey, newpassword })
		});

		const data = await response.json();
		messageDiv.textContent = data.message;


	} catch (error) {
		messageDiv.textContent = "An error occurred. Please try again.";
	}
});
