import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Gift, User, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {isDashboard && (
              <Link 
                to="/"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Home
              </Link>
            )}
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gray-900 p-2 rounded-lg">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">GiftAgent</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="flex items-center text-gray-700">
                  <User className="w-4 h-4 mr-2" />
                  {user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={LogOut}
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="primary" size="sm">
                  Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;