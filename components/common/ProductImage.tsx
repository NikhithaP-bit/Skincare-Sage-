import React, { useState, useEffect } from 'react';
import { generateProductImage } from '../../services/geminiService';

interface ProductImageProps {
  productName: string;
  productDescription: string;
  className?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({ productName, productDescription, className }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; 
    
    const fetchImage = async () => {
      setIsLoading(true);
      try {
        const url = await generateProductImage(productName, productDescription);
        if (isMounted) {
            setImageUrl(url);
        }
      } catch (error) {
        console.error(`Failed to generate image for ${productName}:`, error);
        if (isMounted) {
            setImageUrl(`https://picsum.photos/seed/${productName}/400/400`);
        }
      } finally {
        if (isMounted) {
            setIsLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [productName, productDescription]);

  if (isLoading || !imageUrl) {
    return (
      <div className={`bg-brand-cream rounded-lg flex items-center justify-center ${className || 'w-full h-full'}`}>
        <div className="w-10 h-10 border-4 border-brand-green-light border-t-brand-green rounded-full animate-spin" role="status">
          <span className="sr-only">Loading image...</span>
        </div>
      </div>
    );
  }

  return (
    <img src={imageUrl} alt={productName} className={className} />
  );
};