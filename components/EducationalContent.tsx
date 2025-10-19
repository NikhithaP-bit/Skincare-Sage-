
import React, { useState, useCallback } from 'react';
import { fetchEducationalContent } from '../services/geminiService';
import { Spinner } from './common/Spinner';

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

  const loadContent = useCallback(async (topic: string) => {
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

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-brand-tan">
      <h2 className="text-3xl font-bold text-brand-green mb-6 text-center">Skincare Library</h2>
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
      <div className="bg-brand-cream p-6 rounded-lg min-h-[300px]">
        {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!isLoading && !error && content && (
          <div className="prose max-w-none">
            <h3 className="text-2xl font-bold text-brand-brown">{selectedTopic}</h3>
            <p className="whitespace-pre-line">{content}</p>
          </div>
        )}
        {!isLoading && !content && !error && (
            <p className="text-center text-gray-500 pt-16">Select a topic to learn more.</p>
        )}
      </div>
    </div>
  );
};
