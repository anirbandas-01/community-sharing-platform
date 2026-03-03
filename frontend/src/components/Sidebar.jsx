import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Briefcase,
  Calendar,
  DollarSign,
  Mail,
  Settings,
  LogOut,
  Building2,
  FileText,
  ShoppingBag,
  Package,
  Star,
} from 'lucide-react';

const Sidebar = ({ userType = 'business' }) => {
  const location = useLocation();

  // Menu items based on user type
  const menuItems = {
    business: [
      {
        section: 'Main',
        items: [
          { path: '/business/dashboard', icon: Home, label: 'Dashboard' },
          { path: '/business/orders', icon: ShoppingBag, label: 'Orders', badge: '5' },
          { path: '/business/inventory', icon: Package, label: 'Inventory' },
        ],
      },
      {
        section: 'Business',
        items: [
          { path: '/business/profile', icon: Building2, label: 'Profile' },
          { path: '/business/enterprise', icon: FileText, label: 'Register Enterprise' },
          { path: '/business/revenue', icon: DollarSign, label: 'Revenue' },
          { path: '/business/contact', icon: Mail, label: 'Contact Us' },
        ],
      },
      {
        section: 'Settings',
        items: [
          { path: '/business/settings', icon: Settings, label: 'Settings' },
          { path: '/logout', icon: LogOut, label: 'Logout' },
        ],
      },
    ],
    professional: [
      {
        section: 'Main',
        items: [
          { path: '/professional/dashboard', icon: Home, label: 'Dashboard' },
          { path: '/professional/services', icon: Briefcase, label: 'My Services' },
          { path: '/professional/appointments', icon: Calendar, label: 'Appointments' },
          { path: '/professional/earnings', icon: DollarSign, label: 'Earnings' },
          { path: '/professional/reviews', icon: Star, label: 'Reviews' },
          { path: '/professional/messages', icon: Mail, label: 'Messages' },
        ],
      },
      {
        section: 'Settings',
        items: [
          { path: '/professional/settings', icon: Settings, label: 'Settings' },
          { path: '/logout', icon: LogOut, label: 'Logout' },
        ],
      },
    ],
    resident: [
      {
        section: 'Main',
        items: [
          { path: '/resident/dashboard', icon: Home, label: 'Dashboard' },
          { path: '/resident/services', icon: Briefcase, label: 'Find Services' },
          { path: '/resident/bookings', icon: Calendar, label: 'My Bookings' },
          { path: '/resident/messages', icon: Mail, label: 'Messages' },
        ],
      },
      {
        section: 'Account',
        items: [
          { path: '/resident/profile', icon: Settings, label: 'My Profile' },
          { path: '/logout', icon: LogOut, label: 'Logout' },
        ],
      },
    ],
  };

  const items = menuItems[userType] || menuItems.business;

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[280px] bg-gradient-to-b from-[#1e293b] to-[#0f172a] pt-8 overflow-y-auto transition-transform duration-300 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-4 px-8 mb-12 no-underline">
        <div className="w-[50px] h-[50px] bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center transform -rotate-6">
          <Building2 className="w-7 h-7 text-white transform rotate-6" />
        </div>
        <div>
          <div className="text-white text-2xl font-black">LocalHub</div>
          <div className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded font-bold mt-1 inline-block">
            {userType.toUpperCase()}
          </div>
        </div>
      </Link>

      {/* Navigation Menu */}
      <nav>
        {items.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.section && (
              <div className="px-8 text-slate-500 text-xs font-bold uppercase tracking-wider mt-8 mb-4">
                {section.section}
              </div>
            )}
            <ul className="list-none">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <li key={itemIndex} className="mx-4 my-1">
                    <Link
                      to={item.path}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 no-underline font-semibold ${
                        active
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;