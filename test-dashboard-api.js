import axios from 'axios';
import readline from 'readline';

const API_BASE_URL = 'https://final-project-backend-production-214a.up.railway.app';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

async function testDashboardAPI() {
  const email = await question('Email: ');
  const password = await question('Password: ');
  
  try {
    // 1. Login to get token
    console.log('\n🔐 Logging in...');
    const loginRes = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email,
      password
    });
    
    const token = loginRes.data.token;
    console.log('✅ Login successful, token:', token.substring(0, 20) + '...');
    
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // 2. Test dashboard-stats endpoint
    console.log('\n📊 Testing /api/progress/dashboard-stats...');
    const statsRes = await axios.get(
      `${API_BASE_URL}/api/progress/dashboard-stats`,
      { headers }
    );
    console.log('Response status:', statsRes.status);
    console.log('Response data:', JSON.stringify(statsRes.data, null, 2));
    
    // 3. Test recent-activity endpoint
    console.log('\n🔔 Testing /api/progress/recent-activity...');
    const activityRes = await axios.get(
      `${API_BASE_URL}/api/progress/recent-activity`,
      { headers }
    );
    console.log('Response status:', activityRes.status);
    console.log('Response data:', JSON.stringify(activityRes.data, null, 2));
    
    // 4. Test continue-learning endpoint
    console.log('\n📚 Testing /api/progress/continue-learning...');
    const learningRes = await axios.get(
      `${API_BASE_URL}/api/progress/continue-learning`,
      { headers }
    );
    console.log('Response status:', learningRes.status);
    console.log('Response data:', JSON.stringify(learningRes.data, null, 2));
    
    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('❌ Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  } finally {
    rl.close();
  }
}

testDashboardAPI();
