import React, { useState, useEffect } from 'react';
import { Languages } from 'lucide-react';
import LanguageCard from './components/LanguageCard';
import AddCard from './components/AddCard';
import LockButton from './components/LockButton';
import { usePasswordProtection } from './hooks/usePasswordProtection';
import { api, Card } from './api';

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isUnlocked, lock } = usePasswordProtection();

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      const fetchedCards = await api.getCards();
      setCards(fetchedCards);
      setError(null);
    } catch (err) {
      setError('Failed to load cards. Please try again later.');
      console.error('Error loading cards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async (text: string, audioBlob: Blob) => {
    try {
      const newCard = await api.createCard(text, audioBlob);
      setCards([...cards, newCard]);
    } catch (err) {
      alert('Failed to create card. Please try again.');
      console.error('Error creating card:', err);
    }
  };

  const handleUpdateCard = async (id: string, text: string, audioBlob?: Blob) => {
    try {
      const updatedCard = await api.updateCard(id, text, audioBlob);
      setCards(cards.map(card => card.id === id ? updatedCard : card));
    } catch (err) {
      alert('Failed to update card. Please try again.');
      console.error('Error updating card:', err);
    }
  };

  const handleDeleteCard = async (id: string) => {
    try {
      await api.deleteCard(id);
      setCards(cards.filter(card => card.id !== id));
    } catch (err) {
      alert('Failed to delete card. Please try again.');
      console.error('Error deleting card:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Languages className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">MyFuckingFrenchSite</h1>
          </div>
          <p className="text-gray-600 text-lg">Master French with your personal audio cards</p>
          {!isUnlocked && (
            <p className="text-sm text-gray-500 mt-2">Type the password to unlock editing</p>
          )}
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cards...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isUnlocked && <AddCard onAdd={handleAddCard} />}
            {cards.map(card => (
              <LanguageCard
                key={card.id}
                {...card}
                onDelete={handleDeleteCard}
                onUpdate={handleUpdateCard}
                isLocked={!isUnlocked}
              />
            ))}
          </div>
        )}
      </div>
      <LockButton isUnlocked={isUnlocked} onLock={lock} />
    </div>
  );
}

export default App;