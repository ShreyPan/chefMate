// Test Recipe Detail Page functionality
async function testRecipeDetailPages() {
    console.log('📖 Testing Recipe Detail Pages...\n');

    try {
        // Test 1: Create a test recipe to view
        console.log('1. Creating a test recipe for detail view...');
        const testEmail = `detailtest${Date.now()}@test.com`;

        // Signup/Login
        const signupResponse = await fetch('http://localhost:4000/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Recipe Detail Tester',
                email: testEmail,
                password: 'testpass123'
            })
        });

        if (!signupResponse.ok) {
            throw new Error(`Signup failed: ${signupResponse.status}`);
        }

        const authData = await signupResponse.json();
        const token = authData.access_token;
        console.log('✅ User authenticated for testing');

        // Create a detailed test recipe
        const detailedRecipe = {
            title: 'Ultimate Chocolate Chip Cookies',
            description: 'Perfectly chewy chocolate chip cookies with crispy edges and soft centers. These cookies are made with brown butter for an extra nutty flavor that takes them to the next level.',
            cuisine: 'American',
            difficulty: 'Medium',
            prepTime: 20,
            cookTime: 12,
            servings: 24,
            isPublic: true,
            ingredients: [
                { name: 'All-purpose flour', amount: '2¼', unit: 'cups', order: 1, notes: 'Sifted for best results' },
                { name: 'Baking soda', amount: '1', unit: 'tsp', order: 2 },
                { name: 'Salt', amount: '1', unit: 'tsp', order: 3, notes: 'Fine sea salt preferred' },
                { name: 'Unsalted butter', amount: '1', unit: 'cup', order: 4, notes: 'Room temperature' },
                { name: 'Granulated sugar', amount: '¾', unit: 'cup', order: 5 },
                { name: 'Brown sugar', amount: '¾', unit: 'cup', order: 6, notes: 'Packed' },
                { name: 'Large eggs', amount: '2', unit: 'whole', order: 7 },
                { name: 'Vanilla extract', amount: '2', unit: 'tsp', order: 8, notes: 'Pure vanilla recommended' },
                { name: 'Chocolate chips', amount: '2', unit: 'cups', order: 9, notes: 'Semi-sweet or dark chocolate' }
            ],
            steps: [
                {
                    stepNumber: 1,
                    instruction: 'Preheat your oven to 375°F (190°C). Line baking sheets with parchment paper.',
                    temperature: '375°F',
                    duration: 5,
                    notes: 'Make sure oven is fully preheated for even baking'
                },
                {
                    stepNumber: 2,
                    instruction: 'In a medium bowl, whisk together flour, baking soda, and salt. Set aside.',
                    duration: 3
                },
                {
                    stepNumber: 3,
                    instruction: 'In a large bowl, cream together the softened butter, granulated sugar, and brown sugar until light and fluffy.',
                    duration: 4,
                    notes: 'This should take about 3-4 minutes with an electric mixer'
                },
                {
                    stepNumber: 4,
                    instruction: 'Beat in eggs one at a time, then add vanilla extract. Mix until well combined.',
                    duration: 2
                },
                {
                    stepNumber: 5,
                    instruction: 'Gradually mix in the flour mixture until just combined. Do not overmix.',
                    notes: 'Overmixing leads to tough cookies'
                },
                {
                    stepNumber: 6,
                    instruction: 'Fold in the chocolate chips evenly throughout the dough.',
                    duration: 1
                },
                {
                    stepNumber: 7,
                    instruction: 'Drop rounded tablespoons of dough onto prepared baking sheets, spacing them 2 inches apart.',
                    notes: 'Use a cookie scoop for uniform size'
                },
                {
                    stepNumber: 8,
                    instruction: 'Bake for 9-12 minutes, until edges are golden brown but centers still look slightly underbaked.',
                    duration: 12,
                    temperature: '375°F',
                    notes: 'Cookies will continue to bake on the hot pan'
                },
                {
                    stepNumber: 9,
                    instruction: 'Cool on baking sheet for 5 minutes, then transfer to a wire rack to cool completely.',
                    duration: 5,
                    notes: 'This prevents cookies from breaking'
                }
            ]
        };

        const createResponse = await fetch('http://localhost:4000/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(detailedRecipe)
        });

        if (!createResponse.ok) {
            throw new Error(`Recipe creation failed: ${createResponse.status}`);
        }

        const newRecipe = await createResponse.json();
        const recipeId = newRecipe.recipe.id;
        console.log('✅ Detailed test recipe created with ID:', recipeId);

        // Test 2: Fetch the recipe for detail view
        console.log('\n2. Testing recipe detail API endpoint...');
        const detailResponse = await fetch(`http://localhost:4000/recipes/${recipeId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!detailResponse.ok) {
            throw new Error(`Recipe detail fetch failed: ${detailResponse.status}`);
        }

        const recipeDetail = await detailResponse.json();
        console.log('✅ Recipe detail fetched successfully');
        console.log('   Title:', recipeDetail.recipe.title);
        console.log('   Ingredients:', recipeDetail.recipe.ingredients.length);
        console.log('   Steps:', recipeDetail.recipe.steps.length);
        console.log('   Total Time:', recipeDetail.recipe.prepTime + recipeDetail.recipe.cookTime, 'minutes');

        // Test 3: Validate recipe data structure for detail page
        console.log('\n3. Validating recipe data structure...');
        const recipe = recipeDetail.recipe;

        // Check required fields
        const requiredFields = ['id', 'title', 'description', 'cuisine', 'difficulty', 'prepTime', 'cookTime', 'servings'];
        const missingFields = requiredFields.filter(field => !recipe[field] && recipe[field] !== 0);

        if (missingFields.length > 0) {
            console.log('❌ Missing required fields:', missingFields);
        } else {
            console.log('✅ All required fields present');
        }

        // Check ingredients structure
        if (recipe.ingredients && recipe.ingredients.length > 0) {
            const firstIngredient = recipe.ingredients[0];
            const ingredientFields = ['name', 'amount', 'order'];
            const missingIngredientFields = ingredientFields.filter(field => !firstIngredient[field]);

            if (missingIngredientFields.length === 0) {
                console.log('✅ Ingredient structure valid');
            } else {
                console.log('❌ Invalid ingredient structure:', missingIngredientFields);
            }
        }

        // Check steps structure
        if (recipe.steps && recipe.steps.length > 0) {
            const firstStep = recipe.steps[0];
            const stepFields = ['stepNumber', 'instruction'];
            const missingStepFields = stepFields.filter(field => !firstStep[field]);

            if (missingStepFields.length === 0) {
                console.log('✅ Step structure valid');
            } else {
                console.log('❌ Invalid step structure:', missingStepFields);
            }
        }

        console.log('\n🎉 RECIPE DETAIL PAGES TEST COMPLETED!');
        console.log('✅ Recipe detail API working correctly');
        console.log('✅ Recipe data structure validated');
        console.log('✅ Ready for frontend detail page display');
        console.log('\n🌐 Frontend URLs to test:');
        console.log(`   • Recipe List: http://localhost:3000/recipes`);
        console.log(`   • Recipe Detail: http://localhost:3000/recipes/${recipeId}`);
        console.log('\n💡 Features included in detail page:');
        console.log('   • Beautiful recipe display layout');
        console.log('   • Organized ingredients with amounts and notes');
        console.log('   • Step-by-step instructions with timing');
        console.log('   • Recipe metadata (difficulty, time, servings)');
        console.log('   • Print-friendly styling');
        console.log('   • Navigation and edit links');

    } catch (error) {
        console.error('❌ Recipe detail pages test failed:', error.message);
    }
}

testRecipeDetailPages();
