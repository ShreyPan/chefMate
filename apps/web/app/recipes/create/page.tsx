'use client';

import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { apiClient } from '../../../lib/api';

interface Ingredient {
    name: string;
    amount: string;
    unit?: string;
    notes?: string;
}

interface Step {
    instruction: string;
    duration?: number;
    temperature?: string;
    notes?: string;
}

export default function CreateRecipePage() {
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Recipe form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
    const [prepTime, setPrepTime] = useState(15);
    const [cookTime, setCookTime] = useState(30);
    const [servings, setServings] = useState(4);
    const [imageUrl, setImageUrl] = useState('');
    const [isPublic, setIsPublic] = useState(false);

    // Ingredients state
    const [ingredients, setIngredients] = useState<Ingredient[]>([
        { name: '', amount: '', unit: '', notes: '' }
    ]);

    // Steps state
    const [steps, setSteps] = useState<Step[]>([
        { instruction: '', duration: undefined, temperature: '', notes: '' }
    ]);

    const addIngredient = () => {
        setIngredients([...ingredients, { name: '', amount: '', unit: '', notes: '' }]);
    };

    const removeIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
        const updated = [...ingredients];
        updated[index] = { ...updated[index], [field]: value };
        setIngredients(updated);
    };

    const addStep = () => {
        setSteps([...steps, { instruction: '', duration: undefined, temperature: '', notes: '' }]);
    };

    const removeStep = (index: number) => {
        setSteps(steps.filter((_, i) => i !== index));
    };

    const updateStep = (index: number, field: keyof Step, value: string | number | undefined) => {
        const updated = [...steps];
        updated[index] = { ...updated[index], [field]: value };
        setSteps(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            setError('Title and description are required');
            return;
        }

        if (ingredients.filter(ing => ing.name.trim()).length === 0) {
            setError('At least one ingredient is required');
            return;
        }

        if (steps.filter(step => step.instruction.trim()).length === 0) {
            setError('At least one step is required');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const validIngredients = ingredients
                .filter(ing => ing.name.trim())
                .map((ing, index) => ({ ...ing, order: index + 1 }));

            const validSteps = steps
                .filter(step => step.instruction.trim())
                .map((step, index) => ({ ...step, stepNumber: index + 1 }));

            const recipeData = {
                title: title.trim(),
                description: description.trim(),
                cuisine: cuisine.trim() || 'International',
                difficulty,
                prepTime,
                cookTime,
                servings,
                imageUrl: imageUrl.trim() || undefined,
                isPublic,
                ingredients: validIngredients,
                steps: validSteps
            };

            const response = await apiClient.createRecipe(recipeData);

            // Redirect to the new recipe
            window.location.href = `/recipes/${response.recipe.id}`;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create recipe');
            console.error('Failed to create recipe:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Please log in to create recipes
                    </h1>
                    <a
                        href="/auth/login"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Go to Login →
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Create New Recipe
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Share your culinary masterpiece with the world
                            </p>
                        </div>
                        <a
                            href="/recipes"
                            className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                            ← Back to Recipes
                        </a>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <p className="text-red-800 dark:text-red-200">{error}</p>
                        </div>
                    )}

                    {/* Basic Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Basic Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Recipe Title *
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter recipe title..."
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    placeholder="Describe your recipe..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Cuisine
                                </label>
                                <input
                                    type="text"
                                    value={cuisine}
                                    onChange={(e) => setCuisine(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    placeholder="e.g., Italian, Mexican, Asian..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Difficulty
                                </label>
                                <select
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Prep Time (minutes)
                                </label>
                                <input
                                    type="number"
                                    value={prepTime}
                                    onChange={(e) => setPrepTime(parseInt(e.target.value) || 0)}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Cook Time (minutes)
                                </label>
                                <input
                                    type="number"
                                    value={cookTime}
                                    onChange={(e) => setCookTime(parseInt(e.target.value) || 0)}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Servings
                                </label>
                                <input
                                    type="number"
                                    value={servings}
                                    onChange={(e) => setServings(parseInt(e.target.value) || 1)}
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Image URL (optional)
                                </label>
                                <input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isPublic"
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    Make recipe public
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Ingredients Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ingredients</h2>
                            <button
                                type="button"
                                onClick={addIngredient}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
                            >
                                + Add Ingredient
                            </button>
                        </div>

                        <div className="space-y-4">
                            {ingredients.map((ingredient, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Ingredient Name
                                        </label>
                                        <input
                                            type="text"
                                            value={ingredient.name}
                                            onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="e.g., Olive oil"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Amount
                                        </label>
                                        <input
                                            type="text"
                                            value={ingredient.amount}
                                            onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="e.g., 2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Unit
                                        </label>
                                        <input
                                            type="text"
                                            value={ingredient.unit || ''}
                                            onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="e.g., tbsp, cups"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={ingredient.notes || ''}
                                            onChange={(e) => updateIngredient(index, 'notes', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="Notes (optional)"
                                        />
                                        {ingredients.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeIngredient(index)}
                                                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Steps Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Instructions</h2>
                            <button
                                type="button"
                                onClick={addStep}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
                            >
                                + Add Step
                            </button>
                        </div>

                        <div className="space-y-6">
                            {steps.map((step, index) => (
                                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                            Step {index + 1}
                                        </h3>
                                        {steps.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeStep(index)}
                                                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Instruction
                                            </label>
                                            <textarea
                                                value={step.instruction}
                                                onChange={(e) => updateStep(index, 'instruction', e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                placeholder="Describe what to do in this step..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Duration (minutes)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={step.duration || ''}
                                                    onChange={(e) => updateStep(index, 'duration', e.target.value ? parseInt(e.target.value) : undefined)}
                                                    min="0"
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                    placeholder="Optional"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Temperature
                                                </label>
                                                <input
                                                    type="text"
                                                    value={step.temperature || ''}
                                                    onChange={(e) => updateStep(index, 'temperature', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                    placeholder="e.g., 350°F, Medium heat"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Notes
                                                </label>
                                                <input
                                                    type="text"
                                                    value={step.notes || ''}
                                                    onChange={(e) => updateStep(index, 'notes', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                    placeholder="Optional notes"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <a
                            href="/recipes"
                            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium"
                        >
                            Cancel
                        </a>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                        >
                            {loading ? 'Creating Recipe...' : 'Create Recipe'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
