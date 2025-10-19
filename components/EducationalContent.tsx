
import React, { useState, useCallback } from 'react';
import { fetchEducationalContent, fetchIngredientInfo } from '../services/geminiService';
import { Spinner } from './common/Spinner';
import type { IngredientInfo } from '../types';
import { IngredientGlossary } from './IngredientGlossary';

const topics = [
  "The Importance of Sunscreen",
  "Understanding Hyaluronic Acid",
  "What is Niacinamide?",
  "Beginner's Guide to Retinoids",
  "Double Cleansing Explained",
];

export const EducationalContent: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchedIngredients, setSearchedIngredients] = useState<IngredientInfo[]>([]);
  const [isLoadingIngredient, setIsLoadingIngredient] = useState(false);

  const loadContent = useCallback(async (topic: string) => {
    setSearchedIngredients([]); // Clear ingredient search results
    setSelectedTopic(topic);
    setIsLoading(true);
    setError(null);
    try {
      const article = await fetchEducationalContent(topic);
      setContent(article);
    } catch (e) {
      console.error(e);
      setError("Could not load content. Please try again.");
      setContent('');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearchSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const ingredientNames = searchQuery.split(',').map(name => name.trim()).filter(Boolean);
    if (ingredientNames.length === 0) return;

    // Clear topic content
    setSelectedTopic(null);
    setContent('');
    setError(null);
    
    setIsLoadingIngredient(true);
    setSearchedIngredients([]);

    const results = await Promise.allSettled(
      ingredientNames.map(name => fetchIngredientInfo(name))
    );

    const ingredientData = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        console.error(`Failed to fetch info for ${ingredientNames[index]}:`, result.reason);
        return {
          name: ingredientNames[index],
          function: 'Could not fetch details for this ingredient.',
          scientificBacking: 'Please check the spelling or try another ingredient.',
          commonUses: 'N/A'
        };
      }
    });

    setSearchedIngredients(ingredientData);
    setIsLoadingIngredient(false);
  }, [searchQuery]);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-brand-tan">
      <h2 className="text-3xl font-bold text-brand-green mb-6 text-center">Skincare Library</h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-brand-brown mb-4 text-center">Search for an Ingredient</h3>
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md mx-auto">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g., Retinol, Vitamin C, Niacinamide..."
            className="w-full p-3 bg-brand-cream border border-brand-tan rounded-lg focus:ring-2 focus:ring-brand-green-light focus:outline-none"
            aria-label="Search for ingredients, separated by commas"
          />
          <button
            type="submit"
            className="bg-brand-green text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed"
            disabled={isLoadingIngredient || !searchQuery.trim()}
          >
            {isLoadingIngredient ? '...' : 'Search'}
          </button>
        </form>
      </div>

      <div className="relative text-center my-8">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-brand-tan" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-sm text-gray-500">OR</span>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-brand-brown mb-4 text-center">Browse Topics</h3>
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {topics.map(topic => (
          <button
            key={topic}
            onClick={() => loadContent(topic)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedTopic === topic ? 'bg-brand-green text-white shadow-md' : 'bg-brand-cream hover:bg-brand-tan'}`}
          >
            {topic}
          </button>
        ))}
      </div>
      
      <div className="bg-brand-cream p-6 rounded-lg min-h-[300px] flex flex-col justify-center">
        {(isLoading || isLoadingIngredient) ? (
          <Spinner />
        ) : searchedIngredients.length > 0 ? (
          <div className="w-full text-left">
            <h3 className="text-2xl font-bold text-brand-brown mb-4 text-center">Ingredient Search Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {searchedIngredients.map((ing, index) => (
                <div key={`${ing.name}-${index}`} className="bg-white p-4 rounded-lg shadow-md border border-brand-tan">
                  <h4 className="font-bold text-xl text-brand-green mb-2">{ing.name}</h4>
                  {ing.function.startsWith('Could not fetch') ? (
                    <p className="text-red-500">{ing.function}<br/>{ing.scientificBacking}</p>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-semibold text-brand-brown">Function</h5>
                        <p className="text-gray-600 text-sm">{ing.function}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-brand-brown">Scientific Backing</h5>
                        <p className="text-gray-600 text-sm">{ing.scientificBacking}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-brand-brown">Common Uses</h5>
                        <p className="text-gray-600 text-sm">{ing.commonUses}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : content ? (
          <div className="prose max-w-none text-left">
            <h3 className="text-2xl font-bold text-brand-brown">{selectedTopic}</h3>
            <p className="whitespace-pre-line">{content}</p>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <p className="text-center text-gray-500">Select a topic or search for one or more ingredients to learn more.</p>
        )}
      </div>

      <div className="relative text-center my-12">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-brand-tan" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-lg text-brand-green-light">✦</span>
        </div>
      </div>

      <IngredientGlossary />

    </div>
  );
};
