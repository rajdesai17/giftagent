import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, History } from 'lucide-react';

interface NavigationProps {
  currentPath: string;
}

export default function Navigation({ currentPath }: NavigationProps) {
  const tabs = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/history', label: 'History', icon: History }
  ];

  return (
    <nav className="flex space-x-1 bg-gray-50 p-1 rounded-2xl">
      {tabs.map(({ path, label, icon: Icon }) => {
        const isActive = currentPath === path;
        return (
          <Link
            key={path}
            to={path}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              isActive
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}