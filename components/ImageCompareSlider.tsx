
import React, { useState, useRef, useCallback, MouseEvent, TouchEvent } from 'react';

interface ImageCompareSliderProps {
  beforeImage: string;
  afterImage: string;
}

const ImageCompareSlider: React.FC<ImageCompareSliderProps> = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);
  
  const handleMouseMove = useCallback((event: globalThis.MouseEvent) => {
    handleMove(event.clientX);
  }, [handleMove]);
  
  const handleTouchMove = useCallback((event: globalThis.TouchEvent) => {
    handleMove(event.touches[0].clientX);
  }, [handleMove]);
  
  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);
  
  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
  }, [handleTouchMove]);

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    isDragging.current = true;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    isDragging.current = true;
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none cursor-ew-resize"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <img
        src={beforeImage}
        alt="Before"
        className="absolute top-0 left-0 w-full h-full object-cover object-center"
      />
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={afterImage}
          alt="After"
          className="absolute top-0 left-0 w-full h-full object-cover object-center"
        />
      </div>
      <div
        className="absolute top-0 h-full w-1 bg-white shadow-lg"
        style={{ left: `calc(${sliderPosition}% - 2px)` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center cursor-ew-resize">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
        </div>
      </div>
       <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs font-semibold px-2 py-1 rounded">
        ANTES
      </div>
      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs font-semibold px-2 py-1 rounded" style={{ opacity: sliderPosition > 55 ? 1 : 0, transition: 'opacity 0.2s' }}>
        DEPOIS
      </div>
    </div>
  );
};

export default ImageCompareSlider;
