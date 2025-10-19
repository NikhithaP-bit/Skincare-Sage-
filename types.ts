
export interface QuizFormData {
  skinType: string;
  skinConcerns: string[];
  preferences: string;
}

export interface Product {
  productName: string;
  brand: string;
  description: string;
  why: string;
  keyIngredients: string[];
  pros: string[];
  cons: string[];
  price: number;
}

export interface RoutineItem {
  id: number;
  product: Product;
  time: 'AM' | 'PM';
}

export interface IngredientInfo {
  name: string;
  function: string;
  scientificBacking: string;
  commonUses: string;
}

export interface UserReview {
  username: string;
  skinType: string;
  rating: number;
  comment: string;
}

export interface IngredientUsage {
  name: string;
  percentage: string;
  notes?: string;
}

export interface IngredientGlossaryCategory {
  categoryName: string;
  description: string;
  ingredients: IngredientUsage[];
}
