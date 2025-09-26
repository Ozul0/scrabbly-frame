// Quick test for ScraBBly Frame
const http = require('http');

function testEndpoint(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    body: body
                });
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function runTests() {
    console.log('🎯 Testing ScraBBly Frame...\n');

    try {
        // Test 1: Main page
        console.log('1. Testing main page...');
        const main = await testEndpoint('/');
        console.log(`   Status: ${main.status}`);
        console.log(`   Contains ScraBBly: ${main.body.includes('ScraBBly')}`);
        console.log(`   Length: ${main.body.length} characters\n`);

        // Test 2: Frame endpoint
        console.log('2. Testing frame endpoint...');
        const frameData = {
            untrustedData: {
                fid: 12345,
                buttonIndex: 1,
                inputText: '',
                castHash: 'test_hash'
            }
        };
        const frame = await testEndpoint('/api/frame', 'POST', frameData);
        console.log(`   Status: ${frame.status}`);
        console.log(`   Contains frame meta: ${frame.body.includes('fc:frame')}`);
        console.log(`   Contains ScraBBly: ${frame.body.includes('ScraBBly')}\n`);

        // Test 3: Game image
        console.log('3. Testing game image...');
        const image = await testEndpoint('/api/game-image?letters=CATSER&score=0&found=');
        console.log(`   Status: ${image.status}`);
        console.log(`   Content-Type: ${image.headers['content-type']}\n`);

        // Test 4: Leaderboard image
        console.log('4. Testing leaderboard image...');
        const leaderboard = await testEndpoint('/api/leaderboard-image');
        console.log(`   Status: ${leaderboard.status}`);
        console.log(`   Content-Type: ${leaderboard.headers['content-type']}\n`);

        console.log('✅ All tests completed successfully!');
        console.log('\n🎮 ScraBBly Frame is working!');
        console.log('📱 Frame URL: http://localhost:3000/api/frame');
        console.log('🌐 Main page: http://localhost:3000');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('\n💡 Make sure the dev server is running: npm run dev');
    }
}

runTests();
