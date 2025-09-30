import {loadProfile} from "./coockies"


document.getElementById("settingsForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const Newemail = document.getElementById("newEmail") as HTMLInputElement;
  const Newpassword = document.getElementById("newPasswordSettings") as HTMLInputElement;
  const Newmessage = document.getElementById("settingsMessage") as HTMLElement;
  const NewUsername = document.getElementById("newUsername") as HTMLInputElement;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const jwt = localStorage.getItem("jwt");
  if (jwt) {
    headers["Authorization"] = `Bearer ${jwt}`;
  }

  try {
    await loadProfile();
    const response = await fetch("https://localhost:3000/check-settings", {
      method: "POST",
      			headers: { 
			'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
			"Content-Type": "application/json" 
			},
      credentials: "include",
      body: JSON.stringify({
        newUsername: NewUsername.value,
        newEmail: Newemail.value,
        newPassword: Newpassword.value,
      }),
    });

    const data = await response.json();

    if (Newmessage) {
    loadProfile()
      if (!response.ok) {
        Newmessage.textContent = ` ${data.message || "Something went wrong"}`;
      } else {
        Newmessage.textContent = `${data.message}`;
      }
    }
  } catch (error) {
    if (Newmessage) {
      Newmessage.textContent = `❌ Error: ${error}`;
    }
  }
});

document.getElementById("avatarUpload")?.addEventListener("change", (event) => {
  event.preventDefault()
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  const preview = document.getElementById("customAvatarPreview") as HTMLImageElement;
  if (file && preview) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target?.result as string;
      preview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById("avatarUpload")?.addEventListener("change", (event) => {
  event.preventDefault();
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  const preview = document.getElementById("customAvatarPreview") as HTMLImageElement;

  if (file && preview) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target?.result as string;
      preview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById("avatarUpload")?.addEventListener("change", async (event) => {
  event.preventDefault();
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  const jwt = localStorage.getItem("jwt");
  const headers: HeadersInit = {};
  if (jwt) {
    headers["Authorization"] = `Bearer ${jwt}`;
  }
  
  try {
    const response = await fetch("https://localhost:3000/uploadFile", {
      method: "POST",
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
			},
      credentials: "include",
      body: formData,
    });
    
    const data = await response.json();
    
    if (data.success && data.avatar) {
      const preview = document.getElementById("customAvatarPreview") as HTMLImageElement;
      if (preview) {
        preview.src = data.avatar;
        preview.classList.remove("hidden");
      }
      alert("✅ Avatar uploaded successfully!");
    } else {
      alert(data.message || "❌ Upload failed");
    }
  } catch (error) {
    alert("❌ Error uploading avatar: " + error);
  }
});

