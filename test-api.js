const axios = require('axios');

const BASE_URL = 'http://localhost:4000';

async function testChefMateAPI() {
    console.log('🧪 Testing ChefMate API...\n');

    try {
        // Test 1: Root endpoint
        console.log('1. Testing root endpoint...');
        const rootResponse = await axios.get(BASE_URL);
        console.log('✅ Root endpoint working:', rootResponse.data.service);

        // Test 2: User signup
        console.log('\n2. Testing user signup...');
        let authResponse;
        try {
            authResponse = await axios.post(`${BASE_URL}/auth/signup`, {
                name: 'Test Chef',
                email: 'chef@test.com',
                password: 'password123'
            });
            console.log('✅ Signup successful! User:', authResponse.data.user.name);
        } catch (error) {
            if (error.response?.status === 409) {
                console.log('⚠️ User exists, trying login...');
                authResponse = await axios.post(`${BASE_URL}/auth/login`, {
                    email: 'chef@test.com',
                    password: 'password123'
                });
                console.log('✅ Login successful! User:', authResponse.data.user.name);
            } else {
                throw error;
            }
        }

        const token = authResponse.data.token;

        // Test 3: Get recipes
        console.log('\n3. Testing recipe retrieval...');
        const recipesResponse = await axios.get(`${BASE_URL}/recipes`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Recipes endpoint working. Count:', recipesResponse.data.recipes.length);

        // Test 4: Create recipe
        console.log('\n4. Testing recipe creation...');
        const newRecipe = await axios.post(`${BASE_URL}/recipes`, {
            title: 'Test Recipe',
            description: 'A test recipe from Node.js',
            prepTime: 10,
            cookTime: 15,
            servings: 2
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Recipe created:', newRecipe.data.recipe.title);

        // Test 5: Get recipes again
        console.log('\n5. Testing updated recipe list...');
        const updatedRecipes = await axios.get(`${BASE_URL}/recipes`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Updated recipes count:', updatedRecipes.data.recipes.length);

        console.log('\n🎉 All tests passed! ChefMate API is working perfectly!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testChefMateAPI();
