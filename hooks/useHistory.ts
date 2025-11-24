import { useState, useEffect, useCallback } from 'react';
import { HistoryItem } from '../types';

const STORAGE_KEY = 'wa_direct_history';
const MAX_HISTORY = 10;

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const addToHistory = useCallback((phoneNumber: string, countryCode: string, note?: string) => {
    setHistory(prev => {
      // Remove duplicate phone numbers to keep list clean (move to top)
      const filtered = prev.filter(item => item.phoneNumber !== phoneNumber);
      
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        phoneNumber,
        countryCode,
        timestamp: Date.now(),
        note
      };
      
      const newHistory = [newItem, ...filtered].slice(0, MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  const deleteHistoryItem = useCallback((id: string) => {
    setHistory(prev => {
      const newHistory = prev.filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  return { history, addToHistory, clearHistory, deleteHistoryItem };
};