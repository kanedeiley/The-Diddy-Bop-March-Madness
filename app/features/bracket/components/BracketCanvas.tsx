'use client';
import { useState, useRef, useEffect } from 'react';
import Bracket from './Bracket';
import { BracketProvider } from '../context/BracketProvider';
import BracketMenu from './BracketMenu';
import type { TournamentTeam } from '@/app/lib/teams';
import { SavedBracket } from '../hooks/useBracketHook';

interface BracketCanvasProps {
  teamsByRegion: Record<string, TournamentTeam[]>;
  savedBracket: SavedBracket | null;
}

export default function BracketCanvas({ teamsByRegion, savedBracket }: BracketCanvasProps) {
  const [scale, setScale] = useState(0.5);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
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
    return target.closest('button') || target.closest('[role="button"]');
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
      // Pinch to zoom
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
      // Pinch to zoom
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
    <BracketProvider teamsByRegion={teamsByRegion} savedBracket={savedBracket}>
      <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
        <div
          ref={canvasRef}
          className="flex-1 overflow-hidden cursor-grab active:cursor-grabbing touch-none"
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
            <Bracket />
          </div>
        </div>
      </div>
      <BracketMenu />
    </BracketProvider>
  );
}