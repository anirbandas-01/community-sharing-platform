import { useState, useEffect, useRef } from 'react';
import {
  Search, Send, Phone, Video, MoreVertical, ArrowLeft,
  Users, MessageCircle, Home, Briefcase, Calendar,
  User as UserIcon, Settings, Star, Smile, Store,ShoppingCart
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../services/api';

const ResidentMessages = () => {
  const [conversations, setConversations]       = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages]                 = useState([]);
  const [newMessage, setNewMessage]             = useState('');
  const [searchTerm, setSearchTerm]             = useState('');
  const [searchResults, setSearchResults]       = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages]   = useState(false);
  const [sending, setSending]                   = useState(false);
  const [searching, setSearching]               = useState(false);
  const [error, setError]                       = useState(null);
  const [showSearch, setShowSearch]             = useState(false);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  const menuItems = [
    { icon: Home,          label: 'Dashboard',          path: '/resident/dashboard' },
    { icon: Users,         label: 'My Communities',     path: '/resident/communities' },
    { icon: Briefcase,     label: 'Find Professionals', path: '/resident/professionals' },
    { icon: Users,         label: 'Find Residents',     path: '/resident/find-residents' },
    { icon: Store, label: 'Shop', path: '/resident/shop' },
    { icon: ShoppingCart, label: 'My Orders', path: '/resident/my-orders' },
    { icon: Calendar,      label: 'My Bookings',        path: '/resident/bookings' },
    { icon: Star,          label: 'My Reviews',         path: '/resident/reviews' },
    { icon: MessageCircle, label: 'Messages',           path: '/resident/messages' },
    { icon: UserIcon,      label: 'Profile',            path: '/resident/profile' },
    { icon: Settings,      label: 'Settings',           path: '/resident/settings' },
  ];

  useEffect(() => {
    fetchConversations();
    // Poll for new messages every 10 s
    pollRef.current = setInterval(fetchConversations, 10000);
    return () => clearInterval(pollRef.current);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages/conversations');
      setConversations(res.data.conversations || []);
    } catch (err) {
      setError('Failed to load conversations.');
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      setLoadingMessages(true);
      const res = await api.get(`/messages/conversations/${conversationId}`);
      setMessages(res.data.messages || []);
    } catch {
      setError('Failed to load messages.');
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    fetchMessages(conv.id);
    // Mark as read
    /* api.put(`/messages/conversation/${conv.id}/read`).catch(() => {}); */
    setConversations(prev =>
      prev.map(c => c.id === conv.id ? { ...c, unread_count: 0 } : c)
    );
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return;
    const text = newMessage.trim();
    setNewMessage('');
    setSending(true);

    // Optimistic update
    const tempMsg = {
      id:         `temp-${Date.now()}`,
      content:    text,
      sender_id:  'me',
      created_at: new Date().toISOString(),
      is_mine:    true,
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      await api.post('/messages/send', {
        conversation_id: selectedConversation.id,
        content: text,
      });
      fetchMessages(selectedConversation.id);
    } catch {
      setError('Failed to send message.');
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
    } finally {
      setSending(false);
    }
  };

  // FIX: search ALL users (residents + professionals) not just /search/professionals
  const handleSearch = async (value) => {
    setSearchTerm(value);
    if (!value.trim()) { setSearchResults([]); return; }
    try {
      setSearching(true);
      // Try the general users search endpoint; fall back to professionals if needed
      const res = await api.get('/search/users', { params: { q: value } });
      setSearchResults(res.data.users || []);
    } catch {
      try {
        const res = await api.get('/search/professionals', { params: { q: value } });
        setSearchResults(res.data.professionals || []);
      } catch {
        setSearchResults([]);
      }
    } finally {
      setSearching(false);
    }
  };

  const handleStartConversation = async (recipient) => {
    try {
      const res = await api.post('/messages/start', { recipient_id: recipient.id });
      const conv = res.data.conversation;
      setConversations(prev => {
        const exists = prev.find(c => c.id === conv.id);
        return exists ? prev : [conv, ...prev];
      });
      setSelectedConversation(conv);
      fetchMessages(conv.id);
      setShowSearch(false);
      setSearchTerm('');
      setSearchResults([]);
    } catch {
      setError('Failed to start conversation.');
    }
  };

  const formatTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    const now = new Date();
    const diffDays = Math.floor((now - d) / 86400000);
    if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7)  return d.toLocaleDateString([], { weekday: 'short' });
    return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
  };

  const filteredConversations = conversations.filter(c =>
    c.other_user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.last_message?.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout menuItems={menuItems} userType="resident">
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-sm text-gray-500">
              {conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0)} unread
            </p>
          </div>
          <button
            onClick={() => setShowSearch(v => !v)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            <Search className="w-4 h-4" />
            New Message
          </button>
        </div>

        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between text-sm">
            <span className="text-red-700">{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 text-lg">×</button>
          </div>
        )}

        {/* New message search panel */}
        {showSearch && (
          <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <p className="text-sm font-medium text-gray-700 mb-2">Search residents or professionals</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                autoFocus
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Search by name…"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            {searching && (
              <p className="text-xs text-gray-500 mt-2">Searching…</p>
            )}
            {searchResults.length > 0 && (
              <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg bg-white divide-y divide-gray-100">
                {searchResults.map((user) => (
                  <button
                    key={user.id}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                    onClick={() => handleStartConversation(user)}
                  >
                    <img src={user.image || '/default-avatar.png'} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.role || user.profession || 'Resident'}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {!searching && searchTerm && searchResults.length === 0 && (
              <p className="text-xs text-gray-500 mt-2">No users found.</p>
            )}
          </div>
        )}

        {/* Main chat layout */}
        <div className="flex-1 flex gap-4 min-h-0">
          {/* Conversation list */}
          <div className={`w-full lg:w-80 flex-shrink-0 bg-white rounded-xl border border-gray-200 flex flex-col
            ${selectedConversation ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  placeholder="Search conversations…"
                  value={!showSearch ? searchTerm : ''}
                  onChange={(e) => !showSearch && setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingConversations ? (
                <div className="flex items-center justify-center h-32">
                  <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No conversations yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Click "New Message" to start chatting.</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full flex items-start gap-3 p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors text-left
                      ${selectedConversation?.id === conv.id ? 'bg-primary-50 border-l-2 border-l-primary-600' : ''}`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={conv.other_user?.image || '/default-avatar.png'}
                        alt={conv.other_user?.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {conv.other_user?.is_online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-sm font-semibold text-gray-900 truncate">{conv.other_user?.name}</p>
                        <span className="text-xs text-gray-400 flex-shrink-0">{formatTime(conv.last_message?.created_at)}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{conv.last_message?.content || 'No messages yet'}</p>
                    </div>
                    {conv.unread_count > 0 && (
                      <span className="flex-shrink-0 w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {conv.unread_count}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Message panel */}
          <div className={`flex-1 bg-white rounded-xl border border-gray-200 flex flex-col min-h-0
            ${selectedConversation ? 'flex' : 'hidden lg:flex'}`}>
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-sm text-gray-500">Choose from your conversations or start a new one</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                  <button className="lg:hidden p-1" onClick={() => setSelectedConversation(null)}>
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <img
                    src={selectedConversation.other_user?.image || '/default-avatar.png'}
                    alt={selectedConversation.other_user?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{selectedConversation.other_user?.name}</p>
                    <p className="text-xs text-gray-500">
                      {selectedConversation.other_user?.is_online ? '🟢 Online' : 'Offline'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Video className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-sm text-gray-500">No messages yet. Say hello! 👋</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.is_mine ? 'justify-end' : 'justify-start'}`}>
                        {!msg.is_mine && (
                          <img
                            src={selectedConversation.other_user?.image || '/default-avatar.png'}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover mr-2 flex-shrink-0 self-end"
                          />
                        )}
                        <div className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm
                          ${msg.is_mine
                            ? 'bg-primary-600 text-white rounded-br-sm'
                            : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                          }`}>
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.is_mine ? 'text-primary-200' : 'text-gray-400'}`}>
                            {formatTime(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Smile className="w-5 h-5" />
                    </button>
                    <input
                      className="flex-1 bg-transparent text-sm focus:outline-none placeholder-gray-400"
                      placeholder="Type a message…"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending}
                      className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white disabled:opacity-40 hover:bg-primary-700 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResidentMessages;