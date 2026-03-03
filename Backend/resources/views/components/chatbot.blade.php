<!-- Global Chatbot Widget -->
<div id="chatbot-box" style="position:fixed; bottom:20px; right:20px; width:350px; background:white; border:1px solid #e2e8f0; border-radius:16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); overflow:hidden; z-index:9999; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); color:white; padding:16px; display:flex; align-items:center; justify-content:space-between;">
        <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:40px; height:40px; background:rgba(255,255,255,0.2); border-radius:50%; display:flex; align-items:center; justify-content:center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </div>
            <div>
                <div style="font-weight:700; font-size:16px;">LocalHub AI</div>
                <div style="font-size:12px; opacity:0.9;">Online</div>
            </div>
        </div>
        <button onclick="toggleChatbot()" style="background:rgba(255,255,255,0.2); border:none; color:white; width:32px; height:32px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.3s;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    </div>

    <!-- Messages Area -->
    <div id="chat-messages" style="height:350px; overflow-y:auto; padding:16px; background:#f8fafc; display:flex; flex-direction:column; gap:12px;">
        <div style="display:flex; gap:10px; align-items:flex-start;">
            <div style="width:32px; height:32px; background:linear-gradient(135deg, #4f46e5, #7c3aed); border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; flex-shrink:0;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </div>
            <div style="background:white; padding:12px 16px; border-radius:12px; max-width:80%; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                <div style="font-weight:600; font-size:13px; color:#4f46e5; margin-bottom:4px;">LocalHub AI</div>
                <div style="font-size:14px; color:#0f172a; line-height:1.7;">Hello! I'm your LocalHub AI assistant. How can I help you today?</div>
            </div>
        </div>
    </div>

    <!-- Input Area -->
    <div style="padding:16px; background:white; border-top:1px solid #e2e8f0; display:flex; gap:8px;">
        <input type="text" id="chat-input" placeholder="Type your message..." style="flex:1; padding:12px 16px; border:1px solid #e2e8f0; border-radius:12px; font-size:14px; font-family: inherit; outline:none; transition:all 0.3s;" onfocus="this.style.borderColor='#4f46e5'" onblur="this.style.borderColor='#e2e8f0'">
        <button onclick="sendChatMessage()" style="background:linear-gradient(135deg, #4f46e5, #7c3aed); color:white; border:none; padding:12px 20px; border-radius:12px; cursor:pointer; font-weight:600; font-size:14px; transition:all 0.3s; display:flex; align-items:center; gap:6px; font-family: inherit;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            <span>Send</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
        </button>
    </div>
</div>

<!-- Chatbot Toggle Button (when minimized) -->
<button id="chatbot-toggle" onclick="toggleChatbot()" style="display:none; position:fixed; bottom:20px; right:20px; width:60px; height:60px; background:linear-gradient(135deg, #4f46e5, #7c3aed); color:white; border:none; border-radius:50%; cursor:pointer; box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3); z-index:9998; transition:all 0.3s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
</button>

<!-- Chatbot Styles -->
<style>
    @keyframes chatbot-bounce {

        0%,
        80%,
        100% {
            transform: scale(0);
        }

        40% {
            transform: scale(1);
        }
    }

    #chat-messages::-webkit-scrollbar {
        width: 6px;
    }

    #chat-messages::-webkit-scrollbar-track {
        background: #f1f5f9;
    }

    #chat-messages::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 3px;
    }

    #chat-messages::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
    }
</style>

<!-- Chatbot JavaScript -->
<script>
    let isChatbotOpen = true;

    function toggleChatbot() {
        const chatbox = document.getElementById('chatbot-box');
        const toggleBtn = document.getElementById('chatbot-toggle');

        if (isChatbotOpen) {
            chatbox.style.display = 'none';
            toggleBtn.style.display = 'flex';
            toggleBtn.style.alignItems = 'center';
            toggleBtn.style.justifyContent = 'center';
        } else {
            chatbox.style.display = 'block';
            toggleBtn.style.display = 'none';
        }

        isChatbotOpen = !isChatbotOpen;
    }

    async function sendChatMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();

        if (!message) return;

        const chatBox = document.getElementById('chat-messages');

        // Add user message
        const userMessageHTML = `
            <div style="display:flex; gap:10px; align-items:flex-start; justify-content:flex-end;">
                <div style="background:linear-gradient(135deg, #4f46e5, #7c3aed); color:white; padding:12px 16px; border-radius:12px; max-width:80%; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                    <div style="font-weight:600; font-size:13px; margin-bottom:4px; opacity:0.9;">You</div>
                    <div style="font-size:14px; line-height:1.5;">${escapeHtml(message)}</div>
                </div>
                <div style="width:32px; height:32px; background:#e2e8f0; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#64748b; flex-shrink:0; font-weight:700; font-size:14px;">
                    U
                </div>
            </div>
        `;
        chatBox.innerHTML += userMessageHTML;

        // Clear input
        input.value = '';

        // Scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;

        // Show typing indicator
        const typingHTML = `
            <div id="typing-indicator" style="display:flex; gap:10px; align-items:flex-start;">
                <div style="width:32px; height:32px; background:linear-gradient(135deg, #4f46e5, #7c3aed); border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; flex-shrink:0;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div>
                <div style="background:white; padding:12px 16px; border-radius:12px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                    <div style="display:flex; gap:4px;">
                        <div style="width:8px; height:8px; background:#4f46e5; border-radius:50%; animation:chatbot-bounce 1.4s infinite ease-in-out both;"></div>
                        <div style="width:8px; height:8px; background:#4f46e5; border-radius:50%; animation:chatbot-bounce 1.4s infinite ease-in-out both; animation-delay:0.16s;"></div>
                        <div style="width:8px; height:8px; background:#4f46e5; border-radius:50%; animation:chatbot-bounce 1.4s infinite ease-in-out both; animation-delay:0.32s;"></div>
                    </div>
                </div>
            </div>
        `;
        chatBox.innerHTML += typingHTML;
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
            // Send to API
            const res = await fetch('/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '{{ csrf_token() }}'
                },
                body: JSON.stringify({
                    message: message
                })
            });

            const data = await res.json();

            // Remove typing indicator
            const typingIndicator = document.getElementById('typing-indicator');
            if (typingIndicator) typingIndicator.remove();

            if (data.error) {
                throw new Error(data.error);
            }

            // Add bot response
            const reply = data.choices[0].message.content;
            const botMessageHTML = `
                <div style="display:flex; gap:10px; align-items:flex-start;">
                    <div style="width:32px; height:32px; background:linear-gradient(135deg, #4f46e5, #7c3aed); border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; flex-shrink:0;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </div>
                    <div style="background:white; padding:12px 16px; border-radius:12px; max-width:80%; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                        <div style="font-weight:600; font-size:13px; color:#4f46e5; margin-bottom:4px;">LocalHub AI</div>
                        <div style="font-size:14px; color:#0f172a; line-height:1.7;">${formatMessage(reply)}</div>
                    </div>
                </div>
            `;
            chatBox.innerHTML += botMessageHTML;

        } catch (error) {
            // Remove typing indicator
            const typingIndicator = document.getElementById('typing-indicator');
            if (typingIndicator) typingIndicator.remove();

            // Show error message
            const errorHTML = `
                <div style="display:flex; gap:10px; align-items:flex-start;">
                    <div style="width:32px; height:32px; background:linear-gradient(135deg, #ef4444, #dc2626); border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; flex-shrink:0;">!</div>
                    <div style="background:#fee2e2; padding:12px 16px; border-radius:12px; max-width:80%; border:1px solid #fecaca;">
                        <div style="font-weight:600; font-size:13px; color:#991b1b; margin-bottom:4px;">Error</div>
                        <div style="font-size:14px; color:#991b1b; line-height:1.5;">Sorry, I couldn't process your request. Please try again.</div>
                    </div>
                </div>
            `;
            chatBox.innerHTML += errorHTML;
        }

        // Scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Helper function to escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Format message with markdown-like styling
    function formatMessage(text) {
        // Escape HTML first
        let formatted = escapeHtml(text);

        // Convert **bold** to <strong>
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Convert *italic* to <em>
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Convert [text](url) to links
        formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:#2563eb; text-decoration:underline;">$1</a>');

        // Convert line breaks
        formatted = formatted.replace(/\n/g, '<br>');

        // Convert numbered lists (1. 2. 3.)
        formatted = formatted.replace(/^(\d+)\.\s+(.+)$/gm, '<div style="margin-left:16px; margin-top:4px;">$1. $2</div>');

        // Convert bullet points (- or *)
        formatted = formatted.replace(/^[-*]\s+(.+)$/gm, '<div style="margin-left:16px; margin-top:4px;">• $1</div>');

        // Convert ### headers
        formatted = formatted.replace(/^###\s+(.+)$/gm, '<div style="font-weight:600; margin-top:12px; margin-bottom:4px; font-size:15px;">$1</div>');

        return formatted;
    }

    // Allow sending message with Enter key
    document.addEventListener('DOMContentLoaded', function() {
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendChatMessage();
                }
            });
        }
    });
</script>