import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, MessageCircle } from 'lucide-react';

interface DashboardNavProps {
  onChatClick: () => void;
}

const DashboardNav: React.FC<DashboardNavProps> = ({ onChatClick }) => {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: History, label: 'History', path: '/history' },
  ];

  const actionItems = [
    { icon: MessageCircle, label: 'Gift Agent', action: onChatClick },
  ];

  const renderLink = (item: { icon: React.ElementType, label: string, path: string }, isAction = false) => {
    const isActive = !isAction && location.pathname === item.path;
    return (
      <Link
        key={item.path}
        to={item.path}
        className={`
          flex items-center px-3 py-2 text-sm font-medium rounded-md
          ${isActive 
            ? 'bg-gray-200 text-gray-900' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }
        `}
      >
        <item.icon className="w-5 h-5 mr-3" />
        <span>{item.label}</span>
      </Link>
    );
  };
  
  const renderButton = (item: { icon: React.ElementType, label: string, action: () => void }) => {
    return (
      <button
        key={item.label}
        onClick={item.action}
        className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        <item.icon className="w-5 h-5 mr-3" />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu</h3>
        <div className="mt-2 space-y-1">
          {navItems.map(item => renderLink(item))}
        </div>
      </div>
      <div>
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</h3>
        <div className="mt-2 space-y-1">
          {actionItems.map(item => renderButton(item))}
        </div>
      </div>
    </div>
  );
};

export default DashboardNav;