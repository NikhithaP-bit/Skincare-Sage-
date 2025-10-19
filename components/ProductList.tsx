
import React from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from '../types';

interface ProductListProps {
  products: Product[];
  onAddToRoutine: (product: Product, time: 'AM' | 'PM') => void;
  onToggleComparison: (product: Product) => void;
  comparisonList: Product[];
}

export const ProductList: React.FC<ProductListProps> = ({ products, onAddToRoutine, onToggleComparison, comparisonList }) => {
  return (
    <div className="space-y-8 mt-12">
      {products.map((product, index) => (
        <ProductCard
          key={product.productName + index}
          product={product}
          onAddToRoutine={onAddToRoutine}
          onToggleComparison={onToggleComparison}
          isInComparison={comparisonList.some(p => p.productName === product.productName)}
        />
      ))}
    </div>
  );
};
