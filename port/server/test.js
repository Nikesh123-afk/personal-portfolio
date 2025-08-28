const assert = require('assert');
const fetch = require('node-fetch');

async function testServer() {
    try {
        console.log('🔍 Starting server tests...');

        // Test GET /api/messages
        const getResponse = await fetch('http://localhost:3000/api/messages');
        const getData = await getResponse.json();
        assert(getData.success === true, 'GET /api/messages should return success:true');
        console.log('✅ GET /api/messages test passed');

        // Test POST /api/messages
        const testMessage = {
            name: 'Test User',
            email: 'test@example.com',
            message: 'This is a test message'
        };

        const postResponse = await fetch('http://localhost:3000/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testMessage)
        });
        const postData = await postResponse.json();
        assert(postData.success === true, 'POST /api/messages should return success:true');
        assert(postData.data.name === testMessage.name, 'Posted message should contain correct name');
        console.log('✅ POST /api/messages test passed');

        console.log('🎉 All server tests passed successfully!');
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

testServer();
