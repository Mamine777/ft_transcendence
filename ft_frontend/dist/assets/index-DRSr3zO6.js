(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))d(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const a of t.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&d(a)}).observe(document,{childList:!0,subtree:!0});function o(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function d(e){if(e.ep)return;e.ep=!0;const t=o(e);fetch(e.href,t)}})();class l{constructor(){}render(){return`
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
      `}attachEvents(){const n=document.getElementById("play"),o=document.getElementById("friendBtn");n&&n.addEventListener("click",()=>{window.location.hash="#play"}),o&&o.addEventListener("click",()=>{window.location.hash="#friends"})}}class c{constructor(){}render(){return`
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
		`}attachEvents(){const n=document.getElementById("challengeBot"),o=document.getElementById("Rdm"),d=document.getElementById("challengeFriend"),e=document.getElementById("backToDashboard");n&&n.addEventListener("click",()=>{window.location.hash="#challengeBot"}),o&&o.addEventListener("click",()=>{window.location.hash="#challengeRandom"}),d&&d.addEventListener("click",()=>{window.location.hash="#challengeFriend"}),e&&e.addEventListener("click",()=>{window.location.hash="#dashboard"})}}class s{constructor(){}render(){return`
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
		`}attachEvents(){const n=document.getElementById("addfriendBtn"),o=document.getElementById("ListBtn"),d=document.getElementById("RemoveBtn"),e=document.getElementById("backToDashboard"),t=document.getElementById("backToFriens");o&&o.addEventListener("click",()=>{window.location.hash="#listfriends"}),n&&n.addEventListener("click",()=>{window.location.hash="#addfriends"}),d&&d.addEventListener("click",()=>{window.location.hash="#removefriends"}),e&&e.addEventListener("click",()=>{window.location.hash="#dashboard"}),t&&t.addEventListener("click",()=>{window.location.hash="#friends"})}}function u(){document.body.innerHTML=`
	
	<header class="mb-10 text-top">
	<h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-wide text-white drop-shadow-lg">
	🏓 ft_transcendence
	</h1>
	<p class="mt-2 text-lg text-purple-200">The Ultimate Ping Pong Showdown</p>
	</header>
	
	<main id="main-content" class="pt-16 container mx-auto px-4 py-8 flex-grow"> </main>
	`}function h(){return console.log("Login script initialized"),`
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
		`}function i(){const r=document.getElementById("main-content");if(r)switch(r.innerHTML=h(),window.location.hash){case"#dashboard":const n=new l;r.innerHTML=n.render(),n.attachEvents();break;case"#play":const o=new c;r.innerHTML=o.render(),o.attachEvents();break;case"#friends":const d=new s;r.innerHTML=d.render(),d.attachEvents();break;case"#addfriends":const e=new s;r.innerHTML=e.renderAddFriend(),e.attachEvents();break;case"#listfriends":const t=new s;r.innerHTML=t.renderListFriends(),t.attachEvents();break}}document.addEventListener("DOMContentLoaded",()=>{u(),i()});window.addEventListener("hashchange",i);
