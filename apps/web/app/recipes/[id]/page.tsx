'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import { apiClient } from '../../../lib/api';

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

export default function RecipeDetail() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const formatTime = (minutes: number) => {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center justify-center min-h-96">
                        <div className="text-center">
                            <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="font-body text-gray-600 dark:text-gray-400">Loading recipe...</p>
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
                                {error || 'The recipe you\'re looking for doesn\'t exist or you don\'t have permission to view it.'}
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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 print:bg-white">
            <div className="container mx-auto px-6 py-8">
                {/* Header with navigation */}
                <div className="mb-8 print:hidden">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/recipes"
                            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors font-body"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Recipes
                        </Link>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handlePrint}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-body"
                            >
                                🖨️ Print Recipe
                            </button>
                            <Link
                                href={`/recipes/${recipe.id}/edit`}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-heading font-semibold"
                            >
                                Edit Recipe
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recipe Content */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden print:shadow-none print:border-none">
                    {/* Recipe Header */}
                    <div className="p-8 border-b border-gray-200 dark:border-gray-700 print:border-black">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex-1">
                                <h1 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4 tracking-tight print:text-black">
                                    {recipe.title}
                                </h1>
                                <p className="text-lg font-body text-gray-600 dark:text-gray-300 mb-6 leading-relaxed print:text-gray-800">
                                    {recipe.description}
                                </p>

                                {/* Recipe Meta Info */}
                                <div className="flex flex-wrap gap-4 mb-6">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-heading font-semibold text-gray-900 dark:text-white print:text-black">Cuisine:</span>
                                        <span className="text-sm font-body text-gray-600 dark:text-gray-300 print:text-gray-800">{recipe.cuisine}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-heading font-semibold text-gray-900 dark:text-white print:text-black">Difficulty:</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-body font-medium ${getDifficultyColor(recipe.difficulty)} print:bg-gray-100 print:text-gray-800`}>
                                            {recipe.difficulty}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-heading font-semibold text-gray-900 dark:text-white print:text-black">Servings:</span>
                                        <span className="text-sm font-body text-gray-600 dark:text-gray-300 print:text-gray-800">{recipe.servings}</span>
                                    </div>
                                </div>

                                {/* Timing Info */}
                                <div className="flex flex-wrap gap-6">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center print:bg-gray-100">
                                            <span className="text-sm">⏰</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-heading font-semibold text-gray-900 dark:text-white print:text-black">Prep Time</p>
                                            <p className="text-sm font-body text-gray-600 dark:text-gray-300 print:text-gray-800">{formatTime(recipe.prepTime)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center print:bg-gray-100">
                                            <span className="text-sm">🔥</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-heading font-semibold text-gray-900 dark:text-white print:text-black">Cook Time</p>
                                            <p className="text-sm font-body text-gray-600 dark:text-gray-300 print:text-gray-800">{formatTime(recipe.cookTime)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center print:bg-gray-100">
                                            <span className="text-sm">⏱️</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-heading font-semibold text-gray-900 dark:text-white print:text-black">Total Time</p>
                                            <p className="text-sm font-body text-gray-600 dark:text-gray-300 print:text-gray-800">{formatTime(recipe.prepTime + recipe.cookTime)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recipe Image Placeholder */}
                            {recipe.imageUrl ? (
                                <div className="lg:ml-8 lg:w-64 mt-6 lg:mt-0">
                                    <img
                                        src={recipe.imageUrl}
                                        alt={recipe.title}
                                        className="w-full h-48 lg:h-64 object-cover rounded-lg"
                                    />
                                </div>
                            ) : (
                                <div className="lg:ml-8 lg:w-64 mt-6 lg:mt-0 print:hidden">
                                    <div className="w-full h-48 lg:h-64 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 rounded-lg flex items-center justify-center">
                                        <span className="text-6xl">🍳</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recipe Content - Two Column Layout */}
                    <div className="grid lg:grid-cols-3 gap-8 p-8">
                        {/* Ingredients - Left Column */}
                        <div className="lg:col-span-1">
                            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6 print:text-black">
                                Ingredients
                            </h2>
                            <div className="space-y-3">
                                {recipe.ingredients
                                    .sort((a, b) => a.order - b.order)
                                    .map((ingredient) => (
                                        <div key={ingredient.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg print:bg-gray-50">
                                            <div className="w-6 h-6 bg-orange-200 dark:bg-orange-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 print:bg-gray-300">
                                                <span className="text-xs font-bold text-orange-800 dark:text-orange-200 print:text-gray-700">
                                                    {ingredient.order}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-baseline space-x-2">
                                                    <span className="font-heading font-semibold text-gray-900 dark:text-white print:text-black">
                                                        {ingredient.amount}
                                                    </span>
                                                    {ingredient.unit && (
                                                        <span className="font-body text-sm text-gray-600 dark:text-gray-300 print:text-gray-700">
                                                            {ingredient.unit}
                                                        </span>
                                                    )}
                                                    <span className="font-body text-gray-900 dark:text-white print:text-black">
                                                        {ingredient.name}
                                                    </span>
                                                </div>
                                                {ingredient.notes && (
                                                    <p className="text-sm font-body text-gray-500 dark:text-gray-400 mt-1 print:text-gray-600">
                                                        {ingredient.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Instructions - Right Column */}
                        <div className="lg:col-span-2">
                            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6 print:text-black">
                                Instructions
                            </h2>
                            <div className="space-y-6">
                                {recipe.steps
                                    .sort((a, b) => a.stepNumber - b.stepNumber)
                                    .map((step) => (
                                        <div key={step.id} className="flex space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center font-heading font-bold print:bg-gray-400">
                                                    {step.stepNumber}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-body text-gray-900 dark:text-white leading-relaxed mb-3 print:text-black">
                                                    {step.instruction}
                                                </p>

                                                {(step.duration || step.temperature || step.notes) && (
                                                    <div className="flex flex-wrap gap-4 text-sm">
                                                        {step.duration && (
                                                            <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 print:text-gray-700">
                                                                <span>⏱️</span>
                                                                <span className="font-body">{formatTime(step.duration)}</span>
                                                            </div>
                                                        )}
                                                        {step.temperature && (
                                                            <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 print:text-gray-700">
                                                                <span>🌡️</span>
                                                                <span className="font-body">{step.temperature}</span>
                                                            </div>
                                                        )}
                                                        {step.notes && (
                                                            <p className="font-body text-gray-500 dark:text-gray-400 italic print:text-gray-600">
                                                                Note: {step.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>

                    {/* Recipe Footer */}
                    <div className="px-8 py-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 print:bg-white print:border-gray-300">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="mb-4 sm:mb-0">
                                {recipe.user && (
                                    <p className="font-body text-sm text-gray-600 dark:text-gray-300 print:text-gray-700">
                                        Created by <span className="font-semibold">{recipe.user.name}</span>
                                    </p>
                                )}
                                <p className="font-body text-xs text-gray-500 dark:text-gray-400 print:text-gray-600">
                                    Last updated: {new Date(recipe.updatedAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="flex items-center space-x-4 print:hidden">
                                <button className="text-gray-400 hover:text-red-500 transition-colors">
                                    <span className="text-xl">❤️</span>
                                </button>
                                <button className="text-gray-400 hover:text-blue-500 transition-colors">
                                    <span className="text-xl">🔗</span>
                                </button>
                                <button className="text-gray-400 hover:text-green-500 transition-colors">
                                    <span className="text-xl">📋</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
