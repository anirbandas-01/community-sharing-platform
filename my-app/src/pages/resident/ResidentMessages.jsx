import { useState, useEffect } from 'react';
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Image, Smile } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import { Home, Users, Briefcase, Calendar, MessageCircle, Settings, User as UserIcon } from 'lucide-react';

const ResidentMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/resident/dashboard' },
    { icon: Users, label: 'My Communities', path: '/resident/communities' },
    { icon: Briefcase, label: 'Find Professionals', path: '/resident/professionals' },
    { icon: Calendar, label: 'My Bookings', path: '/resident/bookings' },
    { icon: MessageCircle, label: 'Messages', path: '/resident/messages' },
    { icon: UserIcon, label: 'Profile', path: '/resident/profile' },
    { icon: Settings, label: 'Settings', path: '/resident/settings' },
  ];

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
    }
  }, [selectedChat]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/messages/conversations');
      setConversations(response.data.conversations || []);
      if (response.data.conversations?.length > 0) {
        setSelectedChat(response.data.conversations[0]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await api.get(`/messages/conversations/${conversationId}`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      await api.post('/messages', {
        conversation_id: selectedChat.id,
        message: newMessage
      });
      setNewMessage('');
      fetchMessages(selectedChat.id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const displayConversations = conversations;
  const displayMessages = messages;

  const filteredConversations = displayConversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (time) => {
    return time;
  };

  return (
    <DashboardLayout menuItems={menuItems} userType="resident">
      <div className="h-[calc(100vh-12rem)]">
        <Card padding={false} className="h-full flex flex-col lg:flex-row overflow-hidden">
          {/* Conversations List */}
          <div className="w-full lg:w-80 border-r border-gray-200 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <Input
                icon={Search}
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No conversations found</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedChat(conv)}
                    className={`
                      p-4 border-b border-gray-100 cursor-pointer transition-colors
                      ${selectedChat?.id === conv.id ? 'bg-primary-50' : 'hover:bg-gray-50'}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
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

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{conv.user.name}</h3>
                          <span className="text-xs text-gray-500">{conv.last_message_time}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1 truncate">{conv.user.role}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500 truncate">{conv.last_message}</p>
                          {conv.unread_count > 0 && (
                            <Badge variant="primary" size="sm" className="ml-2">
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
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={selectedChat.user.avatar}
                        alt={selectedChat.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {selectedChat.user.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedChat.user.name}</h3>
                      <p className="text-sm text-gray-600">
                        {selectedChat.user.online ? 'Online' : 'Offline'} • {selectedChat.user.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 custom-scrollbar">
                  {displayMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`
                          max-w-xs lg:max-w-md px-4 py-2 rounded-2xl
                          ${msg.sender === 'me'
                            ? 'bg-primary-600 text-white rounded-br-none'
                            : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                          }
                        `}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.sender === 'me' ? 'text-primary-200' : 'text-gray-500'
                          }`}
                        >
                          {formatTime(msg.time)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                    <button
                      type="button"
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg mb-1"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg mb-1"
                    >
                      <Image className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        rows="1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg mb-1"
                    >
                      <Smile className="w-5 h-5" />
                    </button>
                    <Button
                      type="submit"
                      variant="primary"
                      className="mb-1"
                      disabled={!newMessage.trim()}
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Conversation Selected</h3>
                  <p className="text-gray-600">Choose a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ResidentMessages;