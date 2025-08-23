// Test Gemini API Key with Node.js
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey || apiKey === 'your-gemini-api-key-here') {
    console.log('❌ No valid API key found');
    process.exit(1);
}

console.log('🔍 Testing API key:', apiKey.substring(0, 10) + '...');

const https = require('https');

// Test by listing models
const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: '/v1beta/models',
    method: 'GET',
    headers: {
        'X-goog-api-key': apiKey
    }
};

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200) {
            console.log('✅ API Key WORKS!');
            const response = JSON.parse(data);
            console.log(`Found ${response.models.length} models`);
            console.log('First few models:');
            response.models.slice(0, 3).forEach(model => {
                console.log(`  - ${model.name}`);
            });
        } else {
            console.log('❌ API Key failed');
            console.log('Status:', res.statusCode);
            console.log('Response:', data);
        }
    });
});

req.on('error', (error) => {
    console.log('❌ Request failed:', error.message);
});

req.end();
