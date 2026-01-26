// src/components/Navbar.jsx (Simplified)
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/auth';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = authService.isAuthenticated();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              LocalConnect
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600">
              About
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-blue-600">
              Services
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    authService.logout();
                    authService.clearAuthData();
                    window.location.href = '/';
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-blue-600 hover:text-blue-700">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="py-4 space-y-2">
              <Link to="/" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link to="/about" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                About
              </Link>
              <Link to="/services" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                Services
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      authService.logout();
                      authService.clearAuthData();
                      setIsOpen(false);
                      window.location.href = '/';
                    }}
                    className="block text-red-600 hover:text-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block text-blue-600 hover:text-blue-700" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;