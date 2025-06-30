(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const l of t.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function s(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=s(e);fetch(e.href,t)}})();class E{constructor(){}render(){return`
      <!-- Centered Main Buttons -->
      <div class="flex flex-col items-center justify-center h-full space-y-8">
        <h1 class="text-white text-4xl font-bold mb-6 drop-shadow-lg">ft_transcendence</h1>
        <p class="text-white text-lg mb-8">The Ultimate Ping Pong Showdown</p>
        <div class="flex flex-col gap-6 w-full max-w-md">
          <button id="play" class="bg-gray-300 text-gray-900 px-10 py-4 w-full text-lg rounded-xl shadow hover:bg-gray-400 transition">Play</button>
          <button class="bg-gray-300 text-gray-900 px-10 py-4 w-full text-lg rounded-xl shadow hover:bg-gray-400 transition">Tournament</button>
          <button id="friendBtn" class="bg-gray-300 text-gray-900 px-10 py-4 w-full text-lg rounded-xl shadow hover:bg-gray-400 transition">Friends</button>
        </div>
      </div>
      <button id="chatBtn" class="absolute bottom-6 right-6 bg-gray-300 text-gray-900 py-2 px-6 rounded shadow-md hover:bg-gray-400 transition">Chat</button>
      </div>
      `}attachEvents(){const o=document.getElementById("play"),s=document.getElementById("friendBtn");o&&o.addEventListener("click",()=>{window.location.hash="#play"}),s&&s.addEventListener("click",()=>{window.location.hash="#friends"})}}class B{constructor(){}render(){return`
			<div class="flex flex-col items-center justify-center h-full space-y-8">
			<button id="backToDashboard" class="absolute top-10 left-6 bg-gray-300 text-gray-900 py-2 px-6 rounded shadow hover:bg-gray-400 transition">
				← Back
			</button>
				<h2 class="text-4xl font-bold mb-10 drop-shadow-lg">🎮 Choose Your Opponent</h2>
				<div class="flex flex-col gap-6 w-full">
				<button id="challengeFriend" class="bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl shadow text-lg transition">
					Challenge a Friend
				</button>
				<button id="challengeRandom" class="bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-xl shadow text-lg transition">
					Challenge a Random
				</button>
				<button id="challengeBot" class="bg-pink-600 hover:bg-pink-700 text-white py-4 px-6 rounded-xl shadow text-lg transition">
					Challenge a Bot
				</button>
				</div>
			</div>
			</div>
		`}attachEvents(){const o=document.getElementById("challengeBot"),s=document.getElementById("Rdm"),r=document.getElementById("challengeFriend"),e=document.getElementById("backToDashboard");o&&o.addEventListener("click",()=>{window.location.hash="#challengeBot"}),s&&s.addEventListener("click",()=>{window.location.hash="#challengeRandom"}),r&&r.addEventListener("click",()=>{window.location.hash="#challengeFriend"}),e&&e.addEventListener("click",()=>{window.location.hash="#dashboard"})}}class x{constructor(){}render(){return`
			<div class="flex flex-col items-center justify-center h-full space-y-8">
			<button id="backToDashboard" class="absolute top-6 left-6 bg-gray-300 text-gray-900 py-2 px-6 rounded shadow hover:bg-gray-400 transition">  ← Back </button>
			<div class="flex flex-col items-center justify-center text-center w-full h-full max-w-md mx-auto">
				<h2 class="text-4xl font-bold mb-8 drop-shadow-lg">👥 Friends List</h2>
				<div class="flex flex-col gap-6 w-full max-w-md">   
					<button id="ListBtn" class="bg-gray-300 text-gray-900 px-10 py-4 w-full text-lg rounded-xl shadow hover:bg-gray-400 transition"> Liste </button>
					<button id="addfriendBtn" class="bg-gray-300 text-gray-900 px-10 py-4 w-full text-lg rounded-xl shadow hover:bg-gray-400 transition"> Add friend </button>
					<button id="RemoveBtn" class="bg-gray-300 text-gray-900 px-10 py-4 w-full text-lg rounded-xl shadow hover:bg-gray-400 transition"> Remove friend </button>
				</div>
			</div>
			</div>
			`}renderAddFriend(){return`
		<div class="flex items-start justify-center h-screen w-full">
			<button id="backToFriens" class="absolute top-15 left-6 bg-gray-300 text-gray-900 py-2 px-6 rounded shadow hover:bg-gray-400 transition">  ← Back </button>
			<div class="view active bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-gray-800 mt-10">
				<h2 class="text-2xl font-bold mb-4 text-center">Add Friends</h2>
				<form id="Friendname" method="POST" class="flex flex-col gap-3">
					<input type="user" id="user" placeholder="Friends Name" required class="p-2 border rounded" />
					<button type="submit" class="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Add</button>
				</form>
			</div>
		</div>
		`}renderListFriends(){return`
			<div class="flex items-start justify-center h-screen w-full">
				<button id="backToFriens" class="absolute top-15 left-6 bg-gray-300 text-gray-900 py-2 px-6 rounded shadow hover:bg-gray-400 transition">  ← Back </button>
				<div class="view active bg-white w-[32rem] h-[32rem] p-8 rounded-xl shadow-2xl text-gray-800 flex flex-col justify-start">
					<h2 class="text-2xl font-bold mb-4 m-0 text-center">List friends</h2>
				</div>
			</div>
		`}attachEvents(){const o=document.getElementById("addfriendBtn"),s=document.getElementById("ListBtn"),r=document.getElementById("RemoveBtn"),e=document.getElementById("backToDashboard"),t=document.getElementById("backToFriens");s&&s.addEventListener("click",()=>{window.location.hash="#listfriends"}),o&&o.addEventListener("click",()=>{window.location.hash="#addfriends"}),r&&r.addEventListener("click",()=>{window.location.hash="#removefriends"}),e&&e.addEventListener("click",()=>{window.location.hash="#dashboard"}),t&&t.addEventListener("click",()=>{window.location.hash="#friends"})}}function L(){document.body.innerHTML=`
	
	<header class="mb-10 text-top">
	<h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-wide text-white drop-shadow-lg">
	🏓 ft_transcendence
	</h1>
	<p class="mt-2 text-lg text-purple-200">The Ultimate Ping Pong Showdown</p>
	</header>
	
	<main id="main-content" class="pt-16 container mx-auto px-4 py-8 flex-grow"> </main>
	`}function I(){return`
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
    `}function k(){return`
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
        `}function P(){return`
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
		`}function T(){const n=document.getElementById("passwordBtn"),o=document.getElementById("goToLogin"),s=document.getElementById("goToSignup");s&&s.addEventListener("click",()=>{console.log("Go to signup button clicked"),window.location.hash="#signup"}),o&&o.addEventListener("click",()=>{console.log("Go to login button clicked"),window.location.hash=""}),n&&n.addEventListener("click",()=>{console.log("Forgot password button clicked"),window.location.hash="#forgotpassword"});const r=document.getElementById("signupForm"),e=document.getElementById("forgotPasswordForm"),t=document.getElementById("loginForm"),l=document.getElementById("loginView");t&&l&&t.addEventListener("submit",async g=>{g.preventDefault();const d=document.getElementById("email"),c=document.getElementById("password"),i=document.getElementById("loginMessage");if(!d||!c||!i)return;const a=d.value,m=c.value;try{const u=await(await fetch("http://localhost:3000/check",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({email:a,password:m})})).json();i.textContent=u.message,u.switch&&u.switch===!0&&(window.location.hash="#dashboard")}catch{i.textContent="An error occurred. Please try again."}}),r&&(r.addEventListener("submit",async g=>{g.preventDefault();const d=document.getElementById("signupEmail"),c=document.getElementById("signupPassword"),i=document.getElementById("username"),a=document.getElementById("signupMessage"),m=document.getElementById("signupView");if(!d||!c||!i||!a||!m)return;const p=d.value,u=c.value,w=i.value;try{const h=await(await fetch("http://localhost:3000/check-signup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({signupEmail:p,signupPassword:u,username:w})})).json();if(h.success){document.getElementById("secretMessage").textContent=h.message,document.getElementById("secretNote").textContent=h.importantNote,document.getElementById("secretPhrase").textContent=h.secret,document.getElementById("secretView").style.display="block";let f=120;a.textContent=`User registered successfully! Redirecting in ${f} seconds...`;const v=setInterval(()=>{f--,f>0?a.textContent=`User registered successfully! Redirecting in ${f} seconds...`:clearInterval(v)},1e3)}else a.textContent=h.message}catch{a.textContent="An error occurred. Please try again."}}),e&&e.addEventListener("submit",async g=>{g.preventDefault();const d=document.getElementById("forgotMessage"),c=document.getElementById("forgotEmail"),i=document.getElementById("secretKey"),a=document.getElementById("newPassword");if(!d||!c||!i||!a)return;const m=c.value,p=i.value,u=a.value;try{const b=await(await fetch("http://localhost:3000/check-forgot",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:m,secretKey:p,newpassword:u})})).json();d.textContent=b.message}catch{d.textContent="An error occurred. Please try again."}}))}async function F(){try{const n=await fetch("http://localhost:3000/me",{credentials:"include"});return n.ok?(await n.json()).loggedIn===!0:!1}catch{return!1}}async function y(){const n=document.getElementById("main-content");if(!n)return;if(await F())switch(window.location.hash){case"#dashboard":const s=new E;n.innerHTML=s.render(),s.attachEvents();break;case"#play":const r=new B;n.innerHTML=r.render(),r.attachEvents();break;case"#friends":const e=new x;n.innerHTML=e.render(),e.attachEvents();break;case"#addfriends":const t=new x;n.innerHTML=t.renderAddFriend(),t.attachEvents();break;case"#listfriends":const l=new x;n.innerHTML=l.renderListFriends(),l.attachEvents();break}else switch(window.location.hash){case"#signup":n.innerHTML=I();break;case"#forgotpassword":n.innerHTML=k();break;default:n.innerHTML=P()}T()}document.addEventListener("DOMContentLoaded",()=>{L(),y()});window.addEventListener("hashchange",y);
