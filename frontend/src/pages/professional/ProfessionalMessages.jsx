import { useState, useEffect, useRef } from 'react';
import { Send, Search, MoreVertical, Phone, Video, Paperclip, Smile } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { Home, Briefcase, Calendar, MessageCircle, Users, TrendingUp, Settings, User as UserIcon } from 'lucide-react';

const ProfessionalMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/professional/dashboard' },
    { icon: Calendar, label: 'My Bookings', path: '/professional/bookings' },
    { icon: Briefcase, label: 'My Services', path: '/professional/services' },
    { icon: Users, label: 'My Groups', path: '/professional/groups' },
    { icon: MessageCircle, label: 'Messages', path: '/professional/messages' },
    { icon: TrendingUp, label: 'Analytics', path: '/professional/analytics' },
    { icon: UserIcon, label: 'Profile', path: '/professional/profile' },
    { icon: Settings, label: 'Settings', path: '/professional/settings' },
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoadingConversations(true);
      const response = await api.get('/messages/conversations');
      const convos = response.data.conversations || [];
      setConversations(convos);
      // Auto-select first conversation if available
      if (convos.length > 0 && !selectedConversation) {
        setSelectedConversation(convos[0]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      setLoadingMessages(true);
      const response = await api.get(`/messages/conversations/${conversationId}`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation || sending) return;

    try {
      setSending(true);
      const response = await api.post('/messages', {
        conversation_id: selectedConversation.id,
        message: messageText.trim(),
      });

      // Append the new message locally for instant feedback
      if (response.data.data) {
        setMessages(prev => [...prev, response.data.data]);
      }

      setMessageText('');

      // Refresh conversations to update last_message
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout menuItems={menuItems} userType="professional">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">Chat with your clients</p>
      </div>

      <Card className="h-[calc(100vh-280px)] min-h-[500px]">
        <div className="flex h-full -m-6 overflow-hidden rounded-xl">

          {/* Conversations List */}
          <div className="w-80 border-r border-gray-200 flex flex-col flex-shrink-0">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {loadingConversations ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-700 mb-1">No conversations yet</p>
                  <p className="text-xs text-gray-500">
                    When clients message you, conversations will appear here
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                      selectedConversation?.id === conv.id ? 'bg-primary-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={conv.user.avatar}
                          alt={conv.user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {conv.user.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate text-sm">{conv.user.name}</h3>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{conv.last_message_time}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">{conv.user.role}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">{conv.last_message}</p>
                          {conv.unread_count > 0 && (
                            <Badge variant="primary" size="sm" className="flex-shrink-0 ml-2">
                              {conv.unread_count}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={selectedConversation.user.avatar}
                        alt={selectedConversation.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {selectedConversation.user.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedConversation.user.name}</h3>
                      <p className="text-xs text-gray-500">
                        {selectedConversation.user.online ? 'Online' : 'Offline'} • {selectedConversation.user.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Phone className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Video className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No messages yet. Say hello!</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-md px-4 py-2 rounded-2xl ${
                            message.sender === 'me'
                              ? 'bg-primary-600 text-white'
                              : 'bg-white text-gray-900 border border-gray-200'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <span className={`text-xs mt-1 block ${
                            message.sender === 'me' ? 'text-primary-100' : 'text-gray-500'
                          }`}>
                            {message.time}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <button type="button" className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                      <Paperclip className="w-5 h-5 text-gray-600" />
                    </button>
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      disabled={sending}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 text-sm"
                    />
                    <button type="button" className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                      <Smile className="w-5 h-5 text-gray-600" />
                    </button>
                    <Button
                      type="submit"
                      variant="primary"
                      className="flex-shrink-0"
                      disabled={!messageText.trim() || sending}
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No conversation selected</h3>
                  <p className="text-gray-600">Choose a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </Card>
    </DashboardLayout>
  );
};

export default ProfessionalMessages;