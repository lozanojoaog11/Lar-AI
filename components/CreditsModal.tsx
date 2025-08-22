
import React from 'react';
import { CloseIcon, SparklesIcon } from './Icons';

interface CreditsModalProps {
  onClose: () => void;
}

const CreditsModal: React.FC<CreditsModalProps> = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center relative transform transition-all animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <CloseIcon />
        </button>
        <div className="mx-auto mb-4 text-5xl text-indigo-500 bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center">
            <SparklesIcon />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Você usou seus créditos!</h2>
        <p className="text-gray-600 mb-6">
          Você aproveitou todas as suas transformações gratuitas. Para continuar reimaginando espaços, adquira mais créditos.
        </p>
        <button className="w-full bg-indigo-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 ease-in-out">
          Comprar mais créditos
        </button>
      </div>
    </div>
  );
};

export default CreditsModal;
