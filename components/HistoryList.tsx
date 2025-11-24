import React from 'react';
import { HistoryItem } from '../types';

interface HistoryListProps {
  history: HistoryItem[];
  onClear: () => void;
  onDelete: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onClear, onDelete }) => {
  if (history.length === 0) return null;

  const handleResume = (item: HistoryItem) => {
    const fullNumber = `${item.countryCode.replace('+', '')}${item.phoneNumber}`;
    const baseUrl = `https://wa.me/${fullNumber}`;
    window.open(baseUrl, '_blank');
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Recent
        </h3>
        <button 
          onClick={onClear}
          className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-2">
        {history.map((item) => (
          <div 
            key={item.id}
            className="group flex items-center justify-between p-3 bg-white dark:bg-wa-darkCard border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <button 
              onClick={() => handleResume(item)}
              className="flex-1 flex flex-col items-start text-left"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-gray-800 dark:text-gray-200 font-medium">
                  {item.countryCode} {item.phoneNumber}
                </span>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {new Date(item.timestamp).toLocaleDateString()}
              </span>
            </button>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => handleResume(item)}
                    className="p-2 text-wa-teal hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full transition-colors"
                    aria-label="Chat again"
                >
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
                <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    aria-label="Delete"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};