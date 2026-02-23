'use client';

import { useState, useRef, useEffect } from 'react';
import { useBracketContext } from '../../context/useBracketContext';
import { CURRENT_TOURNAMENT_CONFIG } from '@/app/config';

export default function CinderellaSelector() {
  const {
    selectedRegion,
    regionCinderellas,
    selectedCinderella,
    setCinderellaForRegion,
  } = useBracketContext();

  const [isOpen, setIsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if tournament is locked
  useEffect(() => {
    const checkLocked = () => {
      setIsLocked(Date.now() > CURRENT_TOURNAMENT_CONFIG.lockedTime.getTime());
    };
    checkLocked();
    // Optionally recheck periodically
    const interval = setInterval(checkLocked, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectCinderella = (team: any) => {
    if (isLocked) return;
    // Toggle selection - if clicking the same team, deselect
    if (selectedCinderella?.id === team.id) {
      setCinderellaForRegion(selectedRegion, null);
    } else {
      setCinderellaForRegion(selectedRegion, team);
    }
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Dropdown Button */}
      <div
        onClick={() => !isLocked && setIsOpen(!isOpen)}
        className={`rounded-lg border-2 shadow-md hover:shadow-lg transition-all ${
          isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
        } ${
          selectedCinderella
            ? 'bg-gradient-to-r from-pink-50 to-pink-100 border-pink-400'
            : 'bg-white border-gray-300'
        }`}
      >
        <div className={`px-4 py-3 flex items-center justify-between ${
          selectedCinderella ? 'border-l-4 border-l-pink-500' : ''
        }`}>
          <div className="flex items-center gap-2">
            <div>
              <div className={`text-xs font-semibold uppercase tracking-wider ${
                selectedCinderella ? 'text-pink-700' : 'text-gray-500'
              }`}>
                Cinderella Pick {isLocked && '(Locked)'}
              </div>
              {selectedCinderella ? (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-pink-700">
                    {selectedCinderella.seed}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {selectedCinderella.name}
                  </span>
                </div>
              ) : (
                <div className="text-sm text-gray-400 italic mt-1">
                  {isLocked ? 'Tournament locked' : 'Select a team (11-16 seed)'}
                </div>
              )}
            </div>
          </div>
          <svg
            className={`w-5 h-5 transition-transform ${
              isOpen ? 'rotate-180' : ''
            } ${selectedCinderella ? 'text-pink-400' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && !isLocked && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg border-2 border-gray-300 shadow-lg z-10 max-h-80 overflow-y-auto">
          {/* Clear Selection Option */}
          {selectedCinderella && (
            <div
              onClick={() => {
                setCinderellaForRegion(selectedRegion, null);
                setIsOpen(false);
              }}
              className="px-4 py-3 border-b-2 border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2 text-gray-500 italic text-sm">
                <span>✕</span>
                <span>Clear selection</span>
              </div>
            </div>
          )}

          {/* Team Options */}
          {regionCinderellas.map((team) => (
            <div
              key={team.id}
              onClick={() => handleSelectCinderella(team)}
              className={`
                px-4 py-3 border-b border-gray-200 cursor-pointer
                transition-all flex items-center
                last:border-b-0
                ${
                  selectedCinderella?.id === team.id
                    ? 'bg-pink-100 font-semibold border-l-4 border-l-pink-500'
                    : 'hover:bg-gray-50'
                }
              `}
            >
              <span className="text-xs font-semibold text-gray-500 mr-2 w-6">
                {team.seed}
              </span>
              <span className="text-sm flex-1">
                {team.name}
              </span>
              {selectedCinderella?.id === team.id && (
                <span className="text-pink-500 ml-2">⭐</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}