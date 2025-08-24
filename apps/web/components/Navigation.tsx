'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
    showUserMenu?: boolean;
}

export default function Navigation({ showUserMenu = true }: NavigationProps) {
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">🍳</span>
                        </div>
                        <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent tracking-tight">
                            ChefMate
                        </h1>
                    </Link>

                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link href="/recipes" className="font-body text-gray-600 dark:text-gray-300 hover:text-orange-600 transition-colors">
                                    My Recipes
                                </Link>
                                <Link href="/recipes/create" className="font-body text-gray-600 dark:text-gray-300 hover:text-orange-600 transition-colors">
                                    Create Recipe
                                </Link>
                                <Link href="/ai/generate" className="font-body text-gray-600 dark:text-gray-300 hover:text-orange-600 transition-colors">
                                    AI Generate
                                </Link>

                                {showUserMenu && (
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
                                )}
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login" className="px-4 py-2 text-orange-600 hover:text-orange-800 font-medium transition-colors">
                                    Login
                                </Link>
                                <Link href="/auth/signup" className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
