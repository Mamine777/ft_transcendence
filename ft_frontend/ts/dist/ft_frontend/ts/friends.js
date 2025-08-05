var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { switchView } from './login';
// Application state
class FriendsManager {
    constructor() {
        this.friends = [];
        this.pendingRequests = [];
        this.filteredFriends = [];
        this.currentPage = 1;
        this.currentTab = 'friends';
        this.ITEMS_PER_PAGE = 5;
        // DOM element references
        this.elements = {};
        this.initializeElements();
        this.setupEventListeners();
    }
    // Step 1: Initialize DOM elements
    initializeElements() {
        const elementIds = [
            'friendsTab', 'pendingTab', 'addFriendTab',
            'friendsContainer', 'pendingContainer', 'outgoingContainer',
            'addFriendForm', 'searchInput', 'statusFilter', 'sortBy',
            'prevPage', 'nextPage', 'pageInfo',
            'friendsCount', 'pendingCount',
            'friendUsername', 'friendMessage',
            'sendFriendRequest', 'cancelAddFriend',
            'friendsList', 'pendingRequests'
        ];
        elementIds.forEach(id => {
            this.elements[id] = document.getElementById(id);
        });
    }
    // Step 2: Setup all event listeners
    setupEventListeners() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        // Tab navigation
        (_a = this.elements.friendsTab) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => this.switchTab('friends'));
        (_b = this.elements.pendingTab) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => this.switchTab('pending'));
        (_c = this.elements.addFriendTab) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => this.switchTab('addFriend'));
        // Search and filters
        (_d = this.elements.searchInput) === null || _d === void 0 ? void 0 : _d.addEventListener('input', () => this.handleFilters());
        (_e = this.elements.statusFilter) === null || _e === void 0 ? void 0 : _e.addEventListener('change', () => this.handleFilters());
        (_f = this.elements.sortBy) === null || _f === void 0 ? void 0 : _f.addEventListener('change', () => this.handleFilters());
        // Pagination
        (_g = this.elements.prevPage) === null || _g === void 0 ? void 0 : _g.addEventListener('click', () => this.previousPage());
        (_h = this.elements.nextPage) === null || _h === void 0 ? void 0 : _h.addEventListener('click', () => this.nextPage());
        // Add friend form
        (_j = this.elements.sendFriendRequest) === null || _j === void 0 ? void 0 : _j.addEventListener('click', () => this.sendFriendRequest());
        (_k = this.elements.cancelAddFriend) === null || _k === void 0 ? void 0 : _k.addEventListener('click', () => this.cancelAddFriend());
        // Back to dashboard
        (_l = document.getElementById('backToDashboardFromFriends')) === null || _l === void 0 ? void 0 : _l.addEventListener('click', () => {
            switchView('dashboardView');
        });
    }
    // Step 3: API helper for authentication headers
    getHeaders() {
        const headers = {
            "Content-Type": "application/json",
        };
        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            headers["Authorization"] = `Bearer ${jwt}`;
        }
        return headers;
    }
    // Step 4: Fetch friends and pending requests from server
    fetchFriends() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch("http://localhost:3000/GetFriends", {
                    method: "GET",
                    headers: this.getHeaders(),
                    credentials: "include",
                });
                const data = yield response.json();
                if (data.success) {
                    // Transform server data to our interface
                    this.friends = (data.friends || []).map((username, idx) => ({
                        id: idx + 1,
                        username,
                        status: "",
                        addedDate: new Date().toISOString().split('T')[0],
                        lastSeen: this.getRandomLastSeen(),
                    }));
                    // FIX: Properly handle the pending requests structure from backend
                    this.pendingRequests = (data.pendingRequests || []).map((request, idx) => ({
                        id: idx + 1,
                        username: request.username,
                        date: new Date().toISOString().split('T')[0],
                        type: request.type,
                    }));
                    this.updateCounts();
                    this.handleFilters();
                    this.renderCurrentTab();
                }
                else {
                    this.showError("Failed to fetch friends: " + (data.error || "Unknown error"));
                }
            }
            catch (error) {
                console.error("Error fetching friends:", error);
                this.showError("Network error while fetching friends");
            }
        });
    }
    // Step 5: Update UI counters
    updateCounts() {
        const friendsCount = this.elements.friendsCount;
        const pendingCount = this.elements.pendingCount;
        if (friendsCount) {
            friendsCount.textContent = `(${this.friends.length})`;
        }
        if (pendingCount) {
            if (this.pendingRequests.length > 0) {
                pendingCount.style.display = 'inline-block';
                pendingCount.textContent = this.pendingRequests.length.toString();
            }
            else {
                pendingCount.style.display = 'none';
            }
        }
    }
    // Step 6: Filter and sort friends based on user input
    handleFilters() {
        const searchInput = this.elements.searchInput;
        const statusFilter = this.elements.statusFilter;
        const sortBy = this.elements.sortBy;
        if (!searchInput || !statusFilter || !sortBy)
            return;
        const searchTerm = searchInput.value.toLowerCase();
        const statusValue = statusFilter.value;
        const sortValue = sortBy.value;
        // Filter friends
        this.filteredFriends = this.friends.filter(friend => {
            const matchesSearch = friend.username.toLowerCase().includes(searchTerm);
            const matchesStatus = statusValue === 'all' || friend.status === statusValue;
            return matchesSearch && matchesStatus;
        });
        // Sort friends
        switch (sortValue) {
            case 'name':
                this.filteredFriends.sort((a, b) => a.username.localeCompare(b.username));
                break;
            case 'status':
                this.filteredFriends.sort((a, b) => this.getStatusPriority(a.status) - this.getStatusPriority(b.status));
                break;
            case 'recent':
                this.filteredFriends.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime());
                break;
        }
        this.currentPage = 1;
        this.renderFriends();
        this.updatePagination();
    }
    // Step 7: Render friends list with pagination
    renderFriends() {
        const container = this.elements.friendsContainer;
        if (!container)
            return;
        container.innerHTML = '';
        if (this.filteredFriends.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-400 py-8">No friends found.</div>';
            return;
        }
        const startIndex = (this.currentPage - 1) * this.ITEMS_PER_PAGE;
        const endIndex = startIndex + this.ITEMS_PER_PAGE;
        const pageItems = this.filteredFriends.slice(startIndex, endIndex);
        pageItems.forEach(friend => {
            const friendElement = this.createFriendElement(friend);
            container.appendChild(friendElement);
        });
    }
    // Step 8: Create individual friend element
    createFriendElement(friend) {
        const div = document.createElement('div');
        div.className = 'friend-item flex justify-between items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors';
        const statusColor = this.getStatusColor(friend.status);
        const statusText = friend.status.charAt(0).toUpperCase() + friend.status.slice(1);
        div.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          ${friend.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h4 class="font-semibold text-white">${friend.username}</h4>
          <div class="flex items-center gap-2 text-sm text-gray-400">
            <span class="w-2 h-2 rounded-full ${statusColor}"></span>
            <span>${statusText}</span>
            <span>•</span>
            <span>Added: ${friend.addedDate}</span>
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <button class="gaming-button-secondary px-3 py-1 text-sm rounded hover:bg-gray-600" 
                onclick="friendsManager.viewProfile('${friend.username}')" title="View Profile">
          👤
        </button>
        <button class="gaming-button-danger px-3 py-1 text-sm rounded hover:bg-red-600" 
                onclick="friendsManager.removeFriend('${friend.username}')" title="Remove Friend">
          ❌
        </button>
      </div>
    `;
        return div;
    }
    // Step 9: Render pending requests
    renderPendingRequests() {
        const incomingContainer = this.elements.pendingContainer;
        const outgoingContainer = this.elements.outgoingContainer;
        if (!incomingContainer || !outgoingContainer)
            return;
        incomingContainer.innerHTML = '';
        outgoingContainer.innerHTML = '';
        const incoming = this.pendingRequests.filter(r => r.type === 'incoming');
        const outgoing = this.pendingRequests.filter(r => r.type === 'outgoing');
        if (incoming.length === 0) {
            incomingContainer.innerHTML = '<div class="text-center text-gray-400 py-4">No incoming requests.</div>';
        }
        else {
            incoming.forEach(request => {
                const el = this.createPendingRequestElement(request);
                incomingContainer.appendChild(el);
            });
        }
        if (outgoing.length === 0) {
            outgoingContainer.innerHTML = '<div class="text-center text-gray-400 py-4">No outgoing requests.</div>';
        }
        else {
            outgoing.forEach(request => {
                const el = this.createPendingRequestElement(request);
                outgoingContainer.appendChild(el);
            });
        }
    }
    // Step 10: Create pending request element
    createPendingRequestElement(request) {
        const div = document.createElement('div');
        div.className = 'pending-request-item flex justify-between items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors';
        const typeText = request.type === 'incoming' ? 'Incoming Request' : 'Outgoing Request';
        const typeColor = request.type === 'incoming' ? 'text-green-400' : 'text-yellow-400';
        div.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
          ${request.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h4 class="font-semibold text-white">${request.username}</h4>
          <div class="text-sm text-gray-400">
            <span class="${typeColor}">${typeText}</span>
            <span> • ${request.date}</span>
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        ${request.type === 'incoming' ? `
          <button class="gaming-button px-3 py-1 text-sm rounded hover:bg-green-600" 
                  onclick="friendsManager.acceptRequest('${request.username}')" title="Accept">
            ✅
          </button>
          <button class="gaming-button-danger px-3 py-1 text-sm rounded hover:bg-red-600" 
                  onclick="friendsManager.declineRequest('${request.username}')" title="Decline">
            ❌
          </button>
        ` : `
          <button class="gaming-button-secondary px-3 py-1 text-sm rounded hover:bg-gray-600" 
                  onclick="friendsManager.cancelRequest('${request.username}')" title="Cancel Request">
            Cancel
          </button>
        `}
      </div>
    `;
        return div;
    }
    // Step 11: Tab switching logic
    switchTab(tab) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            this.currentTab = tab;
            // Update tab button states
            (_a = this.elements.friendsTab) === null || _a === void 0 ? void 0 : _a.classList.toggle('active', tab === 'friends');
            (_b = this.elements.pendingTab) === null || _b === void 0 ? void 0 : _b.classList.toggle('active', tab === 'pending');
            (_c = this.elements.addFriendTab) === null || _c === void 0 ? void 0 : _c.classList.toggle('active', tab === 'addFriend');
            // Show/hide content panels
            const friendsList = this.elements.friendsList;
            const pendingRequests = this.elements.pendingRequests;
            const addFriendForm = this.elements.addFriendForm;
            if (friendsList)
                friendsList.style.display = tab === 'friends' ? 'block' : 'none';
            if (pendingRequests)
                pendingRequests.style.display = tab === 'pending' ? 'block' : 'none';
            if (addFriendForm)
                addFriendForm.style.display = tab === 'addFriend' ? 'block' : 'none';
            // Render content for current tab
            yield this.fetchFriends();
            this.renderCurrentTab();
        });
    }
    // Step 12: Render content based on current tab
    renderCurrentTab() {
        switch (this.currentTab) {
            case 'friends':
                this.renderFriends();
                this.updatePagination();
                break;
            case 'pending':
                this.renderPendingRequests();
                break;
            case 'addFriend':
                // Add friend form is static HTML, no rendering needed
                break;
        }
    }
    // Step 13: Pagination logic
    updatePagination() {
        const totalPages = Math.ceil(this.filteredFriends.length / this.ITEMS_PER_PAGE) || 1;
        const pageInfo = this.elements.pageInfo;
        const prevBtn = this.elements.prevPage;
        const nextBtn = this.elements.nextPage;
        if (pageInfo) {
            pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
        }
        if (prevBtn) {
            prevBtn.disabled = this.currentPage <= 1;
            prevBtn.classList.toggle('opacity-50', this.currentPage <= 1);
        }
        if (nextBtn) {
            nextBtn.disabled = this.currentPage >= totalPages;
            nextBtn.classList.toggle('opacity-50', this.currentPage >= totalPages);
        }
    }
    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderFriends();
            this.updatePagination();
        }
    }
    nextPage() {
        const totalPages = Math.ceil(this.filteredFriends.length / this.ITEMS_PER_PAGE) || 1;
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderFriends();
            this.updatePagination();
        }
    }
    // Step 14: Friend request operations - FIXED
    sendFriendRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            const usernameInput = this.elements.friendUsername;
            const messageInput = this.elements.friendMessage;
            if (!usernameInput)
                return;
            const username = usernameInput.value.trim();
            if (!username) {
                this.showError("Please enter a username.");
                return;
            }
            try {
                const response = yield fetch("http://localhost:3000/AddFriend", {
                    method: "POST",
                    headers: this.getHeaders(),
                    credentials: "include",
                    body: JSON.stringify({ message: username })
                });
                const data = yield response.json();
                console.log("AddFriend response:", data);
                if (data.success) {
                    this.showSuccess(`Friend request sent to ${username}`);
                    usernameInput.value = '';
                    if (messageInput)
                        messageInput.value = '';
                    yield this.fetchFriends();
                    this.switchTab('pending'); // FIXED: Switch to pending tab to show outgoing request
                }
                else {
                    this.showError(data.received || "Failed to send friend request");
                }
            }
            catch (error) {
                console.error("Error sending friend request:", error);
                this.showError("Network error while sending friend request");
            }
        });
    }
    acceptRequest(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch("http://localhost:3000/AcceptRequest", {
                    method: "POST",
                    headers: this.getHeaders(),
                    credentials: "include",
                    body: JSON.stringify({ message: username })
                });
                const data = yield response.json();
                if (data.succes || data.success) {
                    this.showSuccess(`Friend request from ${username} accepted`);
                    yield this.fetchFriends();
                    this.switchTab('friends');
                }
                else {
                    this.showError(data.error || "Failed to accept friend request");
                }
            }
            catch (error) {
                console.error("Error accepting friend request:", error);
                this.showError("Network error while accepting friend request");
            }
        });
    }
    declineRequest(username) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!confirm(`Decline friend request from ${username}?`))
                return;
            try {
                const response = yield fetch("http://localhost:3000/RemoveFriend", {
                    method: "POST",
                    headers: this.getHeaders(),
                    credentials: "include",
                    body: JSON.stringify({ message: username })
                });
                const data = yield response.json();
                if (data.success) {
                    this.showSuccess(`Friend request from ${username} declined`);
                    yield this.fetchFriends();
                    this.renderCurrentTab();
                }
                else {
                    this.showError(data.error || "Failed to decline friend request");
                }
            }
            catch (error) {
                console.error("Error declining friend request:", error);
                this.showError("Network error while declining friend request");
            }
        });
    }
    removeFriend(username) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!confirm(`Remove ${username} from your friends?`))
                return;
            try {
                const response = yield fetch("http://localhost:3000/RemoveFriend", {
                    method: "POST",
                    headers: this.getHeaders(),
                    credentials: "include",
                    body: JSON.stringify({ message: username })
                });
                const data = yield response.json();
                if (data.success) {
                    this.showSuccess(`${username} removed from friends`);
                    yield this.fetchFriends();
                    this.renderCurrentTab();
                }
                else {
                    this.showError(data.error || "Failed to remove friend");
                }
            }
            catch (error) {
                console.error("Error removing friend:", error);
                this.showError("Network error while removing friend");
            }
        });
    }
    // Cancel outgoing friend request (uses same RemoveFriend endpoint)
    cancelRequest(username) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!confirm(`Cancel friend request to ${username}?`))
                return;
            try {
                const response = yield fetch("http://localhost:3000/RemoveFriend", {
                    method: "POST",
                    headers: this.getHeaders(),
                    credentials: "include",
                    body: JSON.stringify({ message: username })
                });
                const data = yield response.json();
                if (data.success) {
                    this.showSuccess(`Friend request to ${username} cancelled`);
                    yield this.fetchFriends();
                    this.renderCurrentTab();
                }
                else {
                    this.showError(data.error || "Failed to cancel friend request");
                }
            }
            catch (error) {
                console.error("Error cancelling friend request:", error);
                this.showError("Network error while cancelling friend request");
            }
        });
    }
    // Step 15: Helper functions
    cancelAddFriend() {
        const usernameInput = this.elements.friendUsername;
        const messageInput = this.elements.friendMessage;
        if (usernameInput)
            usernameInput.value = '';
        if (messageInput)
            messageInput.value = '';
        this.switchTab('friends');
    }
    viewProfile(username) {
        alert(`View profile of ${username}`);
        // Implement profile viewing logic here
    }
    getStatusColor(status) {
        switch (status) {
            case 'online': return 'bg-green-500';
            case 'away': return 'bg-yellow-500';
            case 'offline': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    }
    getStatusPriority(status) {
        switch (status) {
            case 'online': return 1;
            case 'away': return 2;
            case 'offline': return 3;
            default: return 4;
        }
    }
    getRandomStatus() {
        const statuses = ['online', 'offline', 'away'];
        return statuses[Math.floor(Math.random() * statuses.length)];
    }
    getRandomLastSeen() {
        const options = ['Now', '5 min ago', '1 hour ago', '1 day ago', '3 days ago'];
        return options[Math.floor(Math.random() * options.length)];
    }
    showSuccess(message) {
        // You can implement a toast notification system here
        console.log("Success:", message);
        alert(message);
    }
    showError(message) {
        // You can implement a toast notification system here
        console.log("Error:", message);
        alert(message);
    }
}
// Step 16: Initialize the system
let friendsManager;
document.addEventListener("DOMContentLoaded", () => {
    friendsManager = new FriendsManager();
    // Make friendsManager available globally for onclick handlers
    window.friendsManager = friendsManager;
    // Initialize when friends view is shown
    const showFriendsListBtn = document.getElementById("showFriendsListBtn");
    if (showFriendsListBtn) {
        showFriendsListBtn.addEventListener("click", () => {
            switchView("FriendsView");
            friendsManager.fetchFriends();
        });
    }
});
