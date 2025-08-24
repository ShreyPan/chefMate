'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';

interface GeneratedRecipe {
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
        unit?: string;
        notes?: string;
    }>;
    steps: Array<{
        stepNumber: number;
        instruction: string;
        duration?: number;
        temperature?: string;
        notes?: string;
    }>;
}

export default function AIGenerateRecipe() {
    const { user, isAuthenticated } = useAuth();
    const [prompt, setPrompt] = useState('');
    const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
    const [cuisineType, setCuisineType] = useState('');
    const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
    const [prepTime, setPrepTime] = useState<number>(30);
    const [servings, setServings] = useState<number>(4);
    const [loading, setLoading] = useState(false);
    const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);
    const [error, setError] = useState<string | null>(null);

    const dietaryOptions = [
        'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Low-Carb', 'Paleo', 'Nut-Free'
    ];

    const cuisineOptions = [
        'Italian', 'Chinese', 'Mexican', 'Indian', 'Thai', 'Japanese', 'French', 'Mediterranean', 'American', 'Korean'
    ];

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            window.location.href = '/auth/login';
            return;
        }
    }, [isAuthenticated]);

    // Show loading if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    const toggleDietaryRestriction = (restriction: string) => {
        setDietaryRestrictions(prev =>
            prev.includes(restriction)
                ? prev.filter(r => r !== restriction)
                : [...prev, restriction]
        );
    };

    const generateRecipe = async () => {
        if (!prompt.trim()) {
            setError('Please describe what you want to cook');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Import API client dynamically to avoid SSR issues
            const { apiClient } = await import('../../../lib/api');

            const response = await apiClient.generateRecipe({
                prompt: prompt.trim(),
                dietary_restrictions: dietaryRestrictions.length > 0 ? dietaryRestrictions : undefined,
                cuisine_type: cuisineType || undefined,
                difficulty,
                prep_time: prepTime,
                servings
            });

            setGeneratedRecipe(response.recipe);
        } catch (err) {
            console.error('Recipe generation error:', err);
            setError(err instanceof Error ? err.message : 'Failed to generate recipe. Please try again.');

            // Fallback to mock data for demo purposes
            const mockRecipe: GeneratedRecipe = {
                title: "Demo Recipe - " + prompt.slice(0, 30),
                description: "A wonderful dish generated based on your preferences (demo mode)",
                cuisine: cuisineType || "International",
                difficulty,
                prepTime,
                cookTime: 25,
                servings,
                ingredients: [
                    { name: "Main Ingredient", amount: "400", unit: "g", notes: "Primary component" },
                    { name: "Seasoning", amount: "2", unit: "tbsp" },
                    { name: "Oil/Fat", amount: "2", unit: "tbsp", notes: "For cooking" },
                    { name: "Aromatics", amount: "1", unit: "piece", notes: "Onion, garlic, etc." }
                ],
                steps: [
                    { stepNumber: 1, instruction: "Prepare all ingredients according to the recipe", duration: 300 },
                    { stepNumber: 2, instruction: "Heat oil in a large pan over medium heat", duration: 120 },
                    { stepNumber: 3, instruction: "Add aromatics and cook until fragrant", duration: 180 },
                    { stepNumber: 4, instruction: "Add main ingredients and seasonings", duration: 60 },
                    { stepNumber: 5, instruction: "Cook according to your preferences", duration: 600 },
                    { stepNumber: 6, instruction: "Taste and adjust seasonings", duration: 30 },
                    { stepNumber: 7, instruction: "Serve immediately while hot", duration: 0, notes: "Enjoy!" }
                ]
            };
            setGeneratedRecipe(mockRecipe);
        } finally {
            setLoading(false);
        }
    };

    const saveRecipe = async () => {
        if (!generatedRecipe) return;

        try {
            const { apiClient } = await import('../../../lib/api');

            const recipeData = {
                title: generatedRecipe.title,
                description: generatedRecipe.description,
                cuisine: generatedRecipe.cuisine,
                difficulty: generatedRecipe.difficulty as 'Easy' | 'Medium' | 'Hard',
                prepTime: generatedRecipe.prepTime,
                cookTime: generatedRecipe.cookTime,
                servings: generatedRecipe.servings,
                isPublic: false,
                ingredients: generatedRecipe.ingredients.map((ing, index) => ({
                    name: ing.name,
                    amount: ing.amount,
                    unit: ing.unit,
                    notes: ing.notes,
                    order: index + 1
                })),
                steps: generatedRecipe.steps.map(step => ({
                    stepNumber: step.stepNumber,
                    instruction: step.instruction,
                    duration: step.duration,
                    temperature: step.temperature,
                    notes: step.notes
                }))
            };

            await apiClient.createRecipe(recipeData);
            alert('Recipe saved to your collection!');
        } catch (error) {
            console.error('Save recipe error:', error);
            alert('Failed to save recipe. Please try again.');
        }
    };

    if (generatedRecipe) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Navigation */}
                <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex justify-between items-center">
                            <Link href="/" className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">🍳</span>
                                </div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                    ChefMate
                                </h1>
                            </Link>
                            <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 transition-colors">
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </nav>

                <main className="container mx-auto px-6 py-8">
                    {/* Recipe Header */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {generatedRecipe.title}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {generatedRecipe.description}
                                </p>
                                <div className="flex flex-wrap gap-4 text-sm">
                                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                                        {generatedRecipe.cuisine}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full ${generatedRecipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                            generatedRecipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                        }`}>
                                        {generatedRecipe.difficulty}
                                    </span>
                                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full">
                                        🍽️ {generatedRecipe.servings} servings
                                    </span>
                                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full">
                                        ⏱️ {generatedRecipe.prepTime + generatedRecipe.cookTime} min total
                                    </span>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={saveRecipe}
                                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                                >
                                    Save Recipe
                                </button>
                                <Link
                                    href={`/cooking/start/generated`}
                                    className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                                >
                                    Start Cooking
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Ingredients */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ingredients</h2>
                                <ul className="space-y-3">
                                    {generatedRecipe.ingredients.map((ingredient, index) => (
                                        <li key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                                            <div>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {ingredient.name}
                                                </span>
                                                {ingredient.notes && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {ingredient.notes}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="text-orange-600 font-semibold">
                                                {ingredient.amount} {ingredient.unit}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Instructions</h2>
                                <div className="space-y-4">
                                    {generatedRecipe.steps.map((step) => (
                                        <div key={step.stepNumber} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                                {step.stepNumber}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-gray-900 dark:text-white mb-2">
                                                    {step.instruction}
                                                </p>
                                                <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                    {step.duration && (
                                                        <span>⏱️ {Math.floor(step.duration / 60)}:{(step.duration % 60).toString().padStart(2, '0')}</span>
                                                    )}
                                                    {step.temperature && (
                                                        <span>🌡️ {step.temperature}</span>
                                                    )}
                                                </div>
                                                {step.notes && (
                                                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                                                        💡 {step.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setGeneratedRecipe(null)}
                            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold mr-4"
                        >
                            Generate Another Recipe
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Navigation */}
            <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">🍳</span>
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                ChefMate
                            </h1>
                        </Link>
                        <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 transition-colors">
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-6 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            AI Recipe Generator
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Describe what you want to cook, and our AI will generate a detailed recipe for you.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        {/* Recipe Description */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                What do you want to cook? *
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., A healthy pasta dish with vegetables, or comfort food for a rainy day..."
                                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                rows={4}
                            />
                        </div>

                        {/* Dietary Restrictions */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                Dietary Restrictions
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {dietaryOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => toggleDietaryRestriction(option)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${dietaryRestrictions.includes(option)
                                                ? 'bg-orange-500 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Preferences Grid */}
                        <div className="grid sm:grid-cols-2 gap-6 mb-6">
                            {/* Cuisine Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Cuisine Type
                                </label>
                                <select
                                    value={cuisineType}
                                    onChange={(e) => setCuisineType(e.target.value)}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="">Any Cuisine</option>
                                    {cuisineOptions.map((cuisine) => (
                                        <option key={cuisine} value={cuisine}>{cuisine}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Difficulty */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Difficulty Level
                                </label>
                                <select
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>

                            {/* Prep Time */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Prep Time (minutes)
                                </label>
                                <input
                                    type="number"
                                    value={prepTime}
                                    onChange={(e) => setPrepTime(parseInt(e.target.value) || 30)}
                                    min="5"
                                    max="120"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            {/* Servings */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Servings
                                </label>
                                <input
                                    type="number"
                                    value={servings}
                                    onChange={(e) => setServings(parseInt(e.target.value) || 4)}
                                    min="1"
                                    max="12"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
                                <p className="text-red-800 dark:text-red-200">{error}</p>
                            </div>
                        )}

                        {/* Generate Button */}
                        <button
                            onClick={generateRecipe}
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                    Generating Recipe...
                                </div>
                            ) : (
                                'Generate Recipe'
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
