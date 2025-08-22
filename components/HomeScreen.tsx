
import React, { useRef } from 'react';
import { UploadIcon, SparklesIcon } from './Icons';

interface HomeScreenProps {
  onImageUpload: (file: File) => void;
  credits: number;
  onCreditsClick: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onImageUpload, credits, onCreditsClick }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="text-center p-8 flex flex-col items-center">
        <div className="mb-4 text-6xl text-indigo-500">
            <SparklesIcon />
        </div>
      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
        Reimagine seu espaço
      </h1>
      <p className="max-w-2xl text-lg text-gray-600 mb-8">
        Transforme a ansiedade da decoração em diversão e inspiração. Deixe nossa IA revelar o potencial oculto do seu lar.
      </p>
      <button
        onClick={handleButtonClick}
        className="inline-flex items-center gap-3 bg-indigo-500 text-white font-bold text-lg py-4 px-8 rounded-full shadow-lg hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        <UploadIcon />
        Enviar foto do cômodo
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg"
      />
       <button onClick={onCreditsClick} className="mt-6 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 py-1 px-3 rounded-full transition-colors">
        {credits} créditos gratuitos restantes
      </button>
    </div>
  );
};

export default HomeScreen;
