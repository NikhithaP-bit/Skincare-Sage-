
import React, { useState, useEffect } from 'react';
import { fetchIngredientGlossary } from '../services/geminiService';
import type { IngredientGlossaryCategory } from '../types';
import { Spinner } from './common/Spinner';

const AccordionItem: React.FC<{ category: IngredientGlossaryCategory, isOpen: boolean, onClick: () => void }> = ({ category, isOpen, onClick }) => {
    return (
        <div className="border-b border-brand-tan">
            <h2>
                <button
                    type="button"
                    className="flex justify-between items-center w-full p-5 font-medium text-left text-brand-brown"
                    onClick={onClick}
                    aria-expanded={isOpen}
                >
                    <span>{category.categoryName}</span>
                    <svg className={`w-3 h-3 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5"/>
                    </svg>
                </button>
            </h2>
            <div className={`${isOpen ? '' : 'hidden'}`}>
                <div className="p-5 border-t border-brand-tan">
                    <p className="mb-4 text-gray-500">{category.description}</p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-700">
                            <thead className="text-xs text-brand-brown uppercase bg-brand-cream">
                                <tr>
                                    <th scope="col" className="px-4 py-2">Ingredient</th>
                                    <th scope="col" className="px-4 py-2">Recommended %</th>
                                    <th scope="col" className="px-4 py-2">Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {category.ingredients.map((ing, index) => (
                                    <tr key={index} className="bg-white border-b border-brand-tan last:border-b-0">
                                        <th scope="row" className="px-4 py-2 font-medium whitespace-nowrap">{ing.name}</th>
                                        <td className="px-4 py-2">{ing.percentage}</td>
                                        <td className="px-4 py-2">{ing.notes || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};


export const IngredientGlossary: React.FC = () => {
    const [glossary, setGlossary] = useState<IngredientGlossaryCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    useEffect(() => {
        const loadGlossary = async () => {
            try {
                const data = await fetchIngredientGlossary();
                setGlossary(data);
            } catch (err) {
                setError('Could not load the ingredient glossary. Please try refreshing the page.');
            } finally {
                setIsLoading(false);
            }
        };
        loadGlossary();
    }, []);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div>
            <h3 className="text-xl font-semibold text-brand-brown mb-4 text-center">Ingredient Glossary & Recommended Usage</h3>
            <div className="border border-brand-tan rounded-lg overflow-hidden bg-white">
                {glossary.map((category, index) => (
                    <AccordionItem 
                        key={index} 
                        category={category}
                        isOpen={openIndex === index}
                        onClick={() => handleToggle(index)}
                    />
                ))}
            </div>
        </div>
    );
};
