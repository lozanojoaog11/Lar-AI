import React, { useState, useEffect, useCallback } from 'react';
import { Screen, Style } from './types';
import { DESIGN_STYLES } from './constants';
import HomeScreen from './components/HomeScreen';
import StyleSelectionScreen from './components/StyleSelectionScreen';
import LoadingScreen from './components/LoadingScreen';
import ResultScreen from './components/ResultScreen';
import CreditsModal from './components/CreditsModal';
import { GithubIcon } from './components/Icons';
import { generateRoomImage } from './lib/gemini';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screen.HOME);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(3);
  const [showCreditsModal, setShowCreditsModal] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedCredits = localStorage.getItem('lar_ai_credits');
      if (savedCredits !== null) {
        const parsedCredits = parseInt(savedCredits, 10);
        if (!isNaN(parsedCredits)) {
          setCredits(parsedCredits);
        }
      } else {
        localStorage.setItem('lar_ai_credits', '3');
      }
    } catch (error) {
      console.error("Failed to access localStorage:", error);
    }
  }, []);

  const updateCredits = useCallback((newCredits: number) => {
    setCredits(newCredits);
    try {
      localStorage.setItem('lar_ai_credits', newCredits.toString());
    } catch (error) {
      console.error("Failed to save credits to localStorage:", error);
    }
  }, []);

  const handleImageUpload = (file: File) => {
    if (credits <= 0) {
      setShowCreditsModal(true);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setUserImage(e.target?.result as string);
      setScreen(Screen.STYLE_SELECTION);
    };
    reader.readAsDataURL(file);
  };

  const handleStyleSelect = async (style: Style) => {
    if (credits <= 0) {
      setShowCreditsModal(true);
      return;
    }
    // A imagem do usuário é garantida como não nula aqui pela lógica do componente
    if (!userImage) {
        setGenerationError("A imagem do usuário não foi encontrada. Por favor, comece de novo.");
        setScreen(Screen.HOME);
        return;
    }
    
    setSelectedStyle(style);
    setScreen(Screen.LOADING);
    setGenerationError(null);

    try {
      const imageUrl = await generateRoomImage(style.name, userImage);
      setGeneratedImage(imageUrl);
      updateCredits(credits - 1);
      setScreen(Screen.RESULT);
    } catch (err) {
      console.error("AI image generation failed:", err);
      setGenerationError("Oops! A magia da IA falhou. Por favor, tente novamente.");
      setScreen(Screen.STYLE_SELECTION);
    }
  };
  
  const handleStartOver = () => {
      setUserImage(null);
      setSelectedStyle(null);
      setGeneratedImage(null);
      setGenerationError(null);
      setScreen(Screen.HOME);
  };

  const renderScreen = () => {
    switch (screen) {
      case Screen.HOME:
        return <HomeScreen onImageUpload={handleImageUpload} credits={credits} onCreditsClick={() => setShowCreditsModal(true)}/>;
      case Screen.STYLE_SELECTION:
        return userImage && <StyleSelectionScreen userImage={userImage} styles={DESIGN_STYLES} onStyleSelect={handleStyleSelect} error={generationError} />;
      case Screen.LOADING:
        return <LoadingScreen />;
      case Screen.RESULT:
        return userImage && generatedImage && <ResultScreen beforeImage={userImage} afterImage={generatedImage} onStartOver={handleStartOver} />;
      default:
        return <HomeScreen onImageUpload={handleImageUpload} credits={credits} onCreditsClick={() => setShowCreditsModal(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-between p-4">
      <main className="w-full max-w-5xl mx-auto flex-grow flex items-center justify-center">
        {renderScreen()}
      </main>
      <footer className="w-full text-center p-4 text-gray-500 text-sm">
        <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-indigo-600 transition-colors">
          <GithubIcon />
          <span>Construído com ❤️ e IA</span>
        </a>
      </footer>
      {showCreditsModal && <CreditsModal onClose={() => setShowCreditsModal(false)} />}
    </div>
  );
};

export default App;