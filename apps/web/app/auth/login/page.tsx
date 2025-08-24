'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSignupSuggestion, setShowSignupSuggestion] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setShowSignupSuggestion(false);

        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err: any) {
            if (err.code === 'EMAIL_NOT_FOUND' || err.status === 404) {
                setShowSignupSuggestion(true);
                setError('This email address is not registered.');
            } else {
                setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center space-x-2">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">🍳</span>
                        </div>
                        <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent tracking-tight">
                            ChefMate
                        </h1>
                    </Link>
                    <p className="font-body text-gray-600 dark:text-gray-400 mt-2">
                        Welcome back to your cooking assistant
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                    <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6 text-center tracking-tight">
                        Sign In
                    </h2>

                    {error && (
                        <div className={`mb-6 p-4 rounded-lg border ${showSignupSuggestion
                            ? 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700'
                            : 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700'
                            }`}>
                            <p className={`text-sm ${showSignupSuggestion
                                ? 'text-blue-800 dark:text-blue-200'
                                : 'text-red-800 dark:text-red-200'
                                }`}>
                                {error}
                            </p>
                            {showSignupSuggestion && (
                                <div className="mt-3">
                                    <p className="text-blue-700 dark:text-blue-300 text-sm mb-2">
                                        Would you like to create an account instead?
                                    </p>
                                    <Link
                                        href={`/auth/signup${email ? `?email=${encodeURIComponent(email)}` : ''}`}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                                    >
                                        Create Account
                                        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-heading font-semibold text-gray-900 dark:text-white mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-body"
                                placeholder="chef@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-heading font-semibold text-gray-900 dark:text-white mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-body"
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !email || !password}
                            className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-heading font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center font-body">
                                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                    Signing In...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Demo Account */}
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
                        <h3 className="text-sm font-heading font-semibold text-blue-800 dark:text-blue-200 mb-2">
                            Demo Account
                        </h3>
                        <p className="font-body text-blue-600 dark:text-blue-300 text-sm mb-2">
                            Try ChefMate with our demo account:
                        </p>
                        <div className="text-sm font-mono text-blue-700 dark:text-blue-300">
                            <p><strong>Email:</strong> demo@chefmate.com</p>
                            <p><strong>Password:</strong> demo123</p>
                        </div>
                    </div>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <Link href="/auth/signup" className="text-orange-600 hover:text-orange-700 font-semibold">
                                Sign up here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
