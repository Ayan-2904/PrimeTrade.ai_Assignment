import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Task Manager
            </Link>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FiUser className="text-gray-600" />
                <span className="text-gray-700">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;