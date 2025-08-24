// Quick test to verify backend auth response format
const testSignup = async () => {
    try {
        console.log('Testing backend signup response format...');

        const response = await fetch('http://localhost:4000/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Format Test User',
                email: `format${Date.now()}@test.com`,
                password: 'testpass123'
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));

        if (data.access_token && data.token_type) {
            console.log('✅ Response format is correct!');
        } else {
            console.log('❌ Response format issue');
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
};

testSignup();
