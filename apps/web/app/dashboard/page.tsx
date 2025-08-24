'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

interface Recipe {
    id: number;
    title: string;
    description: string;
    cuisine: string;
    difficulty: string;
    prepTime: number;
    cookTime: number;
    servings: number;
    createdAt: string;
}

interface CookingSession {
    id: number;
    recipe: Recipe;
    currentStep: number;
    isActive: boolean;
    startedAt: string;
}

export default function Dashboard() {
    const { user, logout, isAuthenticated } = useAuth();
    const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
    const [activeSession, setActiveSession] = useState<CookingSession | null>(null);
    const [loading, setLoading] = useState(true);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            window.location.href = '/auth/login';
            return;
        }
    }, [isAuthenticated]);

    // Show loading or redirect if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    useEffect(() => {
        if (!isAuthenticated) return;

        // Mock data for now - will connect to API later
        setRecentRecipes([
            {
                id: 1,
                title: "Spaghetti Carbonara",
                description: "Classic Italian pasta dish",
                cuisine: "Italian",
                difficulty: "Medium",
                prepTime: 15,
                cookTime: 20,
                servings: 4,
                createdAt: "2025-08-24T10:00:00Z"
            },
            {
                id: 2,
                title: "Chicken Teriyaki",
                description: "Japanese-style glazed chicken",
                cuisine: "Japanese",
                difficulty: "Easy",
                prepTime: 10,
                cookTime: 25,
                servings: 3,
                createdAt: "2025-08-23T15:30:00Z"
            }
        ]);
        setLoading(false);
    }, []);

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
                        <div className="flex items-center space-x-4">
                            <Link href="/recipes" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 transition-colors">
                                Recipes
                            </Link>
                            <Link href="/ai/generate" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 transition-colors">
                                AI Generate
                            </Link>

                            {/* User Menu */}
                            <div className="flex items-center space-x-3">
                                <span className="text-gray-700 dark:text-gray-300 font-medium">
                                    Welcome, {user?.name || 'Chef'}!
                                </span>
                                <div className="relative group">
                                    <button className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </button>
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <div className="py-1">
                                            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                                                <div className="font-medium">{user?.name}</div>
                                                <div className="text-gray-500 dark:text-gray-400">{user?.email}</div>
                                            </div>
                                            <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Profile Settings
                                            </Link>
                                            <button
                                                onClick={logout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-6 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome back, Chef!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Ready to cook something amazing today?
                    </p>
                </div>

                {/* Active Cooking Session */}
                {activeSession && (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 mb-8 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold mb-2">Currently Cooking</h3>
                                <p className="text-lg">{activeSession.recipe.title}</p>
                                <p className="opacity-90">Step {activeSession.currentStep} in progress</p>
                            </div>
                            <Link href={`/cooking/${activeSession.id}`} className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                Continue Cooking
                            </Link>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Link href="/ai/generate" className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">✨</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Generate Recipe</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered recipe creation</p>
                        </div>
                    </Link>

                    <Link href="/recipes/new" className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">📝</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Create Recipe</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Add your own recipe</p>
                        </div>
                    </Link>

                    <Link href="/recipes" className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">📚</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Browse Recipes</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Explore recipe collection</p>
                        </div>
                    </Link>

                    <Link href="/voice" className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">🎤</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Voice Assistant</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Hands-free cooking</p>
                        </div>
                    </Link>
                </div>

                {/* Recent Recipes */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Recipes</h3>
                            <Link href="/recipes" className="text-orange-600 hover:text-orange-700 font-medium">
                                View All
                            </Link>
                        </div>
                    </div>
                    <div className="p-6">
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">Loading recipes...</p>
                            </div>
                        ) : recentRecipes.length === 0 ? (
                            <div className="text-center py-8">
                                <span className="text-4xl mb-4 block">👨‍🍳</span>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">No recipes yet!</p>
                                <Link href="/ai/generate" className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                                    Generate Your First Recipe
                                </Link>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 gap-4">
                                {recentRecipes.map((recipe) => (
                                    <div key={recipe.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-gray-900 dark:text-white">{recipe.title}</h4>
                                            <span className={`px-2 py-1 text-xs rounded-full ${recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                }`}>
                                                {recipe.difficulty}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{recipe.description}</p>
                                        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                                            <span>🍽️ {recipe.servings} servings</span>
                                            <span>⏱️ {recipe.prepTime + recipe.cookTime} min</span>
                                            <span>🌍 {recipe.cuisine}</span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Link href={`/recipes/${recipe.id}`} className="flex-1 bg-orange-500 text-white text-center py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
                                                View Recipe
                                            </Link>
                                            <Link href={`/cooking/start/${recipe.id}`} className="flex-1 border border-orange-500 text-orange-600 text-center py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900 transition-colors text-sm font-medium">
                                                Start Cooking
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
