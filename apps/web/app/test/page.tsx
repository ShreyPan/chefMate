'use client';

import { useState } from 'react';

export default function TestAuth() {
    const [results, setResults] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const addResult = (message: string) => {
        setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const testBackendConnection = async () => {
        setLoading(true);
        setResults([]);

        try {
            addResult('🧪 Starting backend authentication tests...');

            // Test 1: Health check
            addResult('1. Testing backend health...');
            const healthResponse = await fetch('http://localhost:4000');
            if (healthResponse.ok) {
                const healthData = await healthResponse.json();
                addResult(`✅ Backend health: ${healthData.service} v${healthData.version}`);
            } else {
                addResult(`❌ Backend health failed: ${healthResponse.status}`);
            }

            // Test 2: Test signup
            addResult('2. Testing user signup...');
            const signupData = {
                name: 'Test User',
                email: `test${Date.now()}@example.com`,
                password: 'testpass123'
            };

            const signupResponse = await fetch('http://localhost:4000/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupData)
            });

            if (signupResponse.ok) {
                const signupResult = await signupResponse.json();
                addResult(`✅ Signup successful: ${signupResult.token_type}`);

                // Test 3: Test protected route with token
                addResult('3. Testing protected route...');
                const recipesResponse = await fetch('http://localhost:4000/recipes', {
                    headers: {
                        'Authorization': `Bearer ${signupResult.access_token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (recipesResponse.ok) {
                    const recipesData = await recipesResponse.json();
                    addResult(`✅ Protected route works: Found ${recipesData.recipes?.length || 0} recipes`);
                } else {
                    addResult(`❌ Protected route failed: ${recipesResponse.status}`);
                }

                // Test 4: Test AI generation
                addResult('4. Testing AI generation...');
                const aiResponse = await fetch('http://localhost:4000/ai/generate-recipe', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${signupResult.access_token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        prompt: 'Simple pasta with tomatoes',
                        difficulty: 'Easy',
                        servings: 2
                    })
                });

                if (aiResponse.ok) {
                    const aiData = await aiResponse.json();
                    addResult(`✅ AI generation works: "${aiData.recipe?.title || 'Recipe generated'}"`);
                } else {
                    const aiError = await aiResponse.text();
                    addResult(`⚠️ AI generation issue: ${aiResponse.status} - ${aiError.slice(0, 100)}...`);
                }

            } else {
                const signupError = await signupResponse.text();
                addResult(`❌ Signup failed: ${signupResponse.status} - ${signupError.slice(0, 100)}...`);
            }

            addResult('🎉 Authentication integration test complete!');

        } catch (error) {
            addResult(`❌ Test error: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setLoading(false);
        }
    };

    const testFrontendAuth = async () => {
        setLoading(true);
        setResults([]);

        try {
            addResult('🧪 Testing frontend authentication...');

            // Import API client dynamically
            const { apiClient } = await import('../../lib/api');

            // Test health check
            addResult('1. Testing API client health...');
            const health = await apiClient.healthCheck();
            addResult(`✅ API client works: ${health.service}`);

            // Test signup
            addResult('2. Testing API client signup...');
            const testEmail = `frontend${Date.now()}@test.com`;
            const signupResult = await apiClient.signup('Frontend Test', testEmail, 'test123456');
            addResult(`✅ Frontend signup works: ${signupResult.token_type}`);

            // Test recipes
            addResult('3. Testing protected API call...');
            const recipes = await apiClient.getRecipes();
            addResult(`✅ Protected API works: ${recipes.recipes.length} recipes`);

            addResult('🎉 Frontend authentication test complete!');

        } catch (error) {
            addResult(`❌ Frontend test error: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    🧪 Authentication Integration Tests
                </h1>

                <div className="space-y-4 mb-8">
                    <button
                        onClick={testBackendConnection}
                        disabled={loading}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed mr-4"
                    >
                        {loading ? 'Testing...' : 'Test Backend Directly'}
                    </button>

                    <button
                        onClick={testFrontendAuth}
                        disabled={loading}
                        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Testing...' : 'Test Frontend API Client'}
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Test Results</h2>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                        {results.length === 0 ? (
                            <div className="text-gray-500">Click a test button to run authentication tests...</div>
                        ) : (
                            results.map((result, index) => (
                                <div key={index} className="mb-1">
                                    {result}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <a href="/" className="text-blue-600 hover:text-blue-700">
                        ← Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
}
