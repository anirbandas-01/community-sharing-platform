<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Messages - LocalHub</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    @include('components.styles')

    <style>
        /* Messages Specific Styles */
        .messages-container {
            display: grid;
            grid-template-columns: 350px 1fr;
            gap: 24px;
            height: calc(100vh - 150px);
        }

        .conversations-list {
            background: white;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .conversations-header {
            padding: 20px;
            border-bottom: 1px solid #e2e8f0;
        }

        .conversations-header h2 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 12px;
        }

        .search-box {
            position: relative;
        }

        .search-box input {
            width: 100%;
            padding: 10px 16px 10px 40px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 14px;
        }

        .search-box i {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
        }

        .conversations-body {
            flex: 1;
            overflow-y: auto;
        }

        .conversation-item {
            padding: 16px 20px;
            border-bottom: 1px solid #f1f5f9;
            cursor: pointer;
            transition: background 0.2s;
            display: flex;
            gap: 12px;
        }

        .conversation-item:hover {
            background: #f8fafc;
        }

        .conversation-item.active {
            background: #eff6ff;
            border-left: 3px solid #2563eb;
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
            font-size: 18px;
            flex-shrink: 0;
        }

        .conversation-details {
            flex: 1;
            min-width: 0;
        }

        .conversation-name {
            font-size: 14px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 4px;
        }

        .conversation-preview {
            font-size: 13px;
            color: #64748b;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .conversation-meta {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 4px;
        }

        .conversation-time {
            font-size: 12px;
            color: #94a3b8;
        }

        .unread-badge {
            background: #2563eb;
            color: white;
            font-size: 11px;
            padding: 2px 8px;
            border-radius: 10px;
            font-weight: 600;
        }

        .chat-area {
            background: white;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .chat-header {
            padding: 20px;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .chat-user-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .chat-user-name {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
        }

        .chat-user-status {
            font-size: 13px;
            color: #64748b;
        }

        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            background: #f8fafc;
        }

        .message {
            margin-bottom: 16px;
            display: flex;
            gap: 12px;
        }

        .message.sent {
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

        .message-content {
            max-width: 60%;
        }

        .message-bubble {
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.5;
        }

        .message.received .message-bubble {
            background: white;
            color: #1e293b;
        }

        .message.sent .message-bubble {
            background: #2563eb;
            color: white;
        }

        .message-time {
            font-size: 11px;
            color: #94a3b8;
            margin-top: 4px;
            padding: 0 4px;
        }

        .chat-input-area {
            padding: 20px;
            border-top: 1px solid #e2e8f0;
            background: white;
        }

        .chat-input-container {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .chat-input {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 14px;
            resize: none;
        }

        .send-btn {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #2563eb;
            color: white;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            transition: background 0.2s;
        }

        .send-btn:hover {
            background: #1d4ed8;
        }

        .empty-chat {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #94a3b8;
        }

        .empty-chat i {
            font-size: 64px;
            margin-bottom: 16px;
            opacity: 0.3;
        }
    </style>
</head>

<body>
    @include('components.navbar', [
    'title' => 'Messages',
    'searchPlaceholder' => 'Search messages...',
    'userInitials' => 'JD'
    ])

    @include('components.professional-sidebar')

    <main class="main-content">
        <div>
            <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">Messages</h1>
            <p style="color: #64748b; margin-bottom: 32px;">Chat with your clients</p>

            <div class="messages-container">
                <!-- Conversations List -->
                <div class="conversations-list">
                    <div class="conversations-header">
                        <h2>Conversations</h2>
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="Search conversations..." id="search-conversations">
                        </div>
                    </div>

                    <div class="conversations-body" id="conversations-container">
                        <div style="text-align: center; padding: 48px 20px;">
                            <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #cbd5e1;"></i>
                            <p style="color: #94a3b8; margin-top: 16px; font-size: 14px;">Loading...</p>
                        </div>
                    </div>
                </div>

                <!-- Chat Area -->
                <div class="chat-area" id="chat-area">
                    <div class="empty-chat">
                        <i class="fas fa-comments"></i>
                        <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">No Conversation Selected</h3>
                        <p>Select a conversation to start messaging</p>
                    </div>
                </div>
            </div>
        </div>
    </main>

    @include('components.profile-modal')

    @include('components.scripts')

    <script>
        let conversations = [];
        let currentConversation = null;

        document.addEventListener('DOMContentLoaded', function() {
            loadConversations();
        });

        // Load conversations
        async function loadConversations() {
            try {
                // Since there's no specific messages API, we'll use dashboard data
                const response = await fetch(`${API_BASE}/professional/dashboard`, {
                    method: 'GET',
                    headers: authHeaders
                });

                if (!response.ok) throw new Error('Failed to load conversations');

                const data = await response.json();
                conversations = data.messages || [];

                renderConversations(conversations);
            } catch (error) {
                console.error('Error loading conversations:', error);
                showEmptyConversations();
            }
        }

        // Render conversations list
        function renderConversations(convos) {
            const container = document.getElementById('conversations-container');

            if (convos.length === 0) {
                showEmptyConversations();
                return;
            }

            container.innerHTML = convos.map((convo, index) => `
                <div class="conversation-item ${index === 0 ? 'active' : ''}" onclick="openConversation(${convo.id || index})">
                    <div class="conversation-avatar">${convo.client_name ? convo.client_name.charAt(0).toUpperCase() : 'C'}</div>
                    <div class="conversation-details">
                        <div class="conversation-name">${convo.client_name || 'Client'}</div>
                        <div class="conversation-preview">${convo.last_message || 'No messages yet'}</div>
                    </div>
                    <div class="conversation-meta">
                        <div class="conversation-time">${convo.time || 'Now'}</div>
                        ${convo.unread ? `<span class="unread-badge">${convo.unread}</span>` : ''}
                    </div>
                </div>
            `).join('');

            // Auto-select first conversation
            if (convos.length > 0) {
                openConversation(convos[0].id || 0);
            }
        }

        // Open conversation
        function openConversation(id) {
            currentConversation = conversations.find(c => (c.id || 0) === id) || conversations[id];

            // Update active state
            document.querySelectorAll('.conversation-item').forEach(item => item.classList.remove('active'));
            event.target.closest('.conversation-item').classList.add('active');

            renderChatArea(currentConversation);
        }

        // Render chat area
        function renderChatArea(conversation) {
            const chatArea = document.getElementById('chat-area');
            const messages = conversation?.messages || [];

            chatArea.innerHTML = `
                <div class="chat-header">
                    <div class="chat-user-info">
                        <div class="conversation-avatar">${conversation.client_name ? conversation.client_name.charAt(0).toUpperCase() : 'C'}</div>
                        <div>
                            <div class="chat-user-name">${conversation.client_name || 'Client'}</div>
                            <div class="chat-user-status">Active now</div>
                        </div>
                    </div>
                    <button class="btn btn-outline">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                </div>

                <div class="chat-messages" id="chat-messages">
                    ${messages.length > 0 ? messages.map(msg => `
                        <div class="message ${msg.sender === 'me' ? 'sent' : 'received'}">
                            <div class="message-avatar">${msg.sender === 'me' ? 'M' : (conversation.client_name ? conversation.client_name.charAt(0).toUpperCase() : 'C')}</div>
                            <div class="message-content">
                                <div class="message-bubble">${msg.text}</div>
                                <div class="message-time">${msg.time || 'Just now'}</div>
                            </div>
                        </div>
                    `).join('') : '<div class="empty-chat"><i class="fas fa-comments"></i><p>No messages yet. Start the conversation!</p></div>'}
                </div>

                <div class="chat-input-area">
                    <div class="chat-input-container">
                        <textarea class="chat-input" id="message-input" placeholder="Type your message..." rows="1"></textarea>
                        <button class="send-btn" onclick="sendMessage()">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            `;

            // Scroll to bottom
            const messagesContainer = document.getElementById('chat-messages');
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }

        // Send message
        function sendMessage() {
            const input = document.getElementById('message-input');
            const message = input.value.trim();

            if (!message) return;

            // Add message to current conversation (demo)
            if (!currentConversation.messages) {
                currentConversation.messages = [];
            }

            currentConversation.messages.push({
                sender: 'me',
                text: message,
                time: 'Just now'
            });

            // Clear input and re-render
            input.value = '';
            renderChatArea(currentConversation);

            // In production, send to API here
            console.log('Sending message:', message);
        }

        // Show empty conversations
        function showEmptyConversations() {
            const container = document.getElementById('conversations-container');
            container.innerHTML = `
                <div style="text-align: center; padding: 48px 20px;">
                    <i class="fas fa-inbox" style="font-size: 48px; color: #cbd5e1; margin-bottom: 12px;"></i>
                    <p style="color: #94a3b8; font-size: 14px;">No conversations yet</p>
                </div>
            `;
        }

        // Search conversations
        document.getElementById('search-conversations')?.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            const filtered = conversations.filter(c =>
                (c.client_name || '').toLowerCase().includes(query)
            );
            renderConversations(filtered);
        });
    </script>
</body>

</html>