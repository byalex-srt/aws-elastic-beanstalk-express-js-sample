const request = require('supertest');
const app = require('../app');

(async () => {
    try {
        const response = await request(app).get('/');

        if (response.statusCode !== 200) {
            throw new Error(`Expected status 200 but got ${response.statusCode}`);
        }

        if (response.text !== 'Hello World!') {
            throw new Error(`Unexpected response: ${response.text}`);
        }

        console.log('✓ should return Hello World!');
        console.log('1 passing');
    } catch (error) {
        console.error('Test failed:', error.message);
        process.exit(1);
    }
})();
