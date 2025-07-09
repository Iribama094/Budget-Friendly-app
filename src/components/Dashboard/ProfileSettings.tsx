import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, BellIcon, ClockIcon, TagIcon, MoonIcon, FileTextIcon, MailIcon, AlertTriangleIcon, ChevronRightIcon, LogOutIcon, HelpCircleIcon } from 'lucide-react';
interface ProfileSettingsProps {
  onBack: () => void;
}
export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  onBack
}) => {
  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [autoCategories, setAutoCategories] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [weeklySummaries, setWeeklySummaries] = useState(true);
  const [overspendAlerts, setOverspendAlerts] = useState(true);
  // Mock user data
  const user = {
    name: 'Samuel Okonkwo',
    email: 'samuel@example.com',
    netWorth: 1250000,
    currency: '₦'
  };
  // Toggle function
  const handleToggle = (setting: string, value: boolean) => {
    switch (setting) {
      case 'notifications':
        setNotifications(value);
        break;
      case 'reminders':
        setReminders(value);
        break;
      case 'autoCategories':
        setAutoCategories(value);
        break;
      case 'darkMode':
        setDarkMode(value);
        break;
      case 'weeklySummaries':
        setWeeklySummaries(value);
        break;
      case 'overspendAlerts':
        setOverspendAlerts(value);
        break;
    }
  };
  return <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mr-4" onClick={onBack}>
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Profile & Settings
          </h1>
        </div>
        {/* Profile Card */}
        <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>
          </div>
          <div className="mt-5 pt-5 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Net Worth</p>
              <p className="text-xl font-bold text-gray-800">
                {user.currency}
                {user.netWorth.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <h3 className="text-lg font-medium text-gray-800 p-5 border-b border-gray-100">
            General Settings
          </h3>
          <div className="divide-y divide-gray-100">
            {/* Notifications */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <BellIcon className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-800">Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notifications} onChange={e => handleToggle('notifications', e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            {/* Reminders */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <ClockIcon className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-800">Reminders</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={reminders} onChange={e => handleToggle('reminders', e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            {/* Auto-Categorize */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                  <TagIcon className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-gray-800">Auto-Categorize</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={autoCategories} onChange={e => handleToggle('autoCategories', e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            {/* Dark Mode */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <MoonIcon className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-gray-800">Dark Mode</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={e => handleToggle('darkMode', e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>
        {/* Smart Options */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <h3 className="text-lg font-medium text-gray-800 p-5 border-b border-gray-100">
            Smart Options
          </h3>
          <div className="divide-y divide-gray-100">
            {/* Weekly Summaries */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <MailIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <span className="text-gray-800 block">
                    Send me weekly summaries
                  </span>
                  <span className="text-gray-500 text-sm">
                    Receive a report every Sunday
                  </span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={weeklySummaries} onChange={e => handleToggle('weeklySummaries', e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            {/* Overspend Alerts */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                  <AlertTriangleIcon className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <span className="text-gray-800 block">
                    Alert me when I overspend
                  </span>
                  <span className="text-gray-500 text-sm">
                    Get notified when exceeding category budget
                  </span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={overspendAlerts} onChange={e => handleToggle('overspendAlerts', e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>
        {/* Data Options */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <h3 className="text-lg font-medium text-gray-800 p-5 border-b border-gray-100">
            Data Options
          </h3>
          <div className="divide-y divide-gray-100">
            {/* Connect Bank */}
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <div className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-800">Connect Bank Account</span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </button>
            {/* Export Data */}
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <FileTextIcon className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-800">Export Data (CSV/PDF)</span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
        {/* Support & Logout */}
        <div className="space-y-3 mb-6">
          <button className="w-full flex items-center p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <HelpCircleIcon className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-gray-800">Help & Support</span>
          </button>
          <button className="w-full flex items-center p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
              <LogOutIcon className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-gray-800">Log Out</span>
          </button>
        </div>
        <p className="text-center text-gray-500 text-sm">
          BudgetFriendly v1.0.0
        </p>
      </div>
    </div>;
};