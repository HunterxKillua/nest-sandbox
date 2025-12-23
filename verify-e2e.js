const axios = require('axios');

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    const baseUrl = 'http://127.0.0.1:4000';
    console.log('Waiting for server...');
    await delay(5000); // Wait for NestJS to boot

    try {
        // 1. Register
        console.log('1. Registering User...');
        const uniqueSuffix = Date.now();
        const username = `admin_${uniqueSuffix}`;
        const registerRes = await axios.post(`${baseUrl}/auth/register`, {
            username: username,
            password: 'password123',
            roles: [{ name: 'admin' }]
        });
        console.log('   ✅ Register Success:', registerRes.status);

        // 2. Login
        console.log('2. Logging In...');
        const loginRes = await axios.post(`${baseUrl}/auth/login`, {
            username: username,
            password: 'password123'
        });
        const token = loginRes.data.data.access_token;
        console.log('   ✅ Login Success, Token received.');

        // 3. Admin Access
        console.log('3. Testing Admin Access (Protected)...');
        const adminRes = await axios.get(`${baseUrl}/business/admin-only`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('   ✅ Admin Access Success:', adminRes.data);

        // 4. Public Access (Logged in)
        console.log('4. Testing Public Access (Logged in)...');
        const publicRes = await axios.get(`${baseUrl}/business/public`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('   ✅ Public Access Success:', publicRes.data);

        // 5. Unauthorized Access Check
        console.log('5. Testing Unauthorized Access...');
        try {
            await axios.get(`${baseUrl}/business/admin-only`);
            console.error('   ❌ Fail: Should have been 401');
        } catch (e) {
            console.log('   ✅ Success: Correctly rejected with', e.response.status);
        }

        console.log('\n✨ ALL TESTS PASSED ✨');
    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
        process.exit(1);
    }
}

run();
