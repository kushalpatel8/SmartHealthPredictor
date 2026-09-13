import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Image as ImageIcon } from 'lucide-react';

function Sidebar() {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Patients', path: '/patients', icon: <Users size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <FileText size={20} /> },
    { name: 'Risk Prediction', path: '/prediction', icon: <FileText size={20} /> },
    { name: 'Symptom Checker', path: '/symptom-checker', icon: <FileText size={20} /> },
    { name: 'Image Analysis', path: '/image-analysis', icon: <ImageIcon size={20} /> },
  ];

  return (
    <aside className="w-64 glass-panel dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 hidden md:flex flex-col">
      <div className="flex-1 py-6 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-white'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </div>
      
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-1">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-white transition-colors"
        >
          <Settings size={20} />
          Settings
        </NavLink>
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
