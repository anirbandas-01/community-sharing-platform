import { useState, useEffect } from "react";
import ProfessionalLayout from "../../components/professional/ProfessionalLayout";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const ProfessionalMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/professional/messages/conversations`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to load conversations");

      const data = await response.json();
      setConversations(data.conversations || []);
      
      // Auto-select first conversation if exists
      if (data.conversations && data.conversations.length > 0) {
        selectConversation(data.conversations[0]);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    await loadMessages(conversation.id);
  };

  const loadMessages = async (conversationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/professional/messages/conversations/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to load messages");

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessages([]);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSendingMessage(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/professional/messages/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation_id: selectedConversation.id,
          message: newMessage,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();
      
      // Add new message to the list
      setMessages([...messages, data.message]);
      setNewMessage("");
      
      // Update conversation's last message
      const updatedConversations = conversations.map((conv) =>
        conv.id === selectedConversation.id
          ? { ...conv, last_message: newMessage, updated_at: new Date().toISOString() }
          : conv
      );
      setConversations(updatedConversations);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "C";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (datetime) => {
    if (!datetime) return "";
    const date = new Date(datetime);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  if (loading) {
    return (
      <ProfessionalLayout>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading messages...</p>
        </div>
      </ProfessionalLayout>
    );
  }

  return (
    <ProfessionalLayout>
      <div className="page-header">
        <h1 className="page-title">Messages</h1>
        <p className="page-subtitle">Communicate with your clients</p>
      </div>

      <div className="messages-container">
        {/* Conversations List */}
        <div className="conversations-sidebar">
          <div className="conversations-header">
            <h3>Conversations</h3>
            <span className="conversation-count">{conversations.length}</span>
          </div>

          {conversations.length === 0 ? (
            <div className="empty-conversations">
              <i className="fas fa-inbox"></i>
              <p>No conversations yet</p>
            </div>
          ) : (
            <div className="conversations-list">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${
                    selectedConversation?.id === conversation.id ? "active" : ""
                  }`}
                  onClick={() => selectConversation(conversation)}
                >
                  <div className="conversation-avatar">
                    {getInitials(conversation.client_name)}
                  </div>
                  <div className="conversation-details">
                    <div className="conversation-name">
                      {conversation.client_name || "Client"}
                    </div>
                    <div className="conversation-preview">
                      {conversation.last_message || "No messages yet"}
                    </div>
                  </div>
                  <div className="conversation-meta">
                    <div className="conversation-time">
                      {formatTime(conversation.updated_at)}
                    </div>
                    {conversation.unread_count > 0 && (
                      <div className="unread-badge">{conversation.unread_count}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className="messages-content">
          {!selectedConversation ? (
            <div className="no-conversation-selected">
              <i className="fas fa-comments"></i>
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the list to start messaging</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-avatar">
                  {getInitials(selectedConversation.client_name)}
                </div>
                <div className="chat-info">
                  <h3>{selectedConversation.client_name || "Client"}</h3>
                  <p className="chat-service">
                    {selectedConversation.service_name || "Service"}
                  </p>
                </div>
              </div>

              {/* Messages List */}
              <div className="messages-list">
                {messages.length === 0 ? (
                  <div className="no-messages">
                    <i className="fas fa-comment"></i>
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`message ${
                        message.sender_type === "professional" ? "sent" : "received"
                      }`}
                    >
                      <div className="message-bubble">
                        <div className="message-text">{message.message}</div>
                        <div className="message-time">
                          {formatTime(message.created_at)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} className="message-input-form">
                <input
                  type="text"
                  className="message-input"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={sendingMessage}
                />
                <button
                  type="submit"
                  className="send-btn"
                  disabled={sendingMessage || !newMessage.trim()}
                >
                  {sendingMessage ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fas fa-paper-plane"></i>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </ProfessionalLayout>
  );
};

export default ProfessionalMessages;