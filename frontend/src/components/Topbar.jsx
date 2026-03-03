import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ title = 'Dashboard', user = null }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  // Sample notifications
  const notifications = [
    {
      id: 1,
      type: 'success',
      icon: '📦',
      title: 'New Order #1234',
      message: 'John Doe placed a new order of ₹1,250',
      time: '2 mins ago',
    },
    {
      id: 2,
      type: 'warning',
      icon: '⚠️',
      title: 'Low Stock Warning',
      message: 'Fresh Apples stock is running low (5 left)',
      time: '1 hour ago',
    },
    {
      id: 3,
      type: 'info',
      icon: '⭐',
      title: 'New Review',
      message: 'Sarah M. left a 5-star review',
      time: '3 hours ago',
    },
  ];

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="fixed top-0 right-0 left-[280px] bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between z-40">
      {/* Left side - Title & Breadcrumb */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">{title}</h1>
        <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
          <span>Business</span>
          <span>/</span>
          <span>{title}</span>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-12 pr-4 py-2.5 bg-slate-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-[300px]"
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-11 h-11 bg-slate-100 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all duration-300"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-[120%] right-0 w-[320px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
              <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <h4 className="font-black text-slate-900">Notifications</h4>
                <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                  {notifications.length} New
                </span>
              </div>

              <div className="max-h-[350px] overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="px-5 py-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">
                        {notif.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-bold text-slate-900 mb-1">{notif.title}</h5>
                        <p className="text-xs text-slate-600 line-clamp-2">{notif.message}</p>
                        <span className="text-xs text-slate-400 mt-1 block">{notif.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 text-center">
                <button className="text-indigo-600 font-bold text-sm hover:underline">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
              {getUserInitials()}
            </div>
            <div className="hidden md:block text-left">
              <div className="font-bold text-sm text-slate-900">{user?.name || 'User'}</div>
              <div className="text-xs text-slate-600 capitalize">{user?.user_type || 'Business'}</div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-600" />
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute top-[120%] right-0 w-[200px] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
              <button
                onClick={() => navigate('/profile')}
                className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center gap-3 text-sm font-semibold text-slate-700"
              >
                <User className="w-4 h-4" />
                My Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center gap-3 text-sm font-semibold text-red-600"
              >
                <User className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;