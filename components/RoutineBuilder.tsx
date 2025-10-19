import React from 'react';
import type { RoutineItem } from '../types';
import { ProductImage } from './common/ProductImage';

interface RoutineBuilderProps {
  routine: RoutineItem[];
  onRemove: (itemId: number) => void;
}

const RoutineCard: React.FC<{ item: RoutineItem; onRemove: (id: number) => void }> = ({ item, onRemove }) => (
    <div className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm border border-brand-tan">
        <ProductImage
            productName={item.product.productName}
            productDescription={item.product.description}
            className="w-16 h-16 rounded-md object-cover flex-shrink-0"
        />
        <div className="flex-grow">
            <p className="font-semibold">{item.product.productName}</p>
            <p className="text-sm text-gray-500">{item.product.brand}</p>
        </div>
        <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Remove</button>
    </div>
);


export const RoutineBuilder: React.FC<RoutineBuilderProps> = ({ routine, onRemove }) => {
  const amRoutine = routine.filter(item => item.time === 'AM');
  const pmRoutine = routine.filter(item => item.time === 'PM');

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-brand-tan">
      <h2 className="text-3xl font-bold text-brand-green mb-6 text-center">My Skincare Routine</h2>
      {routine.length === 0 ? (
        <p className="text-center text-gray-500">Your routine is empty. Add products from the recommendations tab!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold text-brand-green-light mb-4 flex items-center gap-2">
                <span role="img" aria-label="sun">☀️</span> AM Routine
            </h3>
            <div className="space-y-4">
              {amRoutine.length > 0 ? (
                amRoutine.map(item => <RoutineCard key={item.id} item={item} onRemove={onRemove} />)
              ) : (
                <p className="text-gray-500">No products in your morning routine.</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-brand-green-light mb-4 flex items-center gap-2">
                <span role="img" aria-label="moon">🌙</span> PM Routine
            </h3>
            <div className="space-y-4">
              {pmRoutine.length > 0 ? (
                pmRoutine.map(item => <RoutineCard key={item.id} item={item} onRemove={onRemove} />)
              ) : (
                <p className="text-gray-500">No products in your evening routine.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};