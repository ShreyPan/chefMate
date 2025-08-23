// Quick ChefMate AI Test
const axios = require('axios');

async function quickTest() {
    try {
        console.log('🏥 Testing AI Health...');
        const health = await axios.get('http://localhost:4000/ai/health');
        console.log('✅ Health:', health.data.status);

        console.log('\n🤖 Testing AI Recipe Generation...');

        // First authenticate
        const auth = await axios.post('http://localhost:4000/auth/login', {
            email: 'ai@chefmate.dev',
            password: 'cooking123'
        }).catch(async () => {
            return await axios.post('http://localhost:4000/auth/signup', {
                name: 'AI Tester',
                email: 'ai@chefmate.dev',
                password: 'cooking123'
            });
        });

        console.log('✅ Authenticated');

        // Test AI recipe generation
        const recipe = await axios.post('http://localhost:4000/ai/generate-recipe', {
            description: 'Quick Italian pasta dish',
            difficulty: 'Easy',
            servings: 2
        }, {
            headers: { Authorization: `Bearer ${auth.data.token}` }
        });

        console.log('✅ AI Recipe Generated!');
        console.log('Title:', recipe.data.recipe.title);
        console.log('Cuisine:', recipe.data.recipe.cuisine);
        console.log('Ingredients:', recipe.data.recipe.ingredients.length);

        console.log('\n🎉 ChefMate AI Integration WORKING PERFECTLY!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

setTimeout(quickTest, 1000); // Wait for server to start
