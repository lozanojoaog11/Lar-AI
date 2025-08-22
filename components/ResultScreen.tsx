import React from 'react';
import ImageCompareSlider from './ImageCompareSlider';
import { DownloadIcon, ShareIcon, RedoIcon } from './Icons';

interface ResultScreenProps {
  beforeImage: string;
  afterImage: string;
  onStartOver: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ beforeImage, afterImage, onStartOver }) => {

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = afterImage; // data-URL works directly here
    link.download = 'lar_ai_resultado.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    try {
        const response = await fetch(afterImage);
        const blob = await response.blob();
        const file = new File([blob], 'lar_ai_resultado.jpg', { type: blob.type });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: 'Veja a transformação do meu lar!',
                text: 'Usei o Lar AI para reimaginar meu espaço. Olha que incrível!',
            });
        } else if (navigator.share) {
            // Fallback for browsers that don't support file sharing
            await navigator.share({
                title: 'Veja a transformação do meu lar!',
                text: 'Usei o Lar AI para reimaginar meu espaço com este resultado incrível!',
                url: window.location.href, // Share a link to the app
            });
        } else {
            alert('A API de compartilhamento não é suportada neste navegador.');
        }
    } catch (error) {
        console.error('Erro ao compartilhar:', error);
        alert('Falha ao tentar compartilhar a imagem.');
    }
  };


  return (
    <div className="w-full max-w-4xl text-center animate-fade-in p-4">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Sua transformação está pronta!</h2>
      <p className="text-gray-600 mb-6">Arraste o slider para comparar o Antes e o Depois.</p>
      
      <div className="w-full aspect-video rounded-2xl shadow-2xl overflow-hidden mx-auto mb-8">
        <ImageCompareSlider
          beforeImage={beforeImage}
          afterImage={afterImage}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={handleDownload}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-indigo-500 text-white font-bold text-lg py-3 px-6 rounded-full shadow-lg hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 ease-in-out"
        >
          <DownloadIcon />
          Baixar Imagem
        </button>
        <button
          onClick={handleShare}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gray-800 text-white font-bold text-lg py-3 px-6 rounded-full shadow-lg hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300 ease-in-out"
        >
          <ShareIcon />
          Compartilhar
        </button>
      </div>
      <button onClick={onStartOver} className="mt-8 inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
          <RedoIcon/>
          Começar de novo
      </button>
    </div>
  );
};

export default ResultScreen;