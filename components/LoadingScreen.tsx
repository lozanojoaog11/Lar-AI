import React, { useState, useEffect } from 'react';
import { LOADING_MESSAGES } from '../constants';

const LoadingScreen: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // This interval cycles through the loading messages to keep the user engaged.
    // The screen's visibility is controlled by the parent component, so no need for a timeout to hide it.
    const messageInterval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % LOADING_MESSAGES.length);
    }, 2000);

    return () => {
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in">
        <div className="w-16 h-16 border-4 border-t-4 border-indigo-500 border-gray-200 rounded-full animate-spin"></div>
        <p className="mt-6 text-lg font-semibold text-gray-800 text-center px-4">
            {LOADING_MESSAGES[messageIndex]}
        </p>
    </div>
  );
};

export default LoadingScreen;