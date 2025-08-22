import React from 'react';
import { Style } from '../types';
import { ArrowRightIcon } from './Icons';

interface StyleSelectionScreenProps {
  userImage: string;
  styles: Style[];
  onStyleSelect: (style: Style) => void;
  error?: string | null;
}

const StyleSelectionScreen: React.FC<StyleSelectionScreenProps> = ({ userImage, styles, onStyleSelect, error }) => {
  return (
    <div className="w-full max-w-4xl text-center animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Sua Foto</h2>
      <p className="text-gray-600 mb-6">Agora, escolha o estilo que você deseja aplicar.</p>
      
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
          <strong className="font-bold">Erro: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="mb-8">
        <img src={userImage} alt="User upload" className="rounded-2xl shadow-xl max-w-lg mx-auto max-h-[40vh] object-contain" />
      </div>
      
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {styles.map((style) => (
          <div
            key={style.name}
            onClick={() => onStyleSelect(style)}
            className="group flex-shrink-0 cursor-pointer"
          >
            <div className="relative rounded-lg overflow-hidden w-40 h-40 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl">
              <img src={style.thumbnail} alt={style.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-3 transition-opacity duration-300 opacity-100 md:opacity-0 group-hover:opacity-100">
                <h3 className="text-white font-bold">{style.name}</h3>
              </div>
            </div>
             <p className="text-center mt-2 text-sm font-semibold text-gray-700 md:hidden">{style.name}</p>
          </div>
        ))}
      </div>
       <div className="mt-4 text-gray-500 flex items-center justify-center gap-2">
        <ArrowRightIcon/>
        <span>Role para ver mais estilos</span>
      </div>
    </div>
  );
};

export default StyleSelectionScreen;