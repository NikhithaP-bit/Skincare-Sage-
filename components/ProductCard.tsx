
import React, { useState, useCallback } from 'react';
import type { Product, IngredientInfo, UserReview } from '../types';
import { IngredientModal } from './IngredientModal';
import { UserReviews } from './UserReviews';
import { fetchIngredientInfo, fetchMockReviews } from '../services/geminiService';

interface ProductCardProps {
  product: Product;
  onAddToRoutine: (product: Product, time: 'AM' | 'PM') => void;
  onToggleComparison: (product: Product) => void;
  isInComparison: boolean;
}

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToRoutine, onToggleComparison, isInComparison }) => {
  const [activeTab, setActiveTab] = useState('why');
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<IngredientInfo | null>(null);
  const [isLoadingIngredient, setIsLoadingIngredient] = useState(false);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewsFetched, setReviewsFetched] = useState(false);

  const handleIngredientClick = useCallback(async (ingredientName: string) => {
    setIsLoadingIngredient(true);
    setIsIngredientModalOpen(true);
    try {
      const info = await fetchIngredientInfo(ingredientName);
      setSelectedIngredient(info);
    } catch (error) {
      console.error(error);
      setSelectedIngredient({
        name: ingredientName,
        function: 'Could not fetch details.',
        scientificBacking: 'Please try again later.',
        commonUses: ''
      });
    } finally {
      setIsLoadingIngredient(false);
    }
  }, []);

  const handleReviewsTabClick = useCallback(async () => {
    setActiveTab('reviews');
    if (!reviewsFetched) {
        setIsLoadingReviews(true);
        try {
            const fetchedReviews = await fetchMockReviews(product.productName);
            setReviews(fetchedReviews);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingReviews(false);
            setReviewsFetched(true);
        }
    }
  }, [product.productName, reviewsFetched]);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-brand-tan transform transition-all hover:shadow-2xl hover:-translate-y-1 duration-300">
      <div className="p-6 md:p-8">
        <div className="md:flex md:gap-8">
          <div className="md:w-1/3 mb-6 md:mb-0">
            <img src={`https://picsum.photos/seed/${product.productName}/400/400`} alt={product.productName} className="rounded-lg object-cover w-full" />
          </div>
          <div className="md:w-2/3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-brand-green-light">{product.brand}</p>
                <h2 className="text-2xl font-bold text-brand-brown">{product.productName}</h2>
              </div>
              <p className="text-2xl font-bold text-brand-green">${product.price.toFixed(2)}</p>
            </div>
            <p className="text-gray-600 mt-2">{product.description}</p>
            
            <div className="mt-6 flex flex-wrap gap-2">
                <button onClick={() => onAddToRoutine(product, 'AM')} className="flex items-center text-sm bg-brand-green-light text-white font-semibold py-2 px-4 rounded-full hover:bg-brand-green transition-colors">
                    <PlusIcon /> AM Routine
                </button>
                <button onClick={() => onAddToRoutine(product, 'PM')} className="flex items-center text-sm bg-brand-green-light text-white font-semibold py-2 px-4 rounded-full hover:bg-brand-green transition-colors">
                    <PlusIcon /> PM Routine
                </button>
                <label className="flex items-center text-sm bg-brand-tan text-brand-brown font-semibold py-2 px-4 rounded-full cursor-pointer hover:bg-opacity-80 transition-colors">
                    <input type="checkbox" checked={isInComparison} onChange={() => onToggleComparison(product)} className="mr-2 h-4 w-4 rounded border-gray-300 text-brand-green focus:ring-brand-green"/>
                    Compare
                </label>
            </div>

            <div className="mt-6 border-b border-brand-tan">
              <nav className="flex -mb-px space-x-6">
                <button onClick={() => setActiveTab('why')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'why' ? 'border-brand-green text-brand-green' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Why This Product?</button>
                <button onClick={() => setActiveTab('proscons')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'proscons' ? 'border-brand-green text-brand-green' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Pros & Cons</button>
                <button onClick={handleReviewsTabClick} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews' ? 'border-brand-green text-brand-green' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Reviews</button>
              </nav>
            </div>

            <div className="mt-6 min-h-[150px]">
              {activeTab === 'why' && (
                <div>
                  <p className="text-gray-700">{product.why}</p>
                  <h4 className="font-semibold mt-4 mb-2">Key Ingredients:</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.keyIngredients.map(ing => (
                      <button key={ing} onClick={() => handleIngredientClick(ing)} className="bg-brand-cream text-brand-green font-medium py-1 px-3 rounded-full text-xs border border-brand-tan hover:bg-brand-tan transition">
                        {ing}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'proscons' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Pros</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {product.pros.map(pro => <li key={pro}>{pro}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">Cons</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {product.cons.map(con => <li key={con}>{con}</li>)}
                    </ul>
                  </div>
                </div>
              )}
              {activeTab === 'reviews' && (
                  <UserReviews reviews={reviews} isLoading={isLoadingReviews} />
              )}
            </div>
          </div>
        </div>
      </div>
      <IngredientModal isOpen={isIngredientModalOpen} onClose={() => setIsIngredientModalOpen(false)} ingredientInfo={selectedIngredient} isLoading={isLoadingIngredient} />
    </div>
  );
};
