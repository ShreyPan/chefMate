const axios = require('axios');

const BASE_URL = 'http://localhost:4000';

async function testChefMateFullAPI() {
    console.log('🧪 Testing ChefMate Full API - Advanced Features...\n');
    
    let authToken = '';
    
    try {
        // ============ AUTHENTICATION TESTS ============
        console.log('🔐 1. Testing Authentication...');
        
        const authResponse = await axios.post(`${BASE_URL}/auth/signup`, {
            name: 'Chef Master',
            email: 'chef@chefmate.dev',
            password: 'cooking123'
        }).catch(async (error) => {
            if (error.response?.status === 409) {
                console.log('   User exists, logging in...');
                return await axios.post(`${BASE_URL}/auth/login`, {
                    email: 'chef@chefmate.dev',
                    password: 'cooking123'
                });
            }
            throw error;
        });
        
        authToken = authResponse.data.token;
        console.log(`   ✅ Authentication successful! User: ${authResponse.data.user.name}`);
        
        // ============ ADVANCED RECIPE TESTS ============
        console.log('\n🍽️ 2. Testing Advanced Recipe Management...');
        
        // Test creating recipe with ingredients and steps
        const newRecipe = await axios.post(`${BASE_URL}/recipes`, {
            title: 'Perfect Pasta Carbonara',
            description: 'Authentic Italian carbonara with eggs and pancetta',
            cuisine: 'Italian',
            difficulty: 'Medium',
            prepTime: 15,
            cookTime: 20,
            servings: 4,
            isPublic: false,
            ingredients: [
                { name: 'Spaghetti', amount: '400', unit: 'g', order: 1 },
                { name: 'Pancetta', amount: '150', unit: 'g', order: 2 },
                { name: 'Eggs', amount: '4', unit: 'large', order: 3 },
                { name: 'Parmesan cheese', amount: '100', unit: 'g', notes: 'freshly grated', order: 4 },
                { name: 'Black pepper', amount: '1', unit: 'tsp', notes: 'freshly ground', order: 5 }
            ],
            steps: [
                { stepNumber: 1, instruction: 'Bring a large pot of salted water to boil', duration: 300 },
                { stepNumber: 2, instruction: 'Cook pancetta in a large pan until crispy', duration: 480 },
                { stepNumber: 3, instruction: 'Beat eggs with grated parmesan and black pepper', duration: 180 },
                { stepNumber: 4, instruction: 'Cook spaghetti until al dente', duration: 600 },
                { stepNumber: 5, instruction: 'Combine hot pasta with pancetta and egg mixture', duration: 120, notes: 'Work quickly to avoid scrambling eggs' }
            ]
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        const recipeId = newRecipe.data.recipe.id;
        console.log(`   ✅ Recipe created: "${newRecipe.data.recipe.title}" (ID: ${recipeId})`);
        console.log(`   📝 Ingredients: ${newRecipe.data.recipe.ingredients?.length || 0}`);
        console.log(`   📋 Steps: ${newRecipe.data.recipe.steps?.length || 0}`);
        
        // Test getting single recipe with full details
        const fullRecipe = await axios.get(`${BASE_URL}/recipes/${recipeId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log(`   ✅ Recipe retrieved with full details`);
        
        // Test getting all recipes
        const allRecipes = await axios.get(`${BASE_URL}/recipes`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log(`   ✅ Recipe list retrieved: ${allRecipes.data.recipes.length} total recipes`);
        
        // ============ COOKING SESSION TESTS ============
        console.log('\n👨‍🍳 3. Testing Cooking Session Management...');
        
        // Start a cooking session
        const cookingSession = await axios.post(`${BASE_URL}/cooking/start`, {
            recipeId: recipeId
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        console.log(`   ✅ Cooking session started for: ${cookingSession.data.session.recipe.title}`);
        console.log(`   📍 Current step: ${cookingSession.data.session.currentStep}`);
        
        // Get active session
        const activeSession = await axios.get(`${BASE_URL}/cooking/active`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log(`   ✅ Active session retrieved`);
        
        // Update current step
        const updatedSession = await axios.patch(`${BASE_URL}/cooking/step`, {
            currentStep: 2,
            notes: 'Pancetta is getting crispy!'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log(`   ✅ Moved to step ${updatedSession.data.session.currentStep}`);
        
        // Navigate to step 3
        await axios.patch(`${BASE_URL}/cooking/step`, {
            currentStep: 3,
            notes: 'Eggs mixed perfectly'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log(`   ✅ Advanced to step 3`);
        
        // Complete the cooking session
        const completed = await axios.post(`${BASE_URL}/cooking/complete`, {
            notes: 'Delicious carbonara completed successfully!'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log(`   ✅ Cooking session completed!`);
        
        // Get cooking history
        const history = await axios.get(`${BASE_URL}/cooking/history`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log(`   ✅ Cooking history retrieved: ${history.data.sessions.length} completed sessions`);
        
        // ============ UPDATE & DELETE TESTS ============
        console.log('\n🔄 4. Testing Recipe Updates & Deletion...');
        
        // Update recipe
        const updatedRecipe = await axios.put(`${BASE_URL}/recipes/${recipeId}`, {
            title: 'Perfect Pasta Carbonara - Updated',
            description: 'Authentic Italian carbonara with eggs and pancetta - Now with extra tips!',
            cuisine: 'Italian',
            difficulty: 'Medium',
            prepTime: 15,
            cookTime: 20,
            servings: 4,
            isPublic: true,
            ingredients: [
                { name: 'Spaghetti', amount: '400', unit: 'g', order: 1 },
                { name: 'Pancetta', amount: '150', unit: 'g', order: 2 },
                { name: 'Eggs', amount: '4', unit: 'large', order: 3 },
                { name: 'Parmesan cheese', amount: '100', unit: 'g', notes: 'freshly grated', order: 4 },
                { name: 'Black pepper', amount: '1', unit: 'tsp', notes: 'freshly ground', order: 5 },
                { name: 'Salt', amount: '1', unit: 'pinch', notes: 'for pasta water', order: 6 }
            ],
            steps: [
                { stepNumber: 1, instruction: 'Bring a large pot of salted water to boil', duration: 300 },
                { stepNumber: 2, instruction: 'Cook pancetta in a large pan until crispy', duration: 480 },
                { stepNumber: 3, instruction: 'Beat eggs with grated parmesan and black pepper', duration: 180 },
                { stepNumber: 4, instruction: 'Cook spaghetti until al dente', duration: 600 },
                { stepNumber: 5, instruction: 'Combine hot pasta with pancetta and egg mixture', duration: 120, notes: 'Work quickly to avoid scrambling eggs' },
                { stepNumber: 6, instruction: 'Serve immediately with extra parmesan', duration: 60 }
            ]
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log(`   ✅ Recipe updated successfully`);
        console.log(`   📝 New ingredient count: ${updatedRecipe.data.recipe.ingredients?.length || 0}`);
        console.log(`   📋 New step count: ${updatedRecipe.data.recipe.steps?.length || 0}`);
        
        console.log('\n🎉 All Advanced API Tests Passed!');
        console.log('\n📊 Summary:');
        console.log('   ✅ Authentication working');
        console.log('   ✅ Advanced recipe CRUD with ingredients & steps');
        console.log('   ✅ Cooking session management');
        console.log('   ✅ Step navigation and progress tracking');
        console.log('   ✅ Recipe updates and history');
        console.log('\n🚀 ChefMate Backend is ready for AI integration and frontend!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
    }
}

testChefMateFullAPI();
