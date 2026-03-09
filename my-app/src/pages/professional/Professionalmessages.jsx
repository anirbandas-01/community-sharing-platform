import { useState } from 'react';
import { Send, Search, MoreVertical, Phone, Video, Paperclip, Smile } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Home, Briefcase, Calendar, MessageCircle, Users, TrendingUp, Settings, User as UserIcon } from 'lucide-react';

const ProfessionalMessages = () => {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/professional/dashboard' },
    { icon: Calendar, label: 'My Bookings', path: '/professional/bookings', badge: '8' },
    { icon: Briefcase, label: 'My Services', path: '/professional/services' },
    { icon: Users, label: 'My Groups', path: '/professional/groups' },
    { icon: MessageCircle, label: 'Messages', path: '/professional/messages', badge: '12' },
    { icon: TrendingUp, label: 'Analytics', path: '/professional/analytics' },
    { icon: UserIcon, label: 'Profile', path: '/professional/profile' },
    { icon: Settings, label: 'Settings', path: '/professional/settings' },
  ];

  const conversations = [
    {
      id: 1,
      name: 'Sarah Wilson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      lastMessage: 'Thanks for the quick service!',
      timestamp: '2 min ago',
      unread: 2,
      online: true,
      type: 'client'
    },
    {
      id: 2,
      name: 'David Brown',
      avatar: 'https://i.pravatar.cc/150?img=2',
      lastMessage: 'When can you come for the repair?',
      timestamp: '1 hour ago',
      unread: 0,
      online: false,
      type: 'client'
    },
    {
      id: 3,
      name: 'Lisa Anderson',
      avatar: 'https://i.pravatar.cc/150?img=3',
      lastMessage: 'Great work! Highly recommend',
      timestamp: '3 hours ago',
      unread: 0,
      online: true,
      type: 'client'
    },
  ];

  const messages = [
    {
      id: 1,
      senderId: 1,
      text: 'Hi! I need plumbing service for my apartment',
      timestamp: '10:30 AM',
      isMine: false
    },
    {
      id: 2,
      senderId: 'me',
      text: 'Hello! Sure, I can help. What kind of issue are you facing?',
      timestamp: '10:32 AM',
      isMine: true
    },
    {
      id: 3,
      senderId: 1,
      text: 'The kitchen sink is leaking badly',
      timestamp: '10:33 AM',
      isMine: false
    },
    {
      id: 4,
      senderId: 'me',
      text: 'I can come tomorrow at 10 AM. Does that work for you?',
      timestamp: '10:35 AM',
      isMine: true
    },
    {
      id: 5,
      senderId: 1,
      text: 'Perfect! See you then',
      timestamp: '10:36 AM',
      isMine: false
    },
    {
      id: 6,
      senderId: 'me',
      text: 'Great! I\'ll bring all necessary tools',
      timestamp: '10:37 AM',
      isMine: true
    },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    console.log('Sending message:', messageText);
    setMessageText('');
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout menuItems={menuItems} userType="professional">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">Chat with your clients</p>
      </div>

      <Card className="h-[calc(100vh-280px)]">
        <div className="flex h-full">
          <div className="w-80 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                    selectedConversation === conv.id ? 'bg-primary-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={conv.avatar}
                        alt={conv.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {conv.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{conv.name}</h3>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{conv.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <Badge variant="primary" size="sm" className="flex-shrink-0 mt-1">
                        {conv.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {selectedConv ? (
              <>
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={selectedConv.avatar}
                        alt={selectedConv.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {selectedConv.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedConv.name}</h3>
                      <p className="text-xs text-gray-500">
                        {selectedConv.online ? 'Online' : 'Offline'}
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

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md px-4 py-2 rounded-2xl ${
                          message.isMine
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <span
                          className={`text-xs mt-1 block ${
                            message.isMine ? 'text-primary-100' : 'text-gray-500'
                          }`}
                        >
                          {message.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-200 bg-white">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Paperclip className="w-5 h-5 text-gray-600" />
                    </button>
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Smile className="w-5 h-5 text-gray-600" />
                    </button>
                    <Button type="submit" variant="primary" className="flex-shrink-0">
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