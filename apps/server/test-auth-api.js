// Test the actual authentication API endpoints
// Using built-in fetch (Node.js 18+)

const API_BASE = 'http://localhost:4000';

async function testAuthenticationAPI() {
    console.log('🧪 Testing authentication API endpoints...\n');

    try {
        // Test 1: Health check
        console.log('1. Testing server health...');
        const healthResponse = await fetch(`${API_BASE}/`);
        const healthData = await healthResponse.text();
        console.log('✅ Server health:', healthResponse.status === 200 ? 'OK' : 'FAILED');
        console.log('   Response:', healthData.slice(0, 100));

        // Test 2: User registration
        console.log('\n2. Testing user registration...');
        const testEmail = `apitest${Date.now()}@test.com`;
        const signupResponse = await fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'API Test User',
                email: testEmail,
                password: 'testpass123'
            })
        });

        const signupData = await signupResponse.json();
        console.log('✅ Signup status:', signupResponse.status);
        console.log('   Response:', signupData);

        if (signupResponse.status === 201) {
            const token = signupData.token;

            // Test 3: User login
            console.log('\n3. Testing user login...');
            const loginResponse = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: testEmail,
                    password: 'testpass123'
                })
            });

            const loginData = await loginResponse.json();
            console.log('✅ Login status:', loginResponse.status);
            console.log('   Response:', loginData);

            // Test 4: Protected route access
            console.log('\n4. Testing protected route access...');
            const profileResponse = await fetch(`${API_BASE}/auth/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const profileData = await profileResponse.json();
            console.log('✅ Profile access status:', profileResponse.status);
            console.log('   Response:', profileData);

            console.log('\n🎉 API Authentication tests COMPLETED!');
        } else {
            console.log('❌ Signup failed, skipping other tests');
        }

    } catch (error) {
        console.error('❌ API test failed:', error.message);
        console.log('\n💡 Make sure the backend server is running on port 4000');
    }
}

testAuthenticationAPI();
