import React from 'react';
import { useUser } from '@/contexts/UserContext';

export function TopProgressBar() {
  const { user } = useUser();

  if (!user) return null;

  const getXpForLevel = (level: number) => {
    const thresholds = { 1: 0, 2: 100, 3: 300, 4: 600, 5: 1000 };
    return thresholds[level as keyof typeof thresholds] || 1000;
  };

  const getCurrentLevelXp = () => {
    if (user.level === 5) return user.xp;
    const currentThreshold = getXpForLevel(user.level);
    const nextThreshold = getXpForLevel(user.level + 1);
    return user.xp - currentThreshold;
  };

  const getXpForNextLevel = () => {
    if (user.level === 5) return 1000;
    const currentThreshold = getXpForLevel(user.level);
    const nextThreshold = getXpForLevel(user.level + 1);
    return nextThreshold - currentThreshold;
  };

  const progressPercentage = user.level === 5 ? 100 : (getCurrentLevelXp() / getXpForNextLevel()) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground p-3 shadow-lg">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center space-x-4">
          {/* Flag Display */}
          <div className="flex items-center space-x-2">
            {/* American Flag */}
            <div className="w-8 h-6 rounded bg-red-500 flex items-center justify-center text-white text-xs font-bold">
              🇺🇸
            </div>
            {/* Chinese Flag with X overlay */}
            <div className="flag-overlay">
              <div className="w-8 h-6 rounded bg-red-600 flex items-center justify-center text-yellow-400 text-xs opacity-50">
                🇨🇳
              </div>
            </div>
          </div>
          
          {/* User Level */}
          <div className="level-badge px-3 py-1 rounded-full text-xs font-bold">
            等级 {user.level}
          </div>
        </div>

        {/* Virtual Currency Display */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 bg-secondary px-3 py-1 rounded-full">
            <i className="fas fa-dollar-sign text-xs"></i>
            <span className="font-bold text-sm" data-testid="text-balance">
              ${user.balance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mt-2 max-w-6xl mx-auto">
        <div className="flex items-center justify-between text-xs mb-1">
          <span>经验值 (XP)</span>
          <span data-testid="text-xp">
            {getCurrentLevelXp()}/{getXpForNextLevel()}
          </span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-secondary h-2 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
