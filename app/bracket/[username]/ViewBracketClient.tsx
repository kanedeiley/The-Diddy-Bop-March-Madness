'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { BracketProvider } from '@/app/features/bracket/context/BracketProvider';
import { ViewableBracket } from '@/app/features/bracket/actions/view-bracket';
import { SavedBracket } from '@/app/features/bracket/hooks/useBracketHook';
import Bracket from '@/app/features/bracket/components/Bracket';
import RegionSelector from '@/app/features/bracket/region/components/RegionSelector';
type Props = {
  bracket: ViewableBracket;
  teamsByRegion: Record<string, any[]>;
};

export default function ViewBracketClient({ bracket, teamsByRegion }: Props) {
  const [scale, setScale] = useState(0.5);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(
    null
  );
  const canvasRef = useRef<HTMLDivElement>(null);

  if (!bracket) return null;

  const savedBracket: SavedBracket = {
    bracket: { id: bracket.bracket.id, is_locked: true },
    picks: bracket.picks,
    cinderellas: bracket.cinderellas,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * -0.001;
      setScale((prev) => Math.min(Math.max(0.3, prev + delta), 1.5));
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, []);

  const shouldPreventDrag = (target: HTMLElement) => {
    return target.closest('button') || target.closest('[role="button"]');
  };

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
      const maxPan = 500;
      setPosition({
        x: Math.min(Math.max(newX, -maxPan), maxPan),
        y: Math.min(Math.max(newY, -maxPan), maxPan),
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (shouldPreventDrag(target)) return;

    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
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
      const maxPan = 500;
      setPosition({
        x: Math.min(Math.max(newX, -maxPan), maxPan),
        y: Math.min(Math.max(newY, -maxPan), maxPan),
      });
    } else if (e.touches.length === 2 && lastTouchDistance) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = (distance - lastTouchDistance) * 0.01;
      setScale((prev) => Math.min(Math.max(0.3, prev + delta), 1.5));
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
        {/* Header bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {bracket.avatar_url ? (
              <img
                src={bracket.avatar_url}
                alt={bracket.username}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                {bracket.username.charAt(0).toUpperCase()}
              </div>
            )}
            <h1 className="text-lg font-bold text-gray-900">
              {bracket.username}&apos;s Bracket
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <RegionSelector />
            <Link
              href="/bracket"
              className="text-sm text-blue-600 hover:underline"
            >
              ← Your bracket
            </Link>
          </div>
        </div>

        {/* Scrollable canvas — bracket is read-only */}
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
            className="p-8 pointer-events-none"
          >
            <Bracket />
          </div>
        </div>
      </div>
    </BracketProvider>
  );
}