
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-brand-green">
              <span role="img" aria-label="leaf" className="mr-2">🌿</span>
              Skincare Sage
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};
