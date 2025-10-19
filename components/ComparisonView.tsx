import React from 'react';
import type { Product } from '../types';
import { ProductImage } from './common/ProductImage';

interface ComparisonViewProps {
  products: Product[];
  onClear: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ products, onClear }) => {
  if (products.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] z-50 p-6 rounded-t-2xl border-t-2 border-brand-green-light">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-brand-green">Compare Products ({products.length})</h2>
          <button onClick={onClear} className="text-gray-500 hover:text-red-500 font-semibold">Clear & Close</button>
        </div>
        <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))` }}>
          {products.map(product => (
            <div key={product.productName} className="bg-brand-cream p-4 rounded-lg">
              <ProductImage
                productName={product.productName}
                productDescription={product.description}
                className="rounded-md object-cover w-full h-32 mb-3"
              />
              <h3 className="font-bold text-sm">{product.productName}</h3>
              <p className="text-xs text-gray-600">{product.brand}</p>
              <p className="font-bold text-brand-green mt-1">${product.price.toFixed(2)}</p>
              <div className="mt-3">
                <h4 className="font-semibold text-xs mb-1">Pros</h4>
                <ul className="list-disc list-inside text-xs space-y-1">
                  {product.pros.slice(0, 2).map(pro => <li key={pro}>{pro}</li>)}
                </ul>
              </div>
              <div className="mt-3">
                <h4 className="font-semibold text-xs mb-1">Key Ingredients</h4>
                <p className="text-xs">{product.keyIngredients.slice(0, 3).join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};