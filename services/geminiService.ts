
import { GoogleGenAI, Type } from "@google/genai";
import type { QuizFormData, Product, IngredientInfo, UserReview } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const productSchema = {
    type: Type.OBJECT,
    properties: {
        productName: { type: Type.STRING },
        brand: { type: Type.STRING },
        description: { type: Type.STRING },
        why: { type: Type.STRING },
        keyIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
        pros: { type: Type.ARRAY, items: { type: Type.STRING } },
        cons: { type: Type.ARRAY, items: { type: Type.STRING } },
        price: { type: Type.NUMBER },
    },
    required: ["productName", "brand", "description", "why", "keyIngredients", "pros", "cons", "price"],
};

export const generateRecommendations = async (formData: QuizFormData): Promise<Product[]> => {
    const prompt = `
        You are a world-class dermatologist and cosmetic chemist. Based on the following user profile, recommend 3 skincare products.
        - Skin Type: ${formData.skinType}
        - Skin Concerns: ${formData.skinConcerns.join(', ')}
        - Preferences: ${formData.preferences || 'None'}

        For each product, provide the response in a structured JSON format.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        products: {
                            type: Type.ARRAY,
                            items: productSchema,
                        },
                    },
                },
            },
        });
        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        return parsed.products as Product[];
    } catch (error) {
        console.error("Error generating recommendations:", error);
        throw new Error("Failed to parse recommendations from AI.");
    }
};

export const fetchIngredientInfo = async (ingredientName: string): Promise<IngredientInfo> => {
    const prompt = `
        You are a skincare science educator. Provide a detailed explanation of the ingredient "${ingredientName}" for a consumer. 
        Structure the response as a JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        function: { type: Type.STRING },
                        scientificBacking: { type: Type.STRING },
                        commonUses: { type: Type.STRING },
                    },
                    required: ["name", "function", "scientificBacking", "commonUses"],
                },
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as IngredientInfo;
    } catch (error) {
        console.error("Error fetching ingredient info:", error);
        throw new Error("Failed to parse ingredient information from AI.");
    }
};

export const fetchMockReviews = async (productName: string): Promise<UserReview[]> => {
    const prompt = `
        Generate 5 sample user reviews for a product named "${productName}". Create diverse reviews for different skin types (oily, dry, combination, sensitive, acne-prone).
        Provide the response as a JSON array of review objects.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            username: { type: Type.STRING },
                            skinType: { type: Type.STRING },
                            rating: { type: Type.NUMBER },
                            comment: { type: Type.STRING },
                        },
                        required: ["username", "skinType", "rating", "comment"],
                    },
                },
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as UserReview[];
    } catch (error) {
        console.error("Error fetching mock reviews:", error);
        throw new Error("Failed to parse mock reviews from AI.");
    }
};


export const fetchEducationalContent = async (topic: string): Promise<string> => {
    const prompt = `
        You are a friendly skincare blogger. Write a short, engaging, and informative article (around 200-300 words) on the topic: "${topic}". 
        The tone should be educational but accessible to a beginner. Format the response as a single string of plain text.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching educational content:", error);
        throw new Error("Failed to fetch educational content from AI.");
    }
};
