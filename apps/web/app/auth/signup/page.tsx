'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { signup } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Pre-fill email if coming from login page
    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setEmail(decodeURIComponent(emailParam));
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            await signup(name, email, password);
            router.push('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
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
                        Join thousands of home chefs
                    </p>
                </div>

                {/* Signup Form */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                    <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6 text-center tracking-tight">
                        Create Account
                    </h2>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
                            <p className="font-body text-red-800 dark:text-red-200 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="Your full name"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="chef@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="At least 6 characters"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="Confirm your password"
                            />
                        </div>

                        {/* Password Strength Indicator */}
                        {password && (
                            <div className="space-y-2">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Password strength:
                                </div>
                                <div className="flex space-x-1">
                                    <div className={`h-2 w-1/4 rounded ${password.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    <div className={`h-2 w-1/4 rounded ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    <div className={`h-2 w-1/4 rounded ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    <div className={`h-2 w-1/4 rounded ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !name || !email || !password || !confirmPassword || password !== confirmPassword}
                            className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                    Creating Account...
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Terms */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            By creating an account, you agree to our{' '}
                            <Link href="/terms" className="text-orange-600 hover:text-orange-700">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-orange-600 hover:text-orange-700">
                                Privacy Policy
                            </Link>
                        </p>
                    </div>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link href="/auth/login" className="text-orange-600 hover:text-orange-700 font-semibold">
                                Sign in here
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
