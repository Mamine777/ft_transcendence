const form = document.getElementById("loginForm");
const messageDiv = document.getElementById("message"); 

document.getElementById("loginForm").addEventListener("submit", async (event) => {
	event.preventDefault();
  
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;
  
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