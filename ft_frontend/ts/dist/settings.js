var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c, _d;
import { loadProfile } from "./coockies";
(_a = document.getElementById("settingsForm")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    const Newemail = document.getElementById("newEmail");
    const Newpassword = document.getElementById("newPasswordSettings");
    const Newmessage = document.getElementById("settingsMessage");
    const NewUsername = document.getElementById("newUsername");
    const headers = {
        "Content-Type": "application/json",
    };
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
        headers["Authorization"] = `Bearer ${jwt}`;
    }
    try {
        yield loadProfile();
        const response = yield fetch("http://localhost:3000/check-settings", {
            method: "POST",
            headers,
            credentials: "include",
            body: JSON.stringify({
                newUsername: NewUsername.value,
                newEmail: Newemail.value,
                newPassword: Newpassword.value,
            }),
        });
        const data = yield response.json();
        if (Newmessage) {
            loadProfile();
            if (!response.ok) {
                Newmessage.textContent = ` ${data.message || "Something went wrong"}`;
            }
            else {
                Newmessage.textContent = `${data.message}`;
            }
        }
    }
    catch (error) {
        if (Newmessage) {
            Newmessage.textContent = `❌ Error: ${error}`;
        }
    }
}));
(_b = document.getElementById("avatarUpload")) === null || _b === void 0 ? void 0 : _b.addEventListener("change", (event) => {
    var _a;
    event.preventDefault();
    const input = event.target;
    const file = (_a = input.files) === null || _a === void 0 ? void 0 : _a[0];
    const preview = document.getElementById("customAvatarPreview");
    if (file && preview) {
        const reader = new FileReader();
        reader.onload = (e) => {
            var _a;
            preview.src = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            preview.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
    }
});
(_c = document.getElementById("avatarUpload")) === null || _c === void 0 ? void 0 : _c.addEventListener("change", (event) => {
    var _a;
    event.preventDefault();
    const input = event.target;
    const file = (_a = input.files) === null || _a === void 0 ? void 0 : _a[0];
    const preview = document.getElementById("customAvatarPreview");
    if (file && preview) {
        const reader = new FileReader();
        reader.onload = (e) => {
            var _a;
            preview.src = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            preview.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
    }
});
(_d = document.getElementById("avatarUpload")) === null || _d === void 0 ? void 0 : _d.addEventListener("change", (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    event.preventDefault();
    const input = event.target;
    const file = (_a = input.files) === null || _a === void 0 ? void 0 : _a[0];
    if (!file)
        return;
    console.log(`==> file`);
    const formData = new FormData();
    formData.append("file", file);
    const jwt = localStorage.getItem("jwt");
    const headers = {};
    if (jwt) {
        headers["Authorization"] = `Bearer ${jwt}`;
    }
    try {
        const response = yield fetch("http://localhost:3000/uploadFile", {
            method: "POST",
            headers,
            credentials: "include",
            body: formData,
        });
        const data = yield response.json();
        if (data.success && data.avatar) {
            const preview = document.getElementById("customAvatarPreview");
            if (preview) {
                preview.src = data.avatar;
                preview.classList.remove("hidden");
            }
            alert("✅ Avatar uploaded successfully!");
        }
        else {
            alert(data.message || "❌ Upload failed");
        }
    }
    catch (error) {
        alert("❌ Error uploading avatar: " + error);
    }
}));
