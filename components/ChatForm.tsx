import React, { useState, useMemo } from 'react';
import { ALL_COUNTRIES } from '../constants';
import { refineMessageWithAI } from '../services/geminiService';

interface ChatFormProps {
  onChatStarted: (phone: string, countryCode: string, note?: string) => void;
}

export const ChatForm: React.FC<ChatFormProps> = ({ onChatStarted }) => {
  const [countryCode, setCountryCode] = useState('+971');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  // Find the selected country object for display
  const selectedCountry = useMemo(() => 
    ALL_COUNTRIES.find(c => c.dial_code === countryCode) || ALL_COUNTRIES[0], 
  [countryCode]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const val = e.target.value.replace(/\D/g, '');
    setPhoneNumber(val);
    setError('');
  };

  const clearPhone = () => {
    setPhoneNumber('');
    setError('');
  };

  const handleAIMessage = async (tone: 'professional' | 'casual' | 'flirty') => {
    if (!message.trim()) {
      setError("Please type a rough draft first.");
      return;
    }
    
    setIsGenerating(true);
    const refined = await refineMessageWithAI(message, tone);
    setMessage(refined);
    setIsGenerating(false);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber || phoneNumber.length < 5) {
      setError("Please enter a valid phone number.");
      return;
    }

    const fullNumber = `${countryCode.replace('+', '')}${phoneNumber}`;
    
    // Save to history
    onChatStarted(phoneNumber, countryCode, message);

    // Construct URL
    const baseUrl = `https://wa.me/${fullNumber}`;
    const url = message 
      ? `${baseUrl}?text=${encodeURIComponent(message)}`
      : baseUrl;

    window.open(url, '_blank');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      
      {/* Phone Input Section */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
          Phone Number
        </label>
        <div className="flex gap-2">
          <div className="relative w-1/3">
             <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full h-12 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-wa-teal focus:border-transparent outline-none appearance-none text-gray-900 dark:text-gray-100"
            >
              {ALL_COUNTRIES.map((country) => (
                <option key={`${country.code}-${country.dial_code}`} value={country.dial_code}>
                  {country.code} {country.dial_code}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          
          <div className="relative w-2/3">
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="123 456 7890"
              className="w-full h-12 px-4 py-2 pr-10 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-lg tracking-wide focus:ring-2 focus:ring-wa-teal focus:border-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
            />
            {phoneNumber && (
              <button
                type="button"
                onClick={clearPhone}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="Clear phone number"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500 text-right">
          {selectedCountry.name}
        </p>
      </div>

      {/* Message Input Section */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-baseline">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            Message (Optional)
            </label>
            <span className="text-[10px] uppercase font-bold text-wa-teal tracking-wider">
                AI Powered
            </span>
        </div>
        
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Hi! I saw your listing..."
          rows={3}
          className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-wa-teal focus:border-transparent outline-none resize-none text-gray-900 dark:text-gray-100"
        />
        
        {/* AI Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
                type="button"
                disabled={isGenerating || !message}
                onClick={() => handleAIMessage('professional')}
                className="flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
                ✨ Professional
            </button>
             <button
                type="button"
                disabled={isGenerating || !message}
                onClick={() => handleAIMessage('casual')}
                className="flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-100 transition-colors disabled:opacity-50"
            >
                👋 Casual
            </button>
             <button
                type="button"
                disabled={isGenerating || !message}
                onClick={() => handleAIMessage('flirty')}
                className="flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300 hover:bg-pink-100 transition-colors disabled:opacity-50"
            >
                🌹 Flirty
            </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-wa-green hover:bg-[#1DA851] text-white font-bold py-3.5 px-4 rounded-lg shadow-lg shadow-green-500/30 transform transition active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413 11.815 11.815 0 00-8.413 3.48 11.821 11.821 0 00-3.48 8.413c0 2.096.547 4.142 1.588 5.945L.057 24z"/>
        </svg>
        Start Chat
      </button>
    </form>
  );
};