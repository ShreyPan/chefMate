// Simple AI Health Check Test
const axios = require('axios');

console.log('🤖 Testing ChefMate AI Health...\n');

axios.get('http://localhost:4000/ai/health')
    .then(response => {
        console.log('✅ AI Health Check Success!');
        console.log('Status:', response.data.status);
        console.log('Provider:', response.data.provider);
        console.log('Note:', response.data.note);
        console.log('\n🎉 AI Integration is working!');
    })
    .catch(error => {
        console.error('❌ AI Health Check Failed:');
        console.error('Error:', error.response?.data || error.message);
        console.log('\n💡 Make sure the server is running on localhost:4000');
    });
