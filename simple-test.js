// Simple test
const axios = require('axios');

async function test() {
  console.log('Testing session/start...');
  
  try {
    const res = await axios.post('http://localhost:3000/api/proxy/session/start', {
      user_id: 'test-123',
      demographic: 'adult'
    });
    
    console.log('Success!', res.data);
  } catch (err) {
    console.log('Error:', err.message);
    console.log('Code:', err.code);
    if (err.response) {
      console.log('Status:', err.response.status);
      console.log('Data:', err.response.data);
    }
  }
}

test();
