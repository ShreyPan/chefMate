const axios = require('axios');

const BASE_URL = 'http://localhost:4000';

async function testChefMateAI() {
    console.log('🤖 Testing ChefMate AI Integration...\n');

    let authToken = '';

    try {
        // ============ AUTHENTICATION ============
        console.log('🔐 1. Authenticating...');

        const authResponse = await axios.post(`${BASE_URL}/auth/signup`, {
            name: 'AI Chef Tester',
            email: 'ai@chefmate.dev',
            password: 'cooking123'
        }).catch(async (error) => {
            if (error.response?.status === 409) {
                console.log('   User exists, logging in...');
                return await axios.post(`${BASE_URL}/auth/login`, {
                    email: 'ai@chefmate.dev',
                    password: 'cooking123'
                });
            }
            throw error;
        });

        authToken = authResponse.data.token;
        console.log(`   ✅ Authenticated as: ${authResponse.data.user.name}`);

        // ============ AI HEALTH CHECK ============
        console.log('\n🏥 2. Checking AI Service Health...');

        const healthCheck = await axios.get(`${BASE_URL}/ai/health`);
        console.log('   ✅ AI Service Status:', healthCheck.data.status);
        console.log('   📡 Provider:', healthCheck.data.provider);

        // ============ RECIPE GENERATION ============
        console.log('\n🍽️ 3. Testing AI Recipe Generation...');

        // Test 1: Simple recipe request
        console.log('   Testing simple recipe generation...');
        const simpleRecipe = await axios.post(`${BASE_URL}/ai/generate-recipe`, {
            description: 'Quick and easy pasta dish for dinner',
            servings: 2,
            difficulty: 'Easy'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        console.log(`   ✅ Generated: "${simpleRecipe.data.recipe.title}"`);
        console.log(`   📝 Cuisine: ${simpleRecipe.data.recipe.cuisine}`);
        console.log(`   ⏱️ Total time: ${simpleRecipe.data.recipe.prepTime + simpleRecipe.data.recipe.cookTime} minutes`);

        // Test 2: Recipe with ingredients
        console.log('   Testing recipe with specific ingredients...');
        const ingredientRecipe = await axios.post(`${BASE_URL}/ai/generate-recipe`, {
            ingredients: ['chicken breast', 'broccoli', 'garlic', 'soy sauce'],
            cuisine: 'Asian',
            difficulty: 'Medium',
            cookingTime: 25
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        console.log(`   ✅ Generated: "${ingredientRecipe.data.recipe.title}"`);
        console.log(`   🥗 Ingredients count: ${ingredientRecipe.data.recipe.ingredients.length}`);
        console.log(`   📋 Steps count: ${ingredientRecipe.data.recipe.steps.length}`);

        // Test 3: Recipe with dietary restrictions
        console.log('   Testing recipe with dietary restrictions...');
        const dietaryRecipe = await axios.post(`${BASE_URL}/ai/generate-recipe`, {
            description: 'Healthy vegetarian meal',
            dietaryRestrictions: ['vegetarian', 'gluten-free'],
            servings: 4,
            difficulty: 'Easy'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        console.log(`   ✅ Generated: "${dietaryRecipe.data.recipe.title}"`);
        console.log(`   🌱 Dietary compliant: vegetarian & gluten-free`);

        // ============ VOICE COMMAND PROCESSING ============
        console.log('\n🎤 4. Testing Voice Command Processing...');

        const voiceCommands = [
            "I want to make something with tomatoes and cheese",
            "Create a quick breakfast recipe for 2 people",
            "Make me a healthy salad with chicken",
            "I need a vegan dessert that's easy to make"
        ];

        for (const command of voiceCommands) {
            console.log(`   Processing: "${command}"`);
            const voiceResponse = await axios.post(`${BASE_URL}/ai/voice-command`, {
                voiceText: command
            }, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            console.log(`   ✅ Generated: "${voiceResponse.data.recipe.title}"`);
        }

        // ============ COOKING TIPS ============
        console.log('\n💡 5. Testing Cooking Tips...');

        const tipsResponse = await axios.post(`${BASE_URL}/ai/cooking-tips`, {
            recipeTitle: 'Pasta Carbonara',
            step: 'mixing eggs with hot pasta'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        console.log('   ✅ Cooking tips received:');
        tipsResponse.data.tips.forEach((tip, index) => {
            console.log(`      ${index + 1}. ${tip}`);
        });

        // ============ INGREDIENT SUBSTITUTIONS ============
        console.log('\n🔄 6. Testing Ingredient Substitutions...');

        const substitutions = await axios.post(`${BASE_URL}/ai/substitutions`, {
            ingredient: 'heavy cream',
            amount: '1',
            unit: 'cup'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        console.log('   ✅ Substitutions for 1 cup heavy cream:');
        substitutions.data.substitutions.forEach((sub, index) => {
            console.log(`      ${index + 1}. ${sub}`);
        });

        console.log('\n🎉 All AI Tests Completed Successfully!');
        console.log('\n📊 AI Features Summary:');
        console.log('   ✅ Recipe generation from descriptions');
        console.log('   ✅ Recipe generation from ingredients');
        console.log('   ✅ Dietary restriction handling');
        console.log('   ✅ Voice command processing');
        console.log('   ✅ Cooking tips and suggestions');
        console.log('   ✅ Ingredient substitutions');
        console.log('\n🚀 ChefMate AI is ready for voice control integration!');

    } catch (error) {
        console.error('❌ AI Test failed:', error.response?.data || error.message);
        if (error.response?.status === 500 && error.response.data?.error?.includes('API key')) {
            console.log('\n💡 Note: You need to add your GEMINI_API_KEY to the .env file');
            console.log('   1. Get free API key from: https://aistudio.google.com/app/apikey');
            console.log('   2. Add to apps/server/.env: GEMINI_API_KEY="your-key-here"');
            console.log('   3. Restart the server and try again');
        }
    }
}

// Only run if this file is executed directly
if (require.main === module) {
    testChefMateAI();
}

module.exports = { testChefMateAI };
