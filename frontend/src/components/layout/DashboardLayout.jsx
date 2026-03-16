import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, Search, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const DashboardLayout = ({ children, menuItems = [], userType = 'resident' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  const typeColors = {
    resident: 'from-blue-500 to-cyan-500',
    professional: 'from-purple-500 to-pink-500',
    business: 'from-orange-500 to-red-500',
    admin: 'from-gray-700 to-gray-900',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 w-64 bg-white border-r border-gray-200
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <Link to="/" className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${typeColors[userType]} flex items-center justify-center`}>
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">LocalHub</h2>
                <span className="text-xs text-gray-500 uppercase tracking-wide">{userType}</span>
              </div>
            </Link>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={idx}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${active
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Search Bar */}
              <div className="flex-1 max-w-2xl mx-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
                  >
                  {user?.profile_image  && user.profile_image !== 'null' && user.profile_image !== ''? (
                          <img
                            src={ user.profile_image.startsWith('http') 
                            ? user.profile_image 
                            : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://127.0.0.1:8000'}${user.profile_image}`
                             }
                            alt={user?.name || "user"}
                            className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                            onError={(e) => {
                            // If image fails to load, hide it and show initials
                            console.error('Failed to load profile image:', user.profile_image);
                            e.target.style.display = 'none';
                            const fallback = e.target.parentElement.querySelector('.profile-fallback');
                            if (fallback) fallback.style.display = 'flex';
                          }}
                          />
                        ) : null }
                        {/* Fallback Initials */}
                       <div 
                            className={`profile-fallback w-8 h-8 rounded-full bg-gradient-to-br ${typeColors[userType]} flex items-center justify-center text-white font-medium text-sm`}
                            style={{ display: (user?.profile_image && user.profile_image !== 'null' && user.profile_image !== '') ? 'none' : 'flex' }}
                            >
                            {getInitials(user?.name)}
                       </div>
                       <div className="hidden sm:block text-left">
                         <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                         <p className="text-xs text-gray-500 capitalize">{user?.user_type || userType}</p>
                       </div>
                  </button>

                  {/* Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                      <Link
                        to={`/${userType}/profile`}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link
                        to={`/${userType}/settings`}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;