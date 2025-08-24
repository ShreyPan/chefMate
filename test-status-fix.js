// Quick test for the 401 status code fix
async function testStatusCodeFix() {
    console.log('🧪 Testing 401 status code fix...\n');

    try {
        // Test with invalid token
        const response = await fetch('http://localhost:4000/recipes', {
            headers: {
                'Authorization': 'Bearer invalid_token_here'
            }
        });

        console.log('Status Code:', response.status);
        const data = await response.json();
        console.log('Response:', data);

        if (response.status === 401) {
            console.log('✅ Status code fix SUCCESSFUL! Returns 401 for invalid token');
        } else {
            console.log('❌ Status code fix FAILED! Expected 401, got', response.status);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testStatusCodeFix();
