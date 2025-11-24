import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatForm } from './components/ChatForm';
import { HistoryList } from './components/HistoryList';
import { useHistory } from './hooks/useHistory';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const { history, addToHistory, clearHistory, deleteHistoryItem } = useHistory();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 transition-colors duration-200">
      <div className="w-full max-w-md space-y-6">
        <Header darkMode={darkMode} toggleTheme={toggleTheme} />
        
        <main className="space-y-6">
          <div className="bg-white dark:bg-wa-darkCard rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <ChatForm onChatStarted={addToHistory} />
          </div>

          <HistoryList 
            history={history} 
            onClear={clearHistory} 
            onDelete={deleteHistoryItem} 
          />
        </main>

        <footer className="text-center text-xs text-gray-500 dark:text-gray-400 mt-8">
          <p>This app runs in your browser. No data is sent to our servers.</p>
          <p className="mt-1">© {new Date().getFullYear()} WA Direct Connect</p>
        </footer>
      </div>
    </div>
  );
};

export default App;