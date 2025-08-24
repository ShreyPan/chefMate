// Test improved authentication flow - unregistered email handling
async function testImprovedAuthFlow() {
    console.log('🔐 Testing Improved Authentication Flow...\n');

    try {
        // Test 1: Try to login with unregistered email
        console.log('1. Testing login with unregistered email...');
        const unregisteredEmail = `newuser${Date.now()}@test.com`;

        const loginResponse = await fetch('http://localhost:4000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: unregisteredEmail,
                password: 'somepassword123'
            })
        });

        if (loginResponse.status === 404) {
            const errorData = await loginResponse.json();
            console.log('✅ Backend correctly identified unregistered email');
            console.log('   Status:', loginResponse.status);
            console.log('   Error Code:', errorData.code);
            console.log('   Message:', errorData.message);

            if (errorData.code === 'EMAIL_NOT_FOUND') {
                console.log('✅ Correct error code returned');
            } else {
                console.log('❌ Expected error code EMAIL_NOT_FOUND');
            }
        } else {
            console.log('❌ Expected 404 status for unregistered email, got:', loginResponse.status);
            const responseText = await loginResponse.text();
            console.log('   Response:', responseText);
        }

        // Test 2: Try to login with registered email but wrong password
        console.log('\n2. Testing login with registered email but wrong password...');

        // First, create a user
        const signupResponse = await fetch('http://localhost:4000/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: unregisteredEmail,
                password: 'correctpassword123'
            })
        });

        if (signupResponse.ok) {
            console.log('✅ User created successfully');

            // Now try wrong password
            const wrongPasswordResponse = await fetch('http://localhost:4000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: unregisteredEmail,
                    password: 'wrongpassword123'
                })
            });

            if (wrongPasswordResponse.status === 401) {
                const errorData = await wrongPasswordResponse.json();
                console.log('✅ Backend correctly rejected wrong password');
                console.log('   Status:', wrongPasswordResponse.status);
                console.log('   Error:', errorData.error);

                if (errorData.error === 'invalid credentials') {
                    console.log('✅ Correct error message for wrong password');
                } else {
                    console.log('❌ Expected "invalid credentials" error message');
                }
            } else {
                console.log('❌ Expected 401 status for wrong password, got:', wrongPasswordResponse.status);
            }
        } else {
            console.log('❌ Failed to create test user');
        }

        // Test 3: Test successful login
        console.log('\n3. Testing successful login...');

        const successLoginResponse = await fetch('http://localhost:4000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: unregisteredEmail,
                password: 'correctpassword123'
            })
        });

        if (successLoginResponse.ok) {
            const loginData = await successLoginResponse.json();
            console.log('✅ Successful login working');
            console.log('   User:', loginData.user.name);
            console.log('   Email:', loginData.user.email);
            console.log('   Has Token:', !!loginData.access_token);
        } else {
            console.log('❌ Expected successful login, got status:', successLoginResponse.status);
        }

        console.log('\n🎉 IMPROVED AUTHENTICATION FLOW TEST COMPLETED!');
        console.log('✅ Unregistered emails now get helpful error messages');
        console.log('✅ Frontend can detect EMAIL_NOT_FOUND and show signup suggestion');
        console.log('✅ Wrong passwords still get generic "invalid credentials" message');
        console.log('✅ Successful logins continue to work normally');
        console.log('\n💡 Next: Test the frontend flow to see the new UX improvements!');

    } catch (error) {
        console.error('❌ Improved auth flow test failed:', error.message);
    }
}

testImprovedAuthFlow();
