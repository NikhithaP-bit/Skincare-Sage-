
import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="w-12 h-12 border-4 border-brand-green-light border-t-brand-green rounded-full animate-spin"></div>
    </div>
  );
};
