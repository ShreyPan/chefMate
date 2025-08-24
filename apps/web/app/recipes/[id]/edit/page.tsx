'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../../contexts/AuthContext';
import { apiClient } from '../../../../lib/api';

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
}

export default function EditRecipe() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [recipe, setRecipe] = useState<Recipe | null>(null);

    const recipeId = params.id as string;

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }

        fetchRecipe();
    }, [isAuthenticated, recipeId]);

    const fetchRecipe = async () => {
        try {
            setLoading(true);
            const response = await apiClient.getRecipe(parseInt(recipeId));
            setRecipe(response.recipe);
        } catch (err: any) {
            console.error('Failed to fetch recipe:', err);
            setError(err.message || 'Failed to load recipe');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!recipe) return;

        try {
            setSaving(true);
            setError('');

            const updateData = {
                title: recipe.title,
                description: recipe.description,
                cuisine: recipe.cuisine,
                difficulty: recipe.difficulty,
                prepTime: recipe.prepTime,
                cookTime: recipe.cookTime,
                servings: recipe.servings,
                isPublic: recipe.isPublic,
                ingredients: recipe.ingredients.map(ing => ({
                    id: ing.id,
                    name: ing.name,
                    amount: ing.amount,
                    unit: ing.unit || '',
                    notes: ing.notes || '',
                    order: ing.order
                })),
                steps: recipe.steps.map(step => ({
                    id: step.id,
                    stepNumber: step.stepNumber,
                    instruction: step.instruction,
                    duration: step.duration || undefined,
                    temperature: step.temperature || undefined,
                    notes: step.notes || undefined
                }))
            };

            await apiClient.updateRecipe(parseInt(recipeId), updateData);
            router.push(`/recipes/${recipeId}`);
        } catch (err: any) {
            setError(err.message || 'Failed to update recipe');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center justify-center min-h-96">
                        <div className="text-center">
                            <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="font-body text-gray-600 dark:text-gray-400">Loading recipe for editing...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-6 py-8">
                    <div className="text-center min-h-96 flex items-center justify-center">
                        <div>
                            <div className="w-24 h-24 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">😞</span>
                            </div>
                            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                                Recipe Not Found
                            </h2>
                            <p className="font-body text-gray-600 dark:text-gray-400 mb-6">
                                {error || 'The recipe you\'re trying to edit doesn\'t exist or you don\'t have permission to edit it.'}
                            </p>
                            <Link
                                href="/recipes"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-heading font-semibold"
                            >
                                ← Back to Recipes
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <Link
                            href={`/recipes/${recipeId}`}
                            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors font-body"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Recipe
                        </Link>
                        <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                            Edit Recipe
                        </h1>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
                            <p className="font-body text-red-800 dark:text-red-200 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-heading font-semibold text-gray-900 dark:text-white mb-2">
                                    Recipe Title
                                </label>
                                <input
                                    type="text"
                                    value={recipe.title}
                                    onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-body"
                                />
                            </div>

                            <div className="lg:col-span-2">
                                <label className="block text-sm font-heading font-semibold text-gray-900 dark:text-white mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={recipe.description}
                                    onChange={(e) => setRecipe({ ...recipe, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-body"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-heading font-semibold text-gray-900 dark:text-white mb-2">
                                    Cuisine
                                </label>
                                <input
                                    type="text"
                                    value={recipe.cuisine}
                                    onChange={(e) => setRecipe({ ...recipe, cuisine: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-body"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-heading font-semibold text-gray-900 dark:text-white mb-2">
                                    Difficulty
                                </label>
                                <select
                                    value={recipe.difficulty}
                                    onChange={(e) => setRecipe({ ...recipe, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-body"
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-heading font-semibold text-gray-900 dark:text-white mb-2">
                                    Prep Time (minutes)
                                </label>
                                <input
                                    type="number"
                                    value={recipe.prepTime}
                                    onChange={(e) => setRecipe({ ...recipe, prepTime: parseInt(e.target.value) || 0 })}
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-body"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-heading font-semibold text-gray-900 dark:text-white mb-2">
                                    Cook Time (minutes)
                                </label>
                                <input
                                    type="number"
                                    value={recipe.cookTime}
                                    onChange={(e) => setRecipe({ ...recipe, cookTime: parseInt(e.target.value) || 0 })}
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-body"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-heading font-semibold text-gray-900 dark:text-white mb-2">
                                    Servings
                                </label>
                                <input
                                    type="number"
                                    value={recipe.servings}
                                    onChange={(e) => setRecipe({ ...recipe, servings: parseInt(e.target.value) || 1 })}
                                    min="1"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-body"
                                />
                            </div>

                            <div>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={recipe.isPublic}
                                        onChange={(e) => setRecipe({ ...recipe, isPublic: e.target.checked })}
                                        className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                                    />
                                    <span className="text-sm font-heading font-semibold text-gray-900 dark:text-white">
                                        Make recipe public
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end space-x-4">
                            <Link
                                href={`/recipes/${recipeId}`}
                                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-heading font-semibold"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-heading font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                        Saving...
                                    </div>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
