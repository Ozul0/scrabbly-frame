// Simple API testing script for ScraBBly Frame
const fetch = require('node-fetch').default;

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
    console.log('🧪 Testing ScraBBly Frame API...\n');

    try {
        // Test 1: Main page
        console.log('1. Testing main page...');
        const mainResponse = await fetch(`${BASE_URL}/`);
        console.log(`   Status: ${mainResponse.status}`);
        console.log(`   Content-Type: ${mainResponse.headers.get('content-type')}\n`);

        // Test 2: Frame endpoint (POST)
        console.log('2. Testing frame endpoint...');
        const frameData = {
            untrustedData: {
                fid: 12345,
                buttonIndex: 1,
                inputText: '',
                castHash: 'test_hash'
            }
        };

        const frameResponse = await fetch(`${BASE_URL}/api/frame`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(frameData)
        });

        console.log(`   Status: ${frameResponse.status}`);
        const frameHTML = await frameResponse.text();
        console.log(`   Response length: ${frameHTML.length} characters`);
        console.log(`   Contains ScraBBly: ${frameHTML.includes('ScraBBly')}`);
        console.log(`   Contains frame meta tags: ${frameHTML.includes('fc:frame')}\n`);

        // Test 3: Game image endpoint
        console.log('3. Testing game image endpoint...');
        const imageResponse = await fetch(`${BASE_URL}/api/game-image?letters=CATSER&score=0&found=`);
        console.log(`   Status: ${imageResponse.status}`);
        console.log(`   Content-Type: ${imageResponse.headers.get('content-type')}\n`);

        // Test 4: Leaderboard image endpoint
        console.log('4. Testing leaderboard image endpoint...');
        const leaderboardResponse = await fetch(`${BASE_URL}/api/leaderboard-image`);
        console.log(`   Status: ${leaderboardResponse.status}`);
        console.log(`   Content-Type: ${leaderboardResponse.headers.get('content-type')}\n`);

        console.log('✅ All tests completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('\n💡 Make sure to run "npm run dev" first!');
    }
}

// Run tests
testAPI();
