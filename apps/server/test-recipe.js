// Test Gemini Recipe Generation
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function testRecipeGeneration() {
    console.log('🤖 Testing Gemini Recipe Generation...\n');

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Generate a simple pasta recipe in JSON format with this structure:
{
  "title": "Recipe Name",
  "description": "Brief description",
  "cuisine": "Italian",
  "difficulty": "Easy",
  "prepTime": 15,
  "cookTime": 20,
  "servings": 4,
  "ingredients": [
    {
      "name": "Spaghetti",
      "amount": "400",
      "unit": "g",
      "order": 1
    }
  ],
  "steps": [
    {
      "stepNumber": 1,
      "instruction": "Cook pasta",
      "duration": 600
    }
  ]
}`;

        console.log('🔥 Generating recipe...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('✅ Raw AI Response:');
        console.log(text);

        // Try to parse JSON
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const recipe = JSON.parse(jsonMatch[0]);
                console.log('\n🍝 Parsed Recipe:');
                console.log('Title:', recipe.title);
                console.log('Cuisine:', recipe.cuisine);
                console.log('Ingredients:', recipe.ingredients?.length || 0);
                console.log('Steps:', recipe.steps?.length || 0);
                console.log('\n🎉 AI Recipe Generation SUCCESSFUL!');
            } else {
                console.log('⚠️ Could not find JSON in response');
            }
        } catch (parseError) {
            console.log('⚠️ JSON parsing failed:', parseError.message);
        }

    } catch (error) {
        console.error('❌ Recipe generation failed:', error.message);
    }
}

testRecipeGeneration();
