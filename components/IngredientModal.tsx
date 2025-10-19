
import React from 'react';
import { Modal } from './common/Modal';
import { Spinner } from './common/Spinner';
import type { IngredientInfo } from '../types';

interface IngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredientInfo: IngredientInfo | null;
  isLoading: boolean;
}

export const IngredientModal: React.FC<IngredientModalProps> = ({ isOpen, onClose, ingredientInfo, isLoading }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Ingredient Deep Dive: ${ingredientInfo?.name || ''}`}>
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Spinner />
        </div>
      ) : ingredientInfo ? (
        <div className="space-y-4 text-left">
          <div>
            <h3 className="font-semibold text-lg text-brand-green">Function</h3>
            <p className="text-gray-600">{ingredientInfo.function}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-brand-green">Scientific Backing</h3>
            <p className="text-gray-600">{ingredientInfo.scientificBacking}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-brand-green">Common Uses</h3>
            <p className="text-gray-600">{ingredientInfo.commonUses}</p>
          </div>
        </div>
      ) : (
        <p>No ingredient information available.</p>
      )}
    </Modal>
  );
};
