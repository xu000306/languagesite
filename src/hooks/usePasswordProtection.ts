import { useState, useEffect } from 'react';

export function usePasswordProtection() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const PASSWORD = '9a9';

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const newInput = currentInput + event.key;
      setCurrentInput(newInput);
      
      if (newInput.includes(PASSWORD)) {
        setIsUnlocked(true);
        setCurrentInput('');
      } else if (newInput.length > PASSWORD.length) {
        setCurrentInput(newInput.slice(-PASSWORD.length));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentInput]);

  const lock = () => {
    setIsUnlocked(false);
    setCurrentInput('');
  };

  return { isUnlocked, lock };
}