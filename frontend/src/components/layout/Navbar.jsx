import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) => 
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive(path)
        ? 'bg-blue-50 text-blue-700'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to={user?.role === 'admin' ? '/admin' : '/dashboard'} 
              className="flex items-center gap-2 text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Assignment Manager</span>
            </Link>
          </div>

          {user && (
            <div className="flex items-center gap-6">
              {user.role === 'student' && (
                <div className="flex items-center gap-2">
                  <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                    Dashboard
                  </Link>
                  <Link to="/assignments" className={navLinkClass('/assignments')}>
                    Assignments
                  </Link>
                  <Link to="/groups" className={navLinkClass('/groups')}>
                    My Groups
                  </Link>
                  <Link to="/submissions" className={navLinkClass('/submissions')}>
                    Submissions
                  </Link>
                </div>
              )}

              {user.role === 'admin' && (
                <div className="flex items-center gap-2">
                  <Link to="/admin" className={navLinkClass('/admin')}>
                    Dashboard
                  </Link>
                  <Link to="/admin/assignments" className={navLinkClass('/admin/assignments')}>
                    Assignments
                  </Link>
                  <Link to="/admin/groups" className={navLinkClass('/admin/groups')}>
                    Groups
                  </Link>
                </div>
              )}

              <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm hover:shadow"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}