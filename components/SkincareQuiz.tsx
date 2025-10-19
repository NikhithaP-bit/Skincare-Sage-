
import React, { useState } from 'react';
import type { QuizFormData } from '../types';

interface SkincareQuizProps {
  onSubmit: (data: QuizFormData) => void;
  isLoading: boolean;
}

const skinTypes = ["Normal", "Oily", "Dry", "Combination", "Sensitive"];
const skinConcernsOptions = ["Acne", "Redness", "Fine Lines & Wrinkles", "Dark Spots", "Dryness", "Oiliness", "Dullness", "Uneven Texture"];

export const SkincareQuiz: React.FC<SkincareQuizProps> = ({ onSubmit, isLoading }) => {
  const [skinType, setSkinType] = useState<string>('');
  const [skinConcerns, setSkinConcerns] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<string>('');

  const handleConcernToggle = (concern: string) => {
    setSkinConcerns(prev =>
      prev.includes(concern)
        ? prev.filter(c => c !== concern)
        : [...prev, concern]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (skinType && skinConcerns.length > 0) {
      onSubmit({ skinType, skinConcerns, preferences });
    } else {
      alert("Please select your skin type and at least one concern.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto border border-brand-tan">
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          <div>
            <label className="text-xl font-semibold text-brand-brown mb-4 block">1. What is your skin type?</label>
            <div className="flex flex-wrap gap-3">
              {skinTypes.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSkinType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${skinType === type ? 'bg-brand-green text-white shadow-md' : 'bg-brand-cream hover:bg-brand-tan'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-xl font-semibold text-brand-brown mb-4 block">2. What are your main skin concerns?</label>
            <div className="flex flex-wrap gap-3">
              {skinConcernsOptions.map(concern => (
                <button
                  key={concern}
                  type="button"
                  onClick={() => handleConcernToggle(concern)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${skinConcerns.includes(concern) ? 'bg-brand-green text-white shadow-md' : 'bg-brand-cream hover:bg-brand-tan'}`}
                >
                  {concern}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="preferences" className="text-xl font-semibold text-brand-brown mb-4 block">3. Any preferences? (optional)</label>
            <input
              id="preferences"
              type="text"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="e.g., vegan, fragrance-free, budget-friendly"
              className="w-full p-3 bg-brand-cream border border-brand-tan rounded-lg focus:ring-2 focus:ring-brand-green-light focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-10 text-center">
          <button
            type="submit"
            disabled={isLoading || !skinType || skinConcerns.length === 0}
            className="bg-brand-green text-white font-bold py-3 px-12 rounded-full text-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isLoading ? 'Analyzing...' : 'Get Recommendations'}
          </button>
        </div>
      </form>
    </div>
  );
};
