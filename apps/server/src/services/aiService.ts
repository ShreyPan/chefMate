import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI (you'll need to get API key from Google AI Studio)
const API_KEY = process.env.GEMINI_API_KEY || 'demo-mode';
const genAI = API_KEY !== 'demo-mode' ? new GoogleGenerativeAI(API_KEY) : null;

// Get the Gemini model (only if API key is available)
const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }) : null;

export interface RecipeRequest {
    ingredients?: string[];
    cuisine?: string;
    dietaryRestrictions?: string[];
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    cookingTime?: number; // in minutes
    servings?: number;
    description?: string;
}

export interface GeneratedRecipe {
    title: string;
    description: string;
    cuisine: string;
    difficulty: string;
    prepTime: number;
    cookTime: number;
    servings: number;
    ingredients: Array<{
        name: string;
        amount: string;
        unit: string;
        notes?: string;
        order: number;
    }>;
    steps: Array<{
        stepNumber: number;
        instruction: string;
        duration: number;
        notes?: string;
    }>;
    tips?: string[];
    nutritionInfo?: string;
}

export class AIService {

    /**
     * Generate a recipe based on user input
     */
    static async generateRecipe(request: RecipeRequest): Promise<GeneratedRecipe> {
        try {
            // Demo mode - return a sample recipe if no API key
            if (!model) {
                console.log('🎭 Running in demo mode - returning sample recipe');
                return AIService.getDemoRecipe(request);
            }

            const prompt = AIService.buildRecipePrompt(request);

            console.log('🤖 Generating recipe with Gemini AI...');
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Parse the JSON response
            const recipe = JSON.parse(text);

            console.log(`✅ Generated recipe: "${recipe.title}"`);
            return recipe;

        } catch (error) {
            console.error('❌ AI recipe generation failed:', error);
            console.log('🎭 Falling back to demo recipe');
            return AIService.getDemoRecipe(request);
        }
    }

    /**
     * Get cooking tips and suggestions
     */
    static async getCookingTips(recipeTitle: string, step?: string): Promise<string[]> {
        try {
            if (!model) {
                return AIService.getDemoTips(recipeTitle, step);
            }

            const prompt = `
      Give me 3-5 professional cooking tips for "${recipeTitle}"${step ? ` specifically for the step: "${step}"` : ''}.
      Focus on practical advice that will improve the dish.
      
      Return ONLY a JSON array of strings, no other text:
      ["tip1", "tip2", "tip3"]
      `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return JSON.parse(text);

        } catch (error) {
            console.error('❌ AI cooking tips failed:', error);
            return AIService.getDemoTips(recipeTitle, step);
        }
    }

    /**
     * Process voice commands for recipe requests
     */
    static async processVoiceCommand(voiceText: string): Promise<RecipeRequest> {
        try {
            if (!model) {
                return AIService.getDemoVoiceRequest(voiceText);
            }

            const prompt = `
      Parse this voice command into a recipe request. Extract ingredients, cuisine, difficulty, etc.
      Voice command: "${voiceText}"
      
      Return ONLY a JSON object with this structure:
      {
        "ingredients": ["ingredient1", "ingredient2"],
        "cuisine": "Italian",
        "difficulty": "Easy",
        "cookingTime": 30,
        "servings": 4,
        "description": "what the user wants to cook"
      }
      
      If information is missing, use reasonable defaults or null.
      `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return JSON.parse(text);

        } catch (error) {
            console.error('❌ Voice command parsing failed:', error);
            return AIService.getDemoVoiceRequest(voiceText);
        }
    }

    /**
     * Get ingredient substitutions
     */
    static async getSubstitutions(ingredient: string, amount: string, unit: string): Promise<string[]> {
        try {
            if (!model) {
                return AIService.getDemoSubstitutions(ingredient, amount, unit);
            }

            const prompt = `
      Suggest 3-4 good substitutions for "${amount} ${unit} ${ingredient}" in cooking.
      Include conversion amounts where needed.
      
      Return ONLY a JSON array of strings:
      ["substitute 1 with amount", "substitute 2 with amount"]
      `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return JSON.parse(text);

        } catch (error) {
            console.error('❌ Substitution suggestions failed:', error);
            return AIService.getDemoSubstitutions(ingredient, amount, unit);
        }
    }

    // ============ DEMO METHODS (for testing without API key) ============

    /**
     * Generate a demo recipe when AI is not available
     */
    private static getDemoRecipe(request: RecipeRequest): GeneratedRecipe {
        const cuisineMap: { [key: string]: any } = {
            'Italian': {
                title: 'Demo Pasta Aglio e Olio',
                cuisine: 'Italian',
                ingredients: [
                    { name: 'Spaghetti', amount: '400', unit: 'g', order: 1 },
                    { name: 'Garlic', amount: '4', unit: 'cloves', order: 2 },
                    { name: 'Olive oil', amount: '3', unit: 'tbsp', order: 3 },
                    { name: 'Red pepper flakes', amount: '1', unit: 'tsp', order: 4 }
                ]
            },
            'Asian': {
                title: 'Demo Fried Rice',
                cuisine: 'Asian',
                ingredients: [
                    { name: 'Cooked rice', amount: '2', unit: 'cups', order: 1 },
                    { name: 'Eggs', amount: '2', unit: 'pieces', order: 2 },
                    { name: 'Soy sauce', amount: '2', unit: 'tbsp', order: 3 },
                    { name: 'Vegetables', amount: '1', unit: 'cup', order: 4 }
                ]
            }
        };

        const template = cuisineMap[request.cuisine || 'Italian'] || cuisineMap['Italian'];

        return {
            title: template.title + (request.ingredients ? ` with ${request.ingredients[0]}` : ''),
            description: `A delicious ${template.cuisine} dish perfect for any occasion`,
            cuisine: template.cuisine,
            difficulty: request.difficulty || 'Easy',
            prepTime: 10,
            cookTime: request.cookingTime || 20,
            servings: request.servings || 4,
            ingredients: template.ingredients,
            steps: [
                { stepNumber: 1, instruction: 'Prepare all ingredients', duration: 300 },
                { stepNumber: 2, instruction: 'Heat oil in a pan', duration: 120 },
                { stepNumber: 3, instruction: 'Cook main ingredients', duration: 600 },
                { stepNumber: 4, instruction: 'Season and serve', duration: 180 }
            ],
            tips: ['This is a demo recipe', 'Add GEMINI_API_KEY for real AI recipes', 'Taste and adjust seasoning'],
            nutritionInfo: 'Demo nutrition info - varies by ingredients'
        };
    }

    /**
     * Get demo cooking tips
     */
    private static getDemoTips(recipeTitle: string, step?: string): string[] {
        return [
            'This is a demo tip - add GEMINI_API_KEY for real AI tips',
            'Cook with love and patience!',
            'Taste as you go and adjust seasonings',
            'Prep all ingredients before you start cooking'
        ];
    }

    /**
     * Parse demo voice request
     */
    private static getDemoVoiceRequest(voiceText: string): RecipeRequest {
        return {
            description: voiceText,
            difficulty: 'Easy',
            servings: 2,
            cookingTime: 30
        };
    }

    /**
     * Get demo substitutions
     */
    private static getDemoSubstitutions(ingredient: string, amount: string, unit: string): string[] {
        return [
            `Demo substitution for ${amount} ${unit} ${ingredient}`,
            'Add GEMINI_API_KEY for real AI substitutions',
            'Check cooking websites for alternatives'
        ];
    }

    /**
     * Build the main recipe generation prompt
     */
    private static buildRecipePrompt(request: RecipeRequest): string {
        return `
    Generate a detailed recipe based on these requirements:
    ${request.ingredients ? `- Available ingredients: ${request.ingredients.join(', ')}` : ''}
    ${request.cuisine ? `- Cuisine: ${request.cuisine}` : ''}
    ${request.difficulty ? `- Difficulty: ${request.difficulty}` : ''}
    ${request.cookingTime ? `- Cooking time: around ${request.cookingTime} minutes` : ''}
    ${request.servings ? `- Servings: ${request.servings}` : ''}
    ${request.dietaryRestrictions ? `- Dietary restrictions: ${request.dietaryRestrictions.join(', ')}` : ''}
    ${request.description ? `- Description: ${request.description}` : ''}

    Return ONLY a JSON object with this EXACT structure (no additional text):
    {
      "title": "Recipe Name",
      "description": "Brief description",
      "cuisine": "Cuisine type",
      "difficulty": "Easy|Medium|Hard",
      "prepTime": 15,
      "cookTime": 30,
      "servings": 4,
      "ingredients": [
        {
          "name": "ingredient name",
          "amount": "quantity",
          "unit": "unit (g, cups, tsp, etc)",
          "notes": "optional notes",
          "order": 1
        }
      ],
      "steps": [
        {
          "stepNumber": 1,
          "instruction": "detailed instruction",
          "duration": 300,
          "notes": "optional helpful notes"
        }
      ],
      "tips": ["cooking tip 1", "cooking tip 2"],
      "nutritionInfo": "brief nutrition summary"
    }

    Make sure:
    - All ingredients have realistic amounts and proper units
    - Steps have realistic durations in seconds
    - Instructions are clear and detailed
    - Recipe is practical and delicious
    `;
    }
}
