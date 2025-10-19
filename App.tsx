
import React, { useState, useCallback } from 'react';
import { SkincareQuiz } from './components/SkincareQuiz';
import { ProductList } from './components/ProductList';
import { Header } from './components/Header';
import { RoutineBuilder } from './components/RoutineBuilder';
import { ComparisonView } from './components/ComparisonView';
import { EducationalContent } from './components/EducationalContent';
import type { Product, RoutineItem, QuizFormData } from './types';
import { generateRecommendations } from './services/geminiService';
import { Spinner } from './components/common/Spinner';

export default function App() {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [routine, setRoutine] = useState<RoutineItem[]>([]);
  const [comparisonList, setComparisonList] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'routine' | 'learn'>('recommendations');

  const handleQuizSubmit = useCallback(async (formData: QuizFormData) => {
    setIsLoading(true);
    setError(null);
    setRecommendations([]);
    try {
      const results = await generateRecommendations(formData);
      setRecommendations(results);
    } catch (e) {
      console.error(e);
      setError('Sorry, I couldn\'t fetch recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToRoutine = (product: Product, time: 'AM' | 'PM') => {
    if (!routine.some(item => item.product.productName === product.productName)) {
      setRoutine(prev => [...prev, { product, time, id: Date.now() }]);
       setActiveTab('routine');
    }
  };

  const removeFromRoutine = (itemId: number) => {
    setRoutine(prev => prev.filter(item => item.id !== itemId));
  };

  const toggleComparison = (product: Product) => {
    setComparisonList(prev =>
      prev.some(p => p.productName === product.productName)
        ? prev.filter(p => p.productName !== product.productName)
        : [...prev, product]
    );
  };

  const clearComparison = () => {
    setComparisonList([]);
  };

  return (
    <div className="min-h-screen bg-brand-cream font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-green mb-2">Find Your Perfect Skincare</h1>
          <p className="text-lg text-brand-brown max-w-2xl mx-auto">
            Answer a few questions about your skin, and our AI will curate a personalized list of products just for you.
          </p>
        </div>

        <SkincareQuiz onSubmit={handleQuizSubmit} isLoading={isLoading} />

        {isLoading && <Spinner />}
        {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg my-8">{error}</div>}
        
        {recommendations.length > 0 && (
            <>
                <div className="flex justify-center border-b-2 border-brand-tan my-8">
                    <button onClick={() => setActiveTab('recommendations')} className={`px-6 py-3 text-lg font-semibold transition-colors duration-300 ${activeTab === 'recommendations' ? 'border-b-4 border-brand-green text-brand-green' : 'text-gray-500 hover:text-brand-green'}`}>Recommendations</button>
                    <button onClick={() => setActiveTab('routine')} className={`px-6 py-3 text-lg font-semibold transition-colors duration-300 ${activeTab === 'recommendations' ? 'text-gray-500 hover:text-brand-green' : activeTab === 'routine' ? 'border-b-4 border-brand-green text-brand-green' : 'text-gray-500 hover:text-brand-green'}`}>My Routine ({routine.length})</button>
                    <button onClick={() => setActiveTab('learn')} className={`px-6 py-3 text-lg font-semibold transition-colors duration-300 ${activeTab === 'learn' ? 'border-b-4 border-brand-green text-brand-green' : 'text-gray-500 hover:text-brand-green'}`}>Learn</button>
                </div>
                
                {activeTab === 'recommendations' && (
                    <ProductList 
                        products={recommendations}
                        onAddToRoutine={addToRoutine}
                        onToggleComparison={toggleComparison}
                        comparisonList={comparisonList}
                    />
                )}

                {activeTab === 'routine' && <RoutineBuilder routine={routine} onRemove={removeFromRoutine} />}
                
                {activeTab === 'learn' && <EducationalContent />}
            </>
        )}

        {comparisonList.length > 0 && (
          <ComparisonView products={comparisonList} onClear={clearComparison} />
        )}
      </main>
      <footer className="text-center p-4 text-brand-green-light mt-12">
        <p>Powered by Skincare Sage & Gemini AI</p>
      </footer>
    </div>
  );
}
