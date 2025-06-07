const form = document.getElementById("loginForm");
const loginView = document.getElementById("loginView");
const signupView = document.getElementById("signupView");
const dashboardView = document.getElementById("dashboardView");

document.getElementById("goToSignup").onclick = () => {
	loginView.style.display = "none";
	signupView.style.display = "block";
}

document.getElementById("goToLogin").onclick = () => {
	signupView.style.display = "none";
	loginView.style.display = "block";
  };

  document.getElementById("logoutBtn").onclick = () => {
	dashboardView.style.display = "none";
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
		body: JSON.stringify({ email, password })
	  });
  
	  const data = await response.json(); 
	  messageDiv.textContent = data.message;
  
	} catch (error) {
	  messageDiv.textContent = "An error occurred. Please try again.";
	}
  });

document.getElementById("signupForm").addEventListener("submit", async (event) => {
	event.preventDefault();

	const email = document.getElementById("signupEmail").value;
	const password = document.getElementById("signupPassword").value;
	const username = document.getElementById("username").value;
	const messageDivsignUp = document.getElementById("signupMessage");


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
			let countdown = 3;
			messageDivsignUp.textContent = `User registered successfully! Redirecting in ${countdown} seconds...`;
			const timing = setInterval(() =>{
				countdown--;
				if (countdown > 0)
					messageDivsignUp.textContent = `User registered successfully! Redirecting in ${countdown} seconds...`;
				else
				{
					clearInterval(timing);
					signupView.style.display = "none";
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
