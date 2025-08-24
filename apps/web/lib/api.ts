// API configuration and client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface AuthTokens {
    access_token: string;
    token_type: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Recipe {
    id: number;
    title: string;
    description: string;
    cuisine: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    prepTime: number;
    cookTime: number;
    servings: number;
    imageUrl?: string;
    isPublic: boolean;
    ingredients: Array<{
        id: number;
        name: string;
        amount: string;
        unit?: string;
        notes?: string;
        order: number;
    }>;
    steps: Array<{
        id: number;
        stepNumber: number;
        instruction: string;
        duration?: number;
        temperature?: string;
        notes?: string;
    }>;
    user?: {
        id: number;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface CreateRecipeData {
    title: string;
    description: string;
    cuisine: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    prepTime: number;
    cookTime: number;
    servings: number;
    imageUrl?: string;
    isPublic: boolean;
    ingredients: Array<{
        name: string;
        amount: string;
        unit?: string;
        notes?: string;
        order: number;
    }>;
    steps: Array<{
        stepNumber: number;
        instruction: string;
        duration?: number;
        temperature?: string;
        notes?: string;
    }>;
}

interface CookingSession {
    id: number;
    recipeId: number;
    currentStep: number;
    isActive: boolean;
    notes?: string;
    startedAt: string;
    completedAt?: string;
    recipe: Recipe;
}

interface AIGenerateRequest {
    prompt: string;
    dietary_restrictions?: string[];
    cuisine_type?: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    prep_time?: number;
    servings?: number;
}

class ApiClient {
    private baseURL: string;
    private token: string | null = null;

    constructor() {
        this.baseURL = API_BASE_URL;
        // Load token from localStorage on client side only
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('authToken');
        }
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const config: RequestInit = {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    // Auth methods
    async signup(name: string, email: string, password: string): Promise<AuthTokens> {
        const response = await this.request<AuthTokens>('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });

        this.setToken(response.access_token);
        return response;
    }

    async login(email: string, password: string): Promise<AuthTokens> {
        const response = await this.request<AuthTokens>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        this.setToken(response.access_token);
        return response;
    }

    logout(): void {
        this.token = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
        }
    }

    private setToken(token: string): void {
        this.token = token;
        if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', token);
        }
    }

    isAuthenticated(): boolean {
        return !!this.token;
    }

    // Recipe methods
    async getRecipes(): Promise<{ recipes: Recipe[] }> {
        return this.request<{ recipes: Recipe[] }>('/recipes');
    }

    async getRecipe(id: number): Promise<{ recipe: Recipe }> {
        return this.request<{ recipe: Recipe }>(`/recipes/${id}`);
    }

    async createRecipe(recipeData: CreateRecipeData): Promise<{ recipe: Recipe }> {
        return this.request<{ recipe: Recipe }>('/recipes', {
            method: 'POST',
            body: JSON.stringify(recipeData),
        });
    }

    async updateRecipe(id: number, recipeData: Partial<Recipe>): Promise<{ recipe: Recipe }> {
        return this.request<{ recipe: Recipe }>(`/recipes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(recipeData),
        });
    }

    async deleteRecipe(id: number): Promise<{ message: string }> {
        return this.request<{ message: string }>(`/recipes/${id}`, {
            method: 'DELETE',
        });
    }

    // Cooking session methods
    async startCookingSession(recipeId: number): Promise<{ session: CookingSession; message: string }> {
        return this.request<{ session: CookingSession; message: string }>('/cooking/start', {
            method: 'POST',
            body: JSON.stringify({ recipeId }),
        });
    }

    async getActiveCookingSession(): Promise<{ session: CookingSession | null }> {
        return this.request<{ session: CookingSession | null }>('/cooking/active');
    }

    async updateCookingStep(currentStep: number, notes?: string): Promise<{ session: CookingSession; message: string }> {
        return this.request<{ session: CookingSession; message: string }>('/cooking/step', {
            method: 'PATCH',
            body: JSON.stringify({ currentStep, notes }),
        });
    }

    async completeCookingSession(notes?: string): Promise<{ message: string }> {
        return this.request<{ message: string }>('/cooking/complete', {
            method: 'POST',
            body: JSON.stringify({ notes }),
        });
    }

    async cancelCookingSession(): Promise<{ message: string }> {
        return this.request<{ message: string }>('/cooking/cancel', {
            method: 'DELETE',
        });
    }

    async getCookingHistory(): Promise<{ sessions: CookingSession[] }> {
        return this.request<{ sessions: CookingSession[] }>('/cooking/history');
    }

    // AI methods
    async generateRecipe(data: AIGenerateRequest): Promise<{ recipe: Recipe }> {
        return this.request<{ recipe: Recipe }>('/ai/generate-recipe', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async processVoiceCommand(command: string): Promise<{ response: string; action?: string; data?: any }> {
        return this.request<{ response: string; action?: string; data?: any }>('/ai/voice-command', {
            method: 'POST',
            body: JSON.stringify({ command }),
        });
    }

    async getCookingTips(context: string): Promise<{ tips: string[] }> {
        return this.request<{ tips: string[] }>('/ai/cooking-tips', {
            method: 'POST',
            body: JSON.stringify({ context }),
        });
    }

    async getIngredientSubstitutions(ingredient: string, amount: string, context?: string): Promise<{ substitutions: Array<{ ingredient: string; amount: string; notes: string }> }> {
        return this.request<{ substitutions: Array<{ ingredient: string; amount: string; notes: string }> }>('/ai/substitutions', {
            method: 'POST',
            body: JSON.stringify({ ingredient, amount, context }),
        });
    }

    // Health check
    async healthCheck(): Promise<any> {
        return this.request<any>('/');
    }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types for use in components
export type {
    Recipe,
    CreateRecipeData,
    CookingSession,
    User,
    AuthTokens,
    AIGenerateRequest
};
