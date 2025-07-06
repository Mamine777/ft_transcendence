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
      (document.getElementById("email") as HTMLInputElement).value = "";
      (document.getElementById("password") as HTMLInputElement).value = "";
      (document.getElementById("loginMessage") as HTMLElement).innerText = "";

			switchView("loginView");

		});
	}
});