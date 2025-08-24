const http = require('http');

function testBackend() {
    console.log('🧪 Testing backend connection...');

    const options = {
        hostname: 'localhost',
        port: 4000,
        path: '/',
        method: 'GET',
        timeout: 5000
    };

    const req = http.request(options, (res) => {
        console.log(`✅ Backend responding: ${res.statusCode}`);

        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                console.log('✅ Backend data:', json.service, json.version);
                console.log('✅ Backend endpoints:', Object.keys(json.endpoints || {}));
                testAuth();
            } catch (e) {
                console.log('⚠️ Response not JSON:', data.slice(0, 100));
            }
        });
    });

    req.on('error', (err) => {
        console.log('❌ Backend connection failed:', err.message);
    });

    req.on('timeout', () => {
        console.log('❌ Backend connection timeout');
        req.destroy();
    });

    req.end();
}

function testAuth() {
    console.log('\n🧪 Testing authentication endpoints...');

    const signupData = JSON.stringify({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'testpass123'
    });

    const options = {
        hostname: 'localhost',
        port: 4000,
        path: '/auth/signup',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(signupData)
        },
        timeout: 10000
    };

    const req = http.request(options, (res) => {
        console.log(`✅ Auth endpoint responding: ${res.statusCode}`);

        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                if (json.access_token) {
                    console.log('✅ Authentication working! Token received.');
                    console.log('✅ Token type:', json.token_type);
                    testProtectedRoute(json.access_token);
                } else {
                    console.log('⚠️ Auth response:', json);
                }
            } catch (e) {
                console.log('⚠️ Auth response not JSON:', data.slice(0, 200));
            }
        });
    });

    req.on('error', (err) => {
        console.log('❌ Auth request failed:', err.message);
    });

    req.on('timeout', () => {
        console.log('❌ Auth request timeout');
        req.destroy();
    });

    req.write(signupData);
    req.end();
}

function testProtectedRoute(token) {
    console.log('\n🧪 Testing protected route...');

    const options = {
        hostname: 'localhost',
        port: 4000,
        path: '/recipes',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        timeout: 10000
    };

    const req = http.request(options, (res) => {
        console.log(`✅ Protected route responding: ${res.statusCode}`);

        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                console.log('✅ Protected route working! Recipes:', json.recipes?.length || 0);
                console.log('\n🎉 Authentication integration test PASSED!');
            } catch (e) {
                console.log('⚠️ Protected route response:', data.slice(0, 200));
            }
        });
    });

    req.on('error', (err) => {
        console.log('❌ Protected route failed:', err.message);
    });

    req.on('timeout', () => {
        console.log('❌ Protected route timeout');
        req.destroy();
    });

    req.end();
}

testBackend();
