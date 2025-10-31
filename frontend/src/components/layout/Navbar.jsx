import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="text-xl font-bold text-primary-600">
              Assignment Manager
            </Link>
          </div>

          {user && (
            <div className="flex items-center gap-6">
              {user.role === 'student' && (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-primary-600">
                    Dashboard
                  </Link>
                </>
              )}

              {user.role === 'admin' && (
                <>
                  <Link to="/admin" className="text-gray-700 hover:text-primary-600">
                    Dashboard
                  </Link>
                </>
              )}

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-700"
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