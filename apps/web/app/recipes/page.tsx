'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../lib/api';

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

export default function RecipesPage() {
    const { user, isAuthenticated } = useAuth();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated) {
            loadRecipes();
        }
    }, [isAuthenticated]);

    const loadRecipes = async () => {
        try {
            setLoading(true);
            const response = await apiClient.getRecipes();
            setRecipes(response.recipes || []);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load recipes');
            console.error('Failed to load recipes:', err);
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Please log in to view your recipes
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                My Recipes
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Welcome back, {user?.name}! Manage your culinary creations.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => window.location.href = '/recipes/create'}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                            >
                                + Create Recipe
                            </button>
                            <button
                                onClick={() => window.location.href = '/ai-generate'}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
                            >
                                🤖 AI Generate
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="text-gray-600 dark:text-gray-400 mt-4">Loading your recipes...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                        <p className="text-red-800 dark:text-red-200">
                            Error: {error}
                        </p>
                        <button
                            onClick={loadRecipes}
                            className="mt-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && recipes.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🍳</div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No recipes yet
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Start building your recipe collection! Create your first recipe or let AI generate one for you.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Link
                                href="/recipes/create"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                            >
                                Create Your First Recipe
                            </Link>
                            <Link
                                href="/ai-generate"
                                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
                            >
                                Generate with AI
                            </Link>
                        </div>
                    </div>
                )}

                {/* Recipes Grid */}
                {!loading && !error && recipes.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recipes.map((recipe) => (
                            <Link
                                key={recipe.id}
                                href={`/recipes/${recipe.id}`}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300 cursor-pointer block"
                            >
                                {/* Recipe Image */}
                                <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 rounded-t-xl flex items-center justify-center">
                                    {recipe.imageUrl ? (
                                        <img
                                            src={recipe.imageUrl}
                                            alt={recipe.title}
                                            className="w-full h-full object-cover rounded-t-xl"
                                        />
                                    ) : (
                                        <div className="text-6xl text-white opacity-80">
                                            🍽️
                                        </div>
                                    )}
                                </div>

                                {/* Recipe Content */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                                            {recipe.title}
                                        </h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                                            {recipe.difficulty}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                        {recipe.description}
                                    </p>

                                    {/* Recipe Stats */}
                                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        <span>⏱️ {recipe.prepTime + recipe.cookTime} min</span>
                                        <span>👥 {recipe.servings} servings</span>
                                        <span>🌎 {recipe.cuisine}</span>
                                    </div>

                                    {/* Recipe Tags */}
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-2">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {recipe.ingredients.length} ingredients
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {recipe.steps.length} steps
                                            </span>
                                        </div>
                                        {recipe.isPublic && (
                                            <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full">
                                                Public
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
