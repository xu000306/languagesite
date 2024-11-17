import React from 'react';
import { Lock, Unlock } from 'lucide-react';

interface LockButtonProps {
  isUnlocked: boolean;
  onLock: () => void;
}

export default function LockButton({ isUnlocked, onLock }: LockButtonProps) {
  return (
    <button
      onClick={isUnlocked ? onLock : undefined}
      className={`fixed bottom-4 right-4 p-3 rounded-full shadow-lg ${
        isUnlocked 
          ? 'bg-green-500 hover:bg-green-600' 
          : 'bg-red-500'
      } text-white transition-colors`}
      title={isUnlocked ? 'Lock Editor' : 'Type password to unlock'}
    >
      {isUnlocked ? (
        <Unlock className="w-6 h-6" />
      ) : (
        <Lock className="w-6 h-6" />
      )}
    </button>
  );
}