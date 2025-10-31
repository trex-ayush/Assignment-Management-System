import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  if (!user) return null;

  const studentNavigation = [
    { name: 'Dashboard', path: '/dashboard' },
  ];

  const adminNavigation = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Create Course', path: '/admin/courses/create' },
  ];

  const navigation = user.role === 'admin' ? adminNavigation : studentNavigation;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to={user.role === 'admin' ? '/admin' : '/dashboard'} 
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <p className="text-lg font-bold text-gray-900 leading-tight">Assignment Manager</p>
              <p className="text-xs text-gray-500 capitalize">{user.role} Portal</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="ml-3 pl-3 border-l border-gray-300 relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors duration-200 group"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm group-hover:shadow-md transition-shadow">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 z-20 border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-primary-600 capitalize font-medium">{user.role}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 ml-13">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors duration-150 font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="px-4 py-4 border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white">
            <div className="flex items-center space-x-3 mb-3 px-2">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                <p className="text-xs text-primary-600 mt-0.5 capitalize font-medium">{user.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-white hover:bg-red-50 rounded-lg border border-red-200 shadow-sm hover:shadow transition-all duration-150"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}