import React, { useState } from 'react';
import { Moon, Sun, Globe, Settings } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../data/translations';

const ThemeSelector: React.FC = () => {
  const { theme, language, toggleTheme, setLanguage } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const t = translations[language];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Settings"
      >
        <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 space-y-4">
            {/* Theme Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                {t.lightTheme}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    if (theme !== 'light') toggleTheme();
                    setIsOpen(false);
                  }}
                  className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 transition-all ${
                    theme === 'light'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <Sun className="h-5 w-5 text-yellow-500" />
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.lightTheme}
                  </span>
                </button>
                <button
                  onClick={() => {
                    if (theme !== 'dark') toggleTheme();
                    setIsOpen(false);
                  }}
                  className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 transition-all ${
                    theme === 'dark'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <Moon className="h-5 w-5 text-blue-500" />
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.darkTheme}
                  </span>
                </button>
              </div>
            </div>

            {/* Language Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Langue
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setLanguage('fr');
                    setIsOpen(false);
                  }}
                  className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 transition-all ${
                    language === 'fr'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <Globe className="h-5 w-5 text-blue-600" />
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.french}
                  </span>
                </button>
                <button
                  onClick={() => {
                    setLanguage('en');
                    setIsOpen(false);
                  }}
                  className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 transition-all ${
                    language === 'en'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <Globe className="h-5 w-5 text-green-600" />
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.english}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ThemeSelector; 