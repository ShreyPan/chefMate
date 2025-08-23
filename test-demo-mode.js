const axios = require('axios');

async function testChefMateDemo() {
    console.log('🎭 Testing ChefMate in Demo Mode...\n');

    try {
        // Test health endpoint
        const health = await axios.get('http://localhost:4000/ai/health');
        console.log('✅ AI Health:', health.data.status);
        console.log('Provider:', health.data.provider);

        // Test authentication first
        const auth = await axios.post('http://localhost:4000/auth/signup', {
            name: 'Demo Chef',
            email: 'demo@chefmate.dev',
            password: 'demo123'
        }).catch(async (error) => {
            if (error.response?.status === 409) {
                return await axios.post('http://localhost:4000/auth/login', {
                    email: 'demo@chefmate.dev',
                    password: 'demo123'
                });
            }
            throw error;
        });

        const token = auth.data.token;
        console.log('✅ Authenticated as:', auth.data.user.name);

        // Test AI recipe generation (demo mode)
        console.log('\n🤖 Testing AI Recipe Generation...');
        const recipe = await axios.post('http://localhost:4000/ai/generate-recipe', {
            description: 'Quick pasta dish',
            cuisine: 'Italian',
            difficulty: 'Easy',
            servings: 2
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('✅ Generated Recipe:', recipe.data.recipe.title);
        console.log('Cuisine:', recipe.data.recipe.cuisine);
        console.log('Ingredients:', recipe.data.recipe.ingredients.length);
        console.log('Steps:', recipe.data.recipe.steps.length);

        // Test voice command
        console.log('\n🎤 Testing Voice Command...');
        const voice = await axios.post('http://localhost:4000/ai/voice-command', {
            voiceText: 'I want to make something with chicken and vegetables'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('✅ Voice Command Processed:', voice.data.recipe.title);

        console.log('\n🎉 ChefMate Demo Mode Works Perfectly!');
        console.log('💡 Add working API key later for real AI power');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testChefMateDemo();
