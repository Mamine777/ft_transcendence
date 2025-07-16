import { switchView } from './login';


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("addFriendForm")?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const addFriendMessageElem = document.getElementById("addFriendMessage");
        const addFriendInput = document.getElementById("addFriendInput") as HTMLInputElement;
        const jwt = localStorage.getItem("jwt");
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        if (jwt) {
            headers["Authorization"] = `Bearer ${jwt}`;
        }
        try {
            const response = await fetch("http://localhost:3000/AddFriend", {
                method: "POST",
                headers,
                credentials: "include",
                body: JSON.stringify({ message: addFriendInput.value.trim()})
            });
            const data = await response.json();
            if (addFriendMessageElem) {
                addFriendMessageElem.textContent = data.received
            }
            

        } catch (error) {
            console.error("Error adding friend:", error);
        }
    });
    //////////////////****friend list*******////////////////
    const showFriendsListBtn = document.getElementById("showFriendsListBtn");
    if (showFriendsListBtn) {
    showFriendsListBtn.addEventListener("click", () => {
        switchView("friendsListView");

        const friendListElem = document.getElementById("friendsList");
        const friendListMessageElem = document.getElementById("friendListMessage");

        const pendingListElem = document.getElementById("pendingList");
        const pendingListMessageElem = document.getElementById("pendingListMessage");

        const jwt = localStorage.getItem("jwt");

        const headers: { [key: string]: string } = {
        "Content-Type": "application/json",
        };
        if (jwt) {
        headers["Authorization"] = `Bearer ${jwt}`;
        }

        (async () => {
        try {
            const response = await fetch("http://localhost:3000/GetFriends", {
            method: "GET",
            headers,
            credentials: "include",
            });
            const data = await response.json();

            if (data.success) {
            // Populate accepted friends
            if (friendListElem) {
                friendListElem.innerHTML = "";
                friendListMessageElem!.textContent = "";

                if (!data.friends || data.friends.length === 0) {
                friendListMessageElem!.textContent = "No friends found.";
                } else {
                data.friends.forEach((friend: string) => {
                    const li = document.createElement("li");
                    li.textContent = friend;
                    friendListElem.appendChild(li);
                });
                }
            }

            // Populate pending requests
            if (pendingListElem) {
                pendingListElem.innerHTML = "";
                pendingListMessageElem!.textContent = "";

                if (!data.pendingRequests || data.pendingRequests.length === 0) {
                pendingListMessageElem!.textContent = "No pending requests.";
                } else {
                data.pendingRequests.forEach((pending: string) => {
                    const li = document.createElement("li");
                    li.textContent = pending;
                    pendingListElem.appendChild(li);
                });
                }
            }
            } else {
            if (friendListMessageElem) friendListMessageElem.textContent = data.error || "Could not fetch friend list.";
            if (pendingListMessageElem) pendingListMessageElem.textContent = data.error || "Could not fetch pending requests.";
            }
        } catch (error) {
            if (friendListMessageElem) friendListMessageElem.textContent = "Error fetching friend list.";
            if (pendingListMessageElem) pendingListMessageElem.textContent = "Error fetching pending requests.";
            console.error(error);
        }
        })();
    });
    }

    document.getElementById("removeFriendForm")?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const removeFriendMessageElem = document.getElementById("removeFriendMessage");
        const removeFriendInput = document.getElementById("removeFriendInput") as HTMLInputElement;
        const jwt = localStorage.getItem("jwt");
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        if (jwt) {
            headers["Authorization"] = `Bearer ${jwt}`;
        }
        try {
            const response = await fetch("http://localhost:3000/RemoveFriend", {
                method: "POST",
                headers,
                credentials: "include",
                body: JSON.stringify({ message: removeFriendInput.value.trim() })
            });
            const data = await response.json();
            if (removeFriendMessageElem) {
                removeFriendMessageElem.textContent = data.removed
                    ? `Friend "${data.removed}" removed successfully.`
                    : data.error || "Failed to remove friend.";
            }
        } catch (error) {
            console.error("Error removing friend:", error);
            if (removeFriendMessageElem) {
                removeFriendMessageElem.textContent = "Error removing friend.";
            }
        }
    });


    
});


// interface Friend {
//   id: number;
//   username: string;
//   addedDate: string;
//   lastSeen: string;
// }

// interface PendingRequest {
//   id: number;
//   username: string;
//   date: string;
// }

// // State
// let friends: Friend[] = [];
// let pendingRequests: PendingRequest[] = [];
// let filteredFriends: Friend[] = [];
// let currentPage = 1;
// let currentTab: 'friends' | 'pending' | 'addFriend' = 'friends';
// const ITEMS_PER_PAGE = 5;

// // DOM Elements - Check if elements exist before using them
// const friendsTab = document.getElementById('friendsTab') as HTMLButtonElement;
// const pendingTab = document.getElementById('pendingTab') as HTMLButtonElement;
// const addFriendTab = document.getElementById('addFriendTab') as HTMLButtonElement;

// const friendsContainer = document.getElementById('friendsContainer')!;
// const pendingContainer = document.getElementById('pendingContainer')!;
// const addFriendForm = document.getElementById('addFriendForm')!;

// const searchInput = document.getElementById('searchInput') as HTMLInputElement;
// const statusFilter = document.getElementById('statusFilter') as HTMLSelectElement;
// const sortBy = document.getElementById('sortBy') as HTMLSelectElement;

// const prevPageBtn = document.getElementById('prevPage') as HTMLButtonElement;
// const nextPageBtn = document.getElementById('nextPage') as HTMLButtonElement;
// const pageInfo = document.getElementById('pageInfo')!;

// const friendsCountSpan = document.getElementById('friendsCount')!;
// const pendingCountBadge = document.getElementById('pendingCount')!;

// const friendUsernameInput = document.getElementById('friendUsername') as HTMLInputElement;
// const sendFriendRequestBtn = document.getElementById('sendFriendRequest')!;
// const cancelAddFriendBtn = document.getElementById('cancelAddFriend')!;

// // Helper: Get headers with JWT
// function getHeaders(): { [key: string]: string } {
//   const headers: { [key: string]: string } = {
//     "Content-Type": "application/json",
//   };
//   const jwt = localStorage.getItem("jwt");
//   if (jwt) headers["Authorization"] = `Bearer ${jwt}`;
//   return headers;
// }

// // Fetch friends & pending requests
// async function fetchFriends() {
//   try {
//     const response = await fetch("http://localhost:3000/GetFriends", {
//       method: "GET",
//       headers: getHeaders(),
//       credentials: "include",
//     });
//     const data = await response.json();
//     if (data.success) {
//       friends = data.friends.map((username: string, idx: number) => ({
//         id: idx + 1,
//         username,
//         addedDate: new Date().toISOString().split('T')[0],
//         lastSeen: 'Now',
//       }));
//       pendingRequests = data.pendingRequests.map((username: string, idx: number) => ({
//         id: idx + 1,
//         username,
//         date: new Date().toISOString().split('T')[0],
//       }));
//       updateCounts();
//       handleFilters();
//       renderPendingRequests();
//     } else {
//       alert("Failed to fetch friends: " + (data.error || "Unknown error"));
//     }
//   } catch (err) {
//     console.error("Error fetching friends:", err);
//   }
// }

// // Update friends and pending counts in UI
// function updateCounts() {
//   if (friendsCountSpan) {
//     friendsCountSpan.textContent = `(${friends.length})`;
//   }
//   if (pendingCountBadge) {
//     if (pendingRequests.length > 0) {
//       pendingCountBadge.style.display = 'inline-block';
//       pendingCountBadge.textContent = pendingRequests.length.toString();
//     } else {
//       pendingCountBadge.style.display = 'none';
//     }
//   }
// }

// // Filter and sort friends based on search and sort input
// function handleFilters() {
//   if (!searchInput || !sortBy) return;
  
//   const term = searchInput.value.toLowerCase();
//   filteredFriends = friends.filter(f => f.username.toLowerCase().includes(term));
  
//   const sortValue = sortBy.value;
//   if (sortValue === 'name') {
//     filteredFriends.sort((a,b) => a.username.localeCompare(b.username));
//   } else if (sortValue === 'recent') {
//     filteredFriends.sort((a,b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime());
//   }
//   currentPage = 1;
//   renderFriends();
//   updatePagination();
// }

// // Render friends list with pagination
// function renderFriends() {
//   if (!friendsContainer) return;
  
//   friendsContainer.innerHTML = '';
//   if (filteredFriends.length === 0) {
//     friendsContainer.textContent = "No friends found.";
//     return;
//   }

//   const start = (currentPage - 1) * ITEMS_PER_PAGE;
//   const pageItems = filteredFriends.slice(start, start + ITEMS_PER_PAGE);

//   pageItems.forEach(friend => {
//     const div = document.createElement('div');
//     div.className = 'friend-item flex justify-between items-center p-2 bg-gray-800 rounded-md';

//     div.innerHTML = `
//       <div>
//         <h4 class="font-semibold">${friend.username}</h4>
//         <small>Added: ${friend.addedDate}</small>
//       </div>
//       <div class="flex gap-2">
//         <button class="gaming-button-secondary px-3 py-1 text-sm" onclick="viewProfile('${friend.username}')">👤</button>
//         <button class="gaming-button-danger px-3 py-1 text-sm" onclick="removeFriendHandler('${friend.username}')">❌</button>
//       </div>
//     `;

//     friendsContainer.appendChild(div);
//   });
// }

// // Update pagination buttons and info
// function updatePagination() {
//   const totalPages = Math.ceil(filteredFriends.length / ITEMS_PER_PAGE) || 1;
  
//   if (pageInfo) {
//     pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
//   }
//   if (prevPageBtn) {
//     prevPageBtn.disabled = currentPage <= 1;
//   }
//   if (nextPageBtn) {
//     nextPageBtn.disabled = currentPage >= totalPages;
//   }
// }

// // Render pending friend requests
// function renderPendingRequests() {
//   if (!pendingContainer) return;
  
//   pendingContainer.innerHTML = '';
//   if (pendingRequests.length === 0) {
//     pendingContainer.textContent = "No pending friend requests.";
//     return;
//   }

//   pendingRequests.forEach(req => {
//     const div = document.createElement('div');
//     div.className = 'pending-request-item flex justify-between items-center p-2 bg-gray-800 rounded-md';

//     div.innerHTML = `
//       <div>
//         <h4 class="font-semibold">${req.username}</h4>
//         <small>Request sent: ${req.date}</small>
//       </div>
//       <div class="flex gap-2">
//         <button class="gaming-button px-3 py-1 text-sm" onclick="acceptRequest('${req.username}')">✅ Accept</button>
//         <button class="gaming-button-danger px-3 py-1 text-sm" onclick="declineRequest('${req.username}')">❌ Decline</button>
//       </div>
//     `;

//     pendingContainer.appendChild(div);
//   });
// }

// // Send friend request
// async function sendFriendRequest() {
//   if (!friendUsernameInput) return;
  
//   const username = friendUsernameInput.value.trim();

//   if (!username) {
//     alert("Please enter a username or email.");
//     return;
//   }

//   try {
//     const res = await fetch("http://localhost:3000/AddFriend", {
//       method: "POST",
//       headers: getHeaders(),
//       credentials: "include",
//       body: JSON.stringify({ message: username }),
//     });
//     const data = await res.json();

//     if (data.success) {
//       alert(`Friend request sent to ${username}`);
//       friendUsernameInput.value = '';
//       await fetchFriends();
//       switchTab('friends');
//     } else {
//       alert("Failed to send friend request: " + (data.error || data.received || "Unknown error"));
//     }
//   } catch (err) {
//     console.error(err);
//     alert("Error sending friend request.");
//   }
// }

// // Accept friend request
// async function acceptRequest(username: string) {
//   try {
//     const res = await fetch("http://localhost:3000/AcceptRequest", {
//       method: "POST",
//       headers: getHeaders(),
//       credentials: "include",
//       body: JSON.stringify({ message: username }),
//     });
//     const data = await res.json();

//     if (data.success) {
//       alert(`Friend request from ${username} accepted.`);
//       await fetchFriends();
//       switchTab('friends');
//     } else {
//       alert("Failed to accept request: " + (data.error || "Unknown error"));
//     }
//   } catch (err) {
//     console.error(err);
//     alert("Error accepting friend request.");
//   }
// }

// // Decline friend request
// async function declineRequest(username: string) {
//   try {
//     const res = await fetch("http://localhost:3000/RemoveFriend", {
//       method: "POST",
//       headers: getHeaders(),
//       credentials: "include",
//       body: JSON.stringify({ message: username }),
//     });
//     const data = await res.json();

//     if (data.success) {
//       alert(`Friend request from ${username} declined.`);
//       await fetchFriends();
//       switchTab('pending');
//     } else {
//       alert("Failed to decline request: " + (data.error || "Unknown error"));
//     }
//   } catch (err) {
//     console.error(err);
//     alert("Error declining friend request.");
//   }
// }

// // Remove friend handler
// async function removeFriendHandler(username: string) {
//   if (!confirm(`Remove friend ${username}?`)) return;

//   try {
//     const res = await fetch("http://localhost:3000/RemoveFriend", {
//       method: "POST",
//       headers: getHeaders(),
//       credentials: "include",
//       body: JSON.stringify({ message: username }),
//     });
//     const data = await res.json();

//     if (data.success) {
//       alert(`${username} removed from friends.`);
//       await fetchFriends();
//     } else {
//       alert("Failed to remove friend: " + (data.error || "Unknown error"));
//     }
//   } catch (err) {
//     console.error(err);
//     alert("Error removing friend.");
//   }
// }

// // UI Tab switcher
// function switchTab(tab: 'friends' | 'pending' | 'addFriend') {
//   currentTab = tab;

//   // Set active classes
//   if (friendsTab) friendsTab.classList.toggle('active', tab === 'friends');
//   if (pendingTab) pendingTab.classList.toggle('active', tab === 'pending');
//   if (addFriendTab) addFriendTab.classList.toggle('active', tab === 'addFriend');

//   // Show/hide content panels - use the correct element IDs from your HTML
//   const friendsList = document.getElementById('friendsList');
//   const pendingRequests = document.getElementById('pendingRequests');
//   const addFriendFormElement = document.getElementById('addFriendForm');

//   if (friendsList) friendsList.style.display = tab === 'friends' ? 'block' : 'none';
//   if (pendingRequests) pendingRequests.style.display = tab === 'pending' ? 'block' : 'none';
//   if (addFriendFormElement) addFriendFormElement.style.display = tab === 'addFriend' ? 'block' : 'none';
// }

// // Global functions for onclick handlers
// (window as any).viewProfile = (username: string) => alert(`View profile of ${username}`);
// (window as any).acceptRequest = acceptRequest;
// (window as any).declineRequest = declineRequest;
// (window as any).removeFriendHandler = removeFriendHandler;

// // Event listeners setup
// function setupEventListeners() {
//   // Pagination controls
//   if (prevPageBtn) {
//     prevPageBtn.addEventListener('click', () => {
//       if (currentPage > 1) {
//         currentPage--;
//         renderFriends();
//         updatePagination();
//       }
//     });
//   }
  
//   if (nextPageBtn) {
//     nextPageBtn.addEventListener('click', () => {
//       const totalPages = Math.ceil(filteredFriends.length / ITEMS_PER_PAGE) || 1;
//       if (currentPage < totalPages) {
//         currentPage++;
//         renderFriends();
//         updatePagination();
//       }
//     });
//   }

//   // Search, sort, filter listeners
//   if (searchInput) searchInput.addEventListener('input', handleFilters);
//   if (sortBy) sortBy.addEventListener('change', handleFilters);

//   // Tab buttons
//   if (friendsTab) friendsTab.addEventListener('click', () => switchTab('friends'));
//   if (pendingTab) pendingTab.addEventListener('click', () => switchTab('pending'));
//   if (addFriendTab) addFriendTab.addEventListener('click', () => switchTab('addFriend'));

//   // Add friend form buttons
//   if (sendFriendRequestBtn) sendFriendRequestBtn.addEventListener('click', sendFriendRequest);
//   if (cancelAddFriendBtn) {
//     cancelAddFriendBtn.addEventListener('click', () => {
//       if (friendUsernameInput) friendUsernameInput.value = '';
//       switchTab('friends');
//     });
//   }
// }

// // Initialize on load
// window.addEventListener('load', () => {
//   setupEventListeners();
//   fetchFriends();
//   switchTab('friends');
// });