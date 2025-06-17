import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, History } from 'lucide-react';

const DashboardNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: History, label: 'History', path: '/dashboard/history' },
  ];

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex items-center px-3 py-2 text-sm font-medium rounded-md
              ${isActive 
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            <item.icon className="w-4 h-4 mr-3" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default DashboardNav;