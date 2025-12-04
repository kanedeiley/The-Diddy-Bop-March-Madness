'use client';

import { useState, useRef, useEffect } from 'react';
import { MiddleFinger } from '../components/icons';

export default function Page() {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  const [suggestion, setSuggestion] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * -0.001;
      setScale(prevScale => Math.min(Math.max(0.3, prevScale + delta), 1.5));
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, []);

  const shouldPreventDrag = (target: HTMLElement) => {
    return target.closest('button') || target.closest('[role="button"]') || target.closest('input');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim() || isAnimating) return;

    // Trigger animation
    setIsAnimating(true);
    
    // Reset after full animation completes (slide out + pause + slide back)
    setTimeout(() => {
      setIsAnimating(false);
      setSuggestion('');
    }, 3000); // Total animation time
  };

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (shouldPreventDrag(target)) return;
    
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      const maxPanX = 500;
      const maxPanY = 500;
      
      setPosition({
        x: Math.min(Math.max(newX, -maxPanX), maxPanX),
        y: Math.min(Math.max(newY, -maxPanY), maxPanY),
      });
    }
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (shouldPreventDrag(target)) return;

    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ 
        x: e.touches[0].clientX - position.x, 
        y: e.touches[0].clientY - position.y 
      });
    } else if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setLastTouchDistance(distance);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const newX = e.touches[0].clientX - dragStart.x;
      const newY = e.touches[0].clientY - dragStart.y;
      
      const maxPanX = 500;
      const maxPanY = 500;
      
      setPosition({
        x: Math.min(Math.max(newX, -maxPanX), maxPanX),
        y: Math.min(Math.max(newY, -maxPanY), maxPanY),
      });
    } else if (e.touches.length === 2 && lastTouchDistance) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = (distance - lastTouchDistance) * 0.01;
      setScale(prevScale => Math.min(Math.max(0.3, prevScale + delta), 1.5));
      setLastTouchDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setLastTouchDistance(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Canvas */}
      <div
        ref={canvasRef}
        className="flex-1 overflow-hidden cursor-grab active:cursor-grabbing touch-none relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.1s',
          }}
          className="p-8"
        >
        <div className={`fixed top-40 z-40 w-[90vw] left-1/2 -translate-x-1/2 ${isAnimating ? 'animate-form-swap' : ''}`}>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="relative">
                <input
                  type='text'
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="Enter your suggestion..."
                  disabled={isAnimating}
                  className="bg-white w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 text-base"
                />
                <button
                  type="submit"
                  disabled={!suggestion.trim() || isAnimating}
                  className="h-8 w-8 absolute rounded-lg right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  &gt;
                </button>
              </div>
            </form>
          </div>
        </div>

        </div>

        {isAnimating && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-50 animate-finger-slide">
            <MiddleFinger className="h-32 w-32 text-indigo-600 animate-finger-tilt" />
          </div>
        )}
      </div>


    </div>
  );
}