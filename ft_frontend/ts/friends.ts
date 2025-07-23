import { switchView } from './login';

// Data interfaces
interface Friend {
  id: number;
  username: string;
  status: 'online' | 'offline' | 'away';
  addedDate: string;
  lastSeen: string;
}

interface PendingRequest {
  id: number;
  username: string;
  message?: string;
  date: string;
  type: 'incoming' | 'outgoing';
}

// Application state
class FriendsManager {
  private friends: Friend[] = [];
  private pendingRequests: PendingRequest[] = [];
  private filteredFriends: Friend[] = [];
  private currentPage: number = 1;
  private currentTab: 'friends' | 'pending' | 'addFriend' = 'friends';
  private readonly ITEMS_PER_PAGE = 5;

  // DOM element references
  private elements: { [key: string]: HTMLElement | null } = {};

  constructor() {
    this.initializeElements();
    this.setupEventListeners();
  }

  // Step 1: Initialize DOM elements
  private initializeElements(): void {
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
  private setupEventListeners(): void {
    // Tab navigation
    this.elements.friendsTab?.addEventListener('click', () => this.switchTab('friends'));
    this.elements.pendingTab?.addEventListener('click', () => this.switchTab('pending'));
    this.elements.addFriendTab?.addEventListener('click', () => this.switchTab('addFriend'));

    // Search and filters
    this.elements.searchInput?.addEventListener('input', () => this.handleFilters());
    this.elements.statusFilter?.addEventListener('change', () => this.handleFilters());
    this.elements.sortBy?.addEventListener('change', () => this.handleFilters());

    // Pagination
    this.elements.prevPage?.addEventListener('click', () => this.previousPage());
    this.elements.nextPage?.addEventListener('click', () => this.nextPage());

    // Add friend form
    this.elements.sendFriendRequest?.addEventListener('click', () => this.sendFriendRequest());
    this.elements.cancelAddFriend?.addEventListener('click', () => this.cancelAddFriend());

    // Back to dashboard
    document.getElementById('backToDashboardFromFriends')?.addEventListener('click', () => {
      switchView('dashboardView');
    });
  }

  // Step 3: API helper for authentication headers
  private getHeaders(): { [key: string]: string } {
    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
    };
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      headers["Authorization"] = `Bearer ${jwt}`;
    }
    return headers;
  }

  // Step 4: Fetch friends and pending requests from server
  public async fetchFriends(): Promise<void> {
    try {
      const response = await fetch("http://localhost:3000/GetFriends", {
        method: "GET",
        headers: this.getHeaders(),
        credentials: "include",
      });

      const data = await response.json();
      
      if (data.success) {
        // Transform server data to our interface
        this.friends = (data.friends || []).map((username: string, idx: number) => ({
          id: idx + 1,
          username,
          status: "",
          addedDate: new Date().toISOString().split('T')[0],
          lastSeen: this.getRandomLastSeen(),
        }));

        // FIX: Properly handle the pending requests structure from backend
        this.pendingRequests = (data.pendingRequests || []).map((request: { username: string, type: 'incoming' | 'outgoing' }, idx: number) => ({
          id: idx + 1,
          username: request.username,
          date: new Date().toISOString().split('T')[0],
          type: request.type,
        }));


        this.updateCounts();
        this.handleFilters();
        this.renderCurrentTab();
      } else {
        this.showError("Failed to fetch friends: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
      this.showError("Network error while fetching friends");
    }
  }

  // Step 5: Update UI counters
  private updateCounts(): void {
    const friendsCount = this.elements.friendsCount;
    const pendingCount = this.elements.pendingCount;

    if (friendsCount) {
      friendsCount.textContent = `(${this.friends.length})`;
    }

    if (pendingCount) {
      if (this.pendingRequests.length > 0) {
        pendingCount.style.display = 'inline-block';
        pendingCount.textContent = this.pendingRequests.length.toString();
      } else {
        pendingCount.style.display = 'none';
      }
    }
  }

  // Step 6: Filter and sort friends based on user input
  private handleFilters(): void {
    const searchInput = this.elements.searchInput as HTMLInputElement;
    const statusFilter = this.elements.statusFilter as HTMLSelectElement;
    const sortBy = this.elements.sortBy as HTMLSelectElement;

    if (!searchInput || !statusFilter || !sortBy) return;

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
  private renderFriends(): void {
    this.fetchFriends();
    const container = this.elements.friendsContainer;
    if (!container) return;

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
  private createFriendElement(friend: Friend): HTMLElement {
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
private renderPendingRequests(): void {
  const incomingContainer = this.elements.pendingContainer;
  const outgoingContainer = this.elements.outgoingContainer;

  if (!incomingContainer || !outgoingContainer) return;

  incomingContainer.innerHTML = '';
  outgoingContainer.innerHTML = '';

  const incoming = this.pendingRequests.filter(r => r.type === 'incoming');
  const outgoing = this.pendingRequests.filter(r => r.type === 'outgoing');

  if (incoming.length === 0) {
    incomingContainer.innerHTML = '<div class="text-center text-gray-400 py-4">No incoming requests.</div>';
  } else {
    incoming.forEach(request => {
      const el = this.createPendingRequestElement(request);
      incomingContainer.appendChild(el);
    });
  }

  if (outgoing.length === 0) {
    outgoingContainer.innerHTML = '<div class="text-center text-gray-400 py-4">No outgoing requests.</div>';
  } else {
    outgoing.forEach(request => {
      const el = this.createPendingRequestElement(request);
      outgoingContainer.appendChild(el);
    });
  }
}



  // Step 10: Create pending request element
  private createPendingRequestElement(request: PendingRequest): HTMLElement {
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
  private async switchTab(tab: 'friends' | 'pending' | 'addFriend'): Promise<void> {
    this.currentTab = tab;

    // Update tab button states
    this.elements.friendsTab?.classList.toggle('active', tab === 'friends');
    this.elements.pendingTab?.classList.toggle('active', tab === 'pending');
    this.elements.addFriendTab?.classList.toggle('active', tab === 'addFriend');

    // Show/hide content panels
    const friendsList = this.elements.friendsList as HTMLElement;
    const pendingRequests = this.elements.pendingRequests as HTMLElement;
    const addFriendForm = this.elements.addFriendForm as HTMLElement;

    if (friendsList) friendsList.style.display = tab === 'friends' ? 'block' : 'none';
    if (pendingRequests) pendingRequests.style.display = tab === 'pending' ? 'block' : 'none';
    if (addFriendForm) addFriendForm.style.display = tab === 'addFriend' ? 'block' : 'none';

    // Render content for current tab
    await this.fetchFriends();
    this.renderCurrentTab();
  }

  // Step 12: Render content based on current tab
  private renderCurrentTab(): void {
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
  private updatePagination(): void {
    const totalPages = Math.ceil(this.filteredFriends.length / this.ITEMS_PER_PAGE) || 1;
    const pageInfo = this.elements.pageInfo;
    const prevBtn = this.elements.prevPage as HTMLButtonElement;
    const nextBtn = this.elements.nextPage as HTMLButtonElement;

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

  private previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.renderFriends();
      this.updatePagination();
    }
  }

  private nextPage(): void {
    const totalPages = Math.ceil(this.filteredFriends.length / this.ITEMS_PER_PAGE) || 1;
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.renderFriends();
      this.updatePagination();
    }
  }

  // Step 14: Friend request operations - FIXED
  public async sendFriendRequest(): Promise<void> {
    const usernameInput = this.elements.friendUsername as HTMLInputElement;
    const messageInput = this.elements.friendMessage as HTMLTextAreaElement;

    if (!usernameInput) return;

    const username = usernameInput.value.trim();

    if (!username) {
      this.showError("Please enter a username.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/AddFriend", {
        method: "POST",
        headers: this.getHeaders(),
        credentials: "include",
        body: JSON.stringify({ message: username })
      });

      const data = await response.json();

      console.log("AddFriend response:", data);

      if (data.success) {
        this.showSuccess(`Friend request sent to ${username}`);
        usernameInput.value = '';
        if (messageInput) messageInput.value = '';
        await this.fetchFriends();
        this.switchTab('pending'); // FIXED: Switch to pending tab to show outgoing request
      } else {
        this.showError(data.received || "Failed to send friend request");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      this.showError("Network error while sending friend request");
    }
  }

  public async acceptRequest(username: string): Promise<void> {
    try {
      const response = await fetch("http://localhost:3000/AcceptRequest", {
        method: "POST",
        headers: this.getHeaders(),
        credentials: "include",
        body: JSON.stringify({ message: username })
      });

      const data = await response.json();

      if (data.succes || data.success) {
        this.showSuccess(`Friend request from ${username} accepted`);
        await this.fetchFriends();
        this.switchTab('friends');
      } else {
        this.showError(data.error || "Failed to accept friend request");
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      this.showError("Network error while accepting friend request");
    }
  }

  public async declineRequest(username: string): Promise<void> {
    if (!confirm(`Decline friend request from ${username}?`)) return;

    try {
      const response = await fetch("http://localhost:3000/RemoveFriend", {
        method: "POST",
        headers: this.getHeaders(),
        credentials: "include",
        body: JSON.stringify({ message: username })
      });

      const data = await response.json();

      if (data.success) {
        this.showSuccess(`Friend request from ${username} declined`);
        await this.fetchFriends();
        this.renderCurrentTab();
      } else {
        this.showError(data.error || "Failed to decline friend request");
      }
    } catch (error) {
      console.error("Error declining friend request:", error);
      this.showError("Network error while declining friend request");
    }
  }

  public async removeFriend(username: string): Promise<void> {
    if (!confirm(`Remove ${username} from your friends?`)) return;

    try {
      const response = await fetch("http://localhost:3000/RemoveFriend", {
        method: "POST",
        headers: this.getHeaders(),
        credentials: "include",
        body: JSON.stringify({ message: username })
      });

      const data = await response.json();

      if (data.success) {
        this.showSuccess(`${username} removed from friends`);
        await this.fetchFriends();
        this.renderCurrentTab();
      } else {
        this.showError(data.error || "Failed to remove friend");
      }
    } catch (error) {
      console.error("Error removing friend:", error);
      this.showError("Network error while removing friend");
    }
  }

  // Cancel outgoing friend request (uses same RemoveFriend endpoint)
  public async cancelRequest(username: string): Promise<void> {
    if (!confirm(`Cancel friend request to ${username}?`)) return;

    try {
      const response = await fetch("http://localhost:3000/RemoveFriend", {
        method: "POST",
        headers: this.getHeaders(),
        credentials: "include",
        body: JSON.stringify({ message: username })
      });

      const data = await response.json();

      if (data.success) {
        this.showSuccess(`Friend request to ${username} cancelled`);
        await this.fetchFriends();
        this.renderCurrentTab();
      } else {
        this.showError(data.error || "Failed to cancel friend request");
      }
    } catch (error) {
      console.error("Error cancelling friend request:", error);
      this.showError("Network error while cancelling friend request");
    }
  }

  // Step 15: Helper functions
  private cancelAddFriend(): void {
    const usernameInput = this.elements.friendUsername as HTMLInputElement;
    const messageInput = this.elements.friendMessage as HTMLTextAreaElement;

    if (usernameInput) usernameInput.value = '';
    if (messageInput) messageInput.value = '';
    this.switchTab('friends');
  }

  public viewProfile(username: string): void {
    alert(`View profile of ${username}`);
    // Implement profile viewing logic here
  }

  private getStatusColor(status: string): string {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  }

  private getStatusPriority(status: string): number {
    switch (status) {
      case 'online': return 1;
      case 'away': return 2;
      case 'offline': return 3;
      default: return 4;
    }
  }

  private getRandomStatus(): 'online' | 'offline' | 'away' {
    const statuses: ('online' | 'offline' | 'away')[] = ['online', 'offline', 'away'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  private getRandomLastSeen(): string {
    const options = ['Now', '5 min ago', '1 hour ago', '1 day ago', '3 days ago'];
    return options[Math.floor(Math.random() * options.length)];
  }

  private showSuccess(message: string): void {
    // You can implement a toast notification system here
    console.log("Success:", message);
    alert(message);
  }

  private showError(message: string): void {
    // You can implement a toast notification system here
    console.log("Error:", message);
    alert(message);
  }
}



// Step 16: Initialize the system
let friendsManager: FriendsManager;

document.addEventListener("DOMContentLoaded", () => {
  friendsManager = new FriendsManager();
  
  // Make friendsManager available globally for onclick handlers
  (window as any).friendsManager = friendsManager;

  // Initialize when friends view is shown
  const showFriendsListBtn = document.getElementById("showFriendsListBtn");
  if (showFriendsListBtn) {
    showFriendsListBtn.addEventListener("click", () => {
      switchView("FriendsView");
      friendsManager.fetchFriends();
    });
  }
});