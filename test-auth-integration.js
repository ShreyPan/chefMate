// Test authentication integration with backend
import { apiClient } from '../apps/web/lib/api.js';

async function testAuth() {
    console.log('🧪 Testing Backend Authentication Integration...\n');

    try {
        // Test 1: Health check
        console.log('1. Testing backend connection...');
        const health = await apiClient.healthCheck();
        console.log('✅ Backend connected:', health.service);

        // Test 2: Test signup with new user
        console.log('\n2. Testing user signup...');
        const testEmail = `test${Date.now()}@chefmate.com`;
        const testName = 'Test Chef';
        const testPassword = 'testpass123';

        try {
            const signupResult = await apiClient.signup(testName, testEmail, testPassword);
            console.log('✅ Signup successful:', {
                token_type: signupResult.token_type,
                token_length: signupResult.access_token.length
            });
        } catch (signupError) {
            console.log('⚠️ Signup error (might be expected):', signupError.message);
        }

        // Test 3: Test login with existing demo user
        console.log('\n3. Testing user login...');
        try {
            const loginResult = await apiClient.login('demo@chefmate.com', 'demo123');
            console.log('✅ Login successful:', {
                token_type: loginResult.token_type,
                token_length: loginResult.access_token.length
            });
        } catch (loginError) {
            console.log('⚠️ Login error:', loginError.message);
        }

        // Test 4: Test protected route (recipes)
        console.log('\n4. Testing protected route access...');
        try {
            const recipes = await apiClient.getRecipes();
            console.log('✅ Protected route accessible:', `Found ${recipes.recipes.length} recipes`);
        } catch (protectedError) {
            console.log('⚠️ Protected route error:', protectedError.message);
        }

        // Test 5: Test AI generation
        console.log('\n5. Testing AI recipe generation...');
        try {
            const aiRecipe = await apiClient.generateRecipe({
                prompt: 'Simple pasta dish',
                difficulty: 'Easy',
                servings: 2
            });
            console.log('✅ AI generation successful:', aiRecipe.recipe.title);
        } catch (aiError) {
            console.log('⚠️ AI generation error:', aiError.message);
        }

        console.log('\n🎉 Authentication integration test complete!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testAuth();
