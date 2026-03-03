<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Messages - LocalHub</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: #f8fafc;
            color: #1e293b;
        }

        .top-nav {
            background: white;
            height: 70px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 20px;
            font-weight: 700;
            color: #2563eb;
        }

        .logo i {
            font-size: 28px;
        }

        .nav-right {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .user-menu {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 16px;
            background: #f1f5f9;
            border-radius: 8px;
            cursor: pointer;
        }

        .user-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 14px;
        }

        .sidebar {
            position: fixed;
            left: 0;
            top: 70px;
            bottom: 0;
            width: 260px;
            background: white;
            border-right: 1px solid #e2e8f0;
            padding: 24px 0;
            overflow-y: auto;
        }

        .sidebar-item {
            padding: 12px 24px;
            display: flex;
            align-items: center;
            gap: 12px;
            color: #64748b;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 14px;
            font-weight: 500;
            text-decoration: none;
        }

        .sidebar-item:hover {
            background: #f1f5f9;
            color: #2563eb;
        }

        .sidebar-item.active {
            background: #eff6ff;
            color: #2563eb;
            border-right: 3px solid #2563eb;
        }

        .sidebar-item i {
            width: 20px;
            font-size: 18px;
        }

        .main-content {
            margin-left: 260px;
            margin-top: 70px;
            padding: 32px;
        }

        .page-header {
            margin-bottom: 32px;
        }

        .page-title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .page-subtitle {
            color: #64748b;
            font-size: 15px;
        }

        .messages-container {
            display: grid;
            grid-template-columns: 350px 1fr;
            gap: 24px;
            height: calc(100vh - 200px);
        }

        .conversations-panel {
            background: white;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .conversations-header {
            padding: 20px;
            border-bottom: 1px solid #e2e8f0;
        }

        .conversations-search {
            width: 100%;
            padding: 10px 16px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 14px;
        }

        .conversations-list {
            overflow-y: auto;
            max-height: calc(100% - 80px);
        }

        .conversation-item {
            padding: 16px 20px;
            border-bottom: 1px solid #e2e8f0;
            cursor: pointer;
            transition: all 0.2s;
        }

        .conversation-item:hover {
            background: #f8fafc;
        }

        .conversation-item.active {
            background: #eff6ff;
            border-left: 3px solid #2563eb;
        }

        .conversation-header {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .conversation-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            flex-shrink: 0;
        }

        .conversation-info {
            flex: 1;
        }

        .conversation-name {
            font-weight: 600;
            font-size: 15px;
            margin-bottom: 4px;
        }

        .conversation-preview {
            font-size: 13px;
            color: #64748b;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .conversation-time {
            font-size: 12px;
            color: #94a3b8;
        }

        .chat-panel {
            background: white;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
        }

        .chat-header {
            padding: 20px 24px;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .chat-header-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
        }

        .chat-header-info h3 {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .chat-header-info p {
            font-size: 13px;
            color: #64748b;
        }

        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .message {
            display: flex;
            gap: 12px;
            max-width: 70%;
        }

        .message.sent {
            align-self: flex-end;
            flex-direction: row-reverse;
        }

        .message-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 14px;
            flex-shrink: 0;
        }

        .message-bubble {
            background: #f1f5f9;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.5;
        }

        .message.sent .message-bubble {
            background: #2563eb;
            color: white;
        }

        .message-time {
            font-size: 11px;
            color: #94a3b8;
            margin-top: 4px;
        }

        .message.sent .message-time {
            color: rgba(255, 255, 255, 0.7);
        }

        .chat-input-container {
            padding: 20px 24px;
            border-top: 1px solid #e2e8f0;
        }

        .chat-input-wrapper {
            display: flex;
            gap: 12px;
        }

        .chat-input {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 14px;
            resize: none;
            max-height: 100px;
        }

        .chat-input:focus {
            outline: none;
            border-color: #2563eb;
        }

        .btn {
            padding: 12px 24px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
        }

        .btn-primary {
            background: #2563eb;
            color: white;
        }

        .btn-primary:hover {
            background: #1d4ed8;
        }

        .btn-primary:disabled {
            background: #94a3b8;
            cursor: not-allowed;
        }

        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #94a3b8;
            text-align: center;
            padding: 48px 24px;
        }

        .empty-state i {
            font-size: 64px;
            margin-bottom: 20px;
            opacity: 0.3;
        }

        .empty-state h3 {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #64748b;
        }

        .empty-state p {
            font-size: 15px;
        }

        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
            }

            .main-content {
                margin-left: 0;
                padding: 16px;
            }

            .messages-container {
                grid-template-columns: 1fr;
            }

            .conversations-panel {
                display: none;
            }

            .conversations-panel.mobile-show {
                display: block;
            }

            .chat-panel.mobile-hide {
                display: none;
            }
        }
    </style>
</head>

<body>
    <!-- Navigation -->
    <nav class="top-nav">
        <div class="logo">
            <i class="fas fa-network-wired"></i>
            <span>LocalHub</span>
        </div>
        <div class="nav-right">
            <div class="user-menu" onclick="logout()">
                <div class="user-avatar" id="user-avatar">R</div>
                <span id="user-name">Loading...</span>
                <i class="fas fa-sign-out-alt"></i>
            </div>
        </div>
    </nav>

    <!-- Sidebar -->
    <aside class="sidebar">
        <a href="/resident/dashboard" class="sidebar-item">
            <i class="fas fa-home"></i>
            Dashboard
        </a>
        <a href="/resident/services" class="sidebar-item">
            <i class="fas fa-search"></i>
            Find Services
        </a>
        <a href="/resident/bookings" class="sidebar-item">
            <i class="fas fa-calendar-check"></i>
            My Bookings
        </a>
        <a href="/resident/messages" class="sidebar-item active">
            <i class="fas fa-comments"></i>
            Messages
        </a>
        <a href="/resident/profile" class="sidebar-item">
            <i class="fas fa-user"></i>
            My Profile
        </a>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <div class="page-header">
            <h1 class="page-title">Messages</h1>
            <p class="page-subtitle">Chat with professionals about your bookings</p>
        </div>

        <div class="messages-container">
            <!-- Conversations List -->
            <div class="conversations-panel">
                <div class="conversations-header">
                    <input type="text" class="conversations-search" placeholder="Search conversations..." id="search-input">
                </div>
                <div class="conversations-list" id="conversations-list">
                    <!-- Conversations will load here -->
                </div>
            </div>

            <!-- Chat Panel -->
            <div class="chat-panel" id="chat-panel">
                <div class="empty-state">
                    <i class="fas fa-comments"></i>
                    <h3>No Conversation Selected</h3>
                    <p>Select a conversation from the list to start chatting</p>
                </div>
            </div>
        </div>
    </main>

    <script>
        const API_BASE = '/api';
        const token = localStorage.getItem('auth_token');

        if (!token) {
            window.location.href = '/login';
        }

        const authHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        };

        // Load user data
        async function loadUserData() {
            try {
                const response = await fetch(`${API_BASE}/user/profile`, {
                    headers: authHeaders
                });

                if (!response.ok) throw new Error('Failed to load profile');

                const data = await response.json();
                const user = data.user || data;

                document.getElementById('user-name').textContent = user.name || 'Resident';

                const avatar = document.getElementById('user-avatar');
                if (user.name) {
                    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                    avatar.textContent = initials;
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        }

        // Load conversations (mock data for now)
        function loadConversations() {
            const conversationsList = document.getElementById('conversations-list');

            // TODO: Replace with actual API call when messaging backend is ready
            // For now, show empty state for messages from bookings
            conversationsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>No Messages Yet</h3>
                    <p style="padding: 0 20px;">Messages will appear here when you communicate with professionals about your bookings</p>
                </div>
            `;

            /* Example of how conversations would look:
            const mockConversations = [
                {
                    id: 1,
                    name: 'John Electrician',
                    avatar: 'JE',
                    lastMessage: 'I\'ll be there at 4 PM',
                    time: '2 min ago',
                    unread: true
                },
                {
                    id: 2,
                    name: 'Sarah Plumber',
                    avatar: 'SP',
                    lastMessage: 'Thank you for booking!',
                    time: '1 hour ago',
                    unread: false
                }
            ];

            conversationsList.innerHTML = mockConversations.map(conv => `
                <div class="conversation-item" onclick="openChat(${conv.id})">
                    <div class="conversation-header">
                        <div class="conversation-avatar">${conv.avatar}</div>
                        <div class="conversation-info">
                            <div class="conversation-name">${conv.name}</div>
                            <div class="conversation-preview">${conv.lastMessage}</div>
                        </div>
                        <div class="conversation-time">${conv.time}</div>
                    </div>
                </div>
            `).join('');
            */
        }

        // Open chat (placeholder)
        function openChat(conversationId) {
            const chatPanel = document.getElementById('chat-panel');

            // TODO: Load actual messages from API
            chatPanel.innerHTML = `
                <div class="chat-header">
                    <div class="chat-header-avatar">P</div>
                    <div class="chat-header-info">
                        <h3>Professional Name</h3>
                        <p>Electrician</p>
                    </div>
                </div>
                <div class="chat-messages" id="chat-messages">
                    <div class="message">
                        <div class="message-avatar">P</div>
                        <div>
                            <div class="message-bubble">
                                Hello! I'm available for your appointment tomorrow.
                            </div>
                            <div class="message-time">10:30 AM</div>
                        </div>
                    </div>
                    <div class="message sent">
                        <div class="message-avatar">R</div>
                        <div>
                            <div class="message-bubble">
                                Great! See you then.
                            </div>
                            <div class="message-time">10:32 AM</div>
                        </div>
                    </div>
                </div>
                <div class="chat-input-container">
                    <div class="chat-input-wrapper">
                        <textarea class="chat-input" placeholder="Type a message..." rows="1" id="message-input"></textarea>
                        <button class="btn btn-primary" onclick="sendMessage()">
                            <i class="fas fa-paper-plane"></i> Send
                        </button>
                    </div>
                </div>
            `;
        }

        // Send message (placeholder)
        function sendMessage() {
            const input = document.getElementById('message-input');
            const message = input.value.trim();

            if (!message) return;

            // TODO: Send message via API
            console.log('Sending message:', message);

            // Clear input
            input.value = '';

            alert('Messaging feature coming soon!');
        }

        // Logout
        function logout() {
            if (!confirm('Are you sure you want to logout?')) return;

            fetch(`${API_BASE}/logout`, {
                    method: 'POST',
                    headers: authHeaders
                })
                .then(() => {
                    localStorage.removeItem('auth_token');
                    window.location.href = '/login';
                })
                .catch(() => {
                    localStorage.removeItem('auth_token');
                    window.location.href = '/login';
                });
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            loadUserData();
            loadConversations();
        });
    </script>
</body>

</html>