// 🧪 FINAL AUTHENTICATION INTEGRATION TEST
// This test validates the complete auth flow end-to-end

const BACKEND_URL = 'http://localhost:4000';

console.log('🚀 Starting FINAL Authentication Integration Test...\n');

async function runFinalAuthTest() {
    let testResults = {
        passed: 0,
        failed: 0,
        details: []
    };

    const addResult = (test, status, message) => {
        testResults.details.push(`${status === 'PASS' ? '✅' : '❌'} ${test}: ${message}`);
        if (status === 'PASS') testResults.passed++;
        else testResults.failed++;
    };

    try {
        // 🧪 TEST 1: Backend Health Check
        console.log('1. Testing Backend Health...');
        const healthResponse = await fetch(`${BACKEND_URL}/`);
        if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            addResult('Backend Health', 'PASS', `${healthData.service} v${healthData.version} - ${healthData.status}`);
        } else {
            addResult('Backend Health', 'FAIL', `HTTP ${healthResponse.status}`);
        }

        // 🧪 TEST 2: User Registration (Signup)
        console.log('2. Testing User Registration...');
        const testEmail = `finaltest${Date.now()}@chefmate.com`;
        const signupData = {
            name: 'Final Test User',
            email: testEmail,
            password: 'finaltest123'
        };

        const signupResponse = await fetch(`${BACKEND_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData)
        });

        let authToken = null;
        if (signupResponse.ok) {
            const signupResult = await signupResponse.json();
            if (signupResult.access_token && signupResult.token_type === 'Bearer') {
                authToken = signupResult.access_token;
                addResult('User Registration', 'PASS', `User created with ID ${signupResult.user.id}, token received`);
            } else {
                addResult('User Registration', 'FAIL', 'Missing access_token or incorrect token_type');
            }
        } else {
            const error = await signupResponse.text();
            addResult('User Registration', 'FAIL', `HTTP ${signupResponse.status} - ${error}`);
        }

        // 🧪 TEST 3: User Login
        console.log('3. Testing User Login...');
        const loginResponse = await fetch(`${BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testEmail,
                password: 'finaltest123'
            })
        });

        if (loginResponse.ok) {
            const loginResult = await loginResponse.json();
            if (loginResult.access_token && loginResult.token_type === 'Bearer') {
                addResult('User Login', 'PASS', `Login successful, token refreshed`);
                authToken = loginResult.access_token; // Use fresh token
            } else {
                addResult('User Login', 'FAIL', 'Missing access_token or incorrect token_type');
            }
        } else {
            const error = await loginResponse.text();
            addResult('User Login', 'FAIL', `HTTP ${loginResponse.status} - ${error}`);
        }

        // 🧪 TEST 4: Protected Route Access (Recipes)
        console.log('4. Testing Protected Route Access...');
        if (authToken) {
            const recipesResponse = await fetch(`${BACKEND_URL}/recipes`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (recipesResponse.ok) {
                const recipesData = await recipesResponse.json();
                addResult('Protected Routes', 'PASS', `Recipes endpoint accessible, found ${recipesData.recipes?.length || 0} recipes`);
            } else {
                addResult('Protected Routes', 'FAIL', `HTTP ${recipesResponse.status} - Cannot access protected routes`);
            }
        } else {
            addResult('Protected Routes', 'FAIL', 'No auth token available for testing');
        }

        // 🧪 TEST 5: AI Integration (if available)
        console.log('5. Testing AI Integration...');
        if (authToken) {
            const aiResponse = await fetch(`${BACKEND_URL}/ai/generate-recipe`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
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
                addResult('AI Integration', 'PASS', `AI recipe generated: "${aiData.recipe?.title || 'Recipe created'}"`);
            } else if (aiResponse.status === 401) {
                addResult('AI Integration', 'FAIL', 'Authentication failed for AI endpoint');
            } else {
                addResult('AI Integration', 'PARTIAL', `AI endpoint responded with HTTP ${aiResponse.status} (may be expected)`);
            }
        } else {
            addResult('AI Integration', 'FAIL', 'No auth token available for testing');
        }

        // 🧪 TEST 6: Invalid Token Handling
        console.log('6. Testing Invalid Token Handling...');
        const invalidTokenResponse = await fetch(`${BACKEND_URL}/recipes`, {
            headers: {
                'Authorization': 'Bearer invalid-token-12345',
                'Content-Type': 'application/json'
            }
        });

        if (invalidTokenResponse.status === 401) {
            addResult('Invalid Token Handling', 'PASS', 'Properly rejected invalid token');
        } else {
            addResult('Invalid Token Handling', 'FAIL', `Expected 401, got ${invalidTokenResponse.status}`);
        }

    } catch (error) {
        addResult('Test Execution', 'FAIL', `Unexpected error: ${error.message}`);
    }

    // 📊 FINAL RESULTS
    console.log('\n' + '='.repeat(60));
    console.log('🎯 FINAL AUTHENTICATION INTEGRATION TEST RESULTS');
    console.log('='.repeat(60));

    testResults.details.forEach(detail => console.log(detail));

    console.log('\n📊 SUMMARY:');
    console.log(`✅ Tests Passed: ${testResults.passed}`);
    console.log(`❌ Tests Failed: ${testResults.failed}`);
    console.log(`📈 Success Rate: ${Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100)}%`);

    if (testResults.failed === 0) {
        console.log('\n🎉 ALL TESTS PASSED! Authentication system is ready for production! 🚀');
        console.log('✅ Ready to proceed with recipe management features');
    } else if (testResults.passed > testResults.failed) {
        console.log('\n⚠️ Most tests passed, minor issues to resolve');
    } else {
        console.log('\n❌ Significant issues found, requires debugging');
    }

    console.log('\n🔗 Test completed at:', new Date().toLocaleString());
}

runFinalAuthTest();
