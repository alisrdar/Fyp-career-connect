// Test script to verify AI Engine proxy integration
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/proxy';
const TEST_USER_ID = 'test-user-' + Date.now();

async function testProxyIntegration() {
  console.log('🧪 Testing AI Engine Proxy Integration\n');
  
  try {
    // Test 1: Health Check (direct to AI engine)
    console.log('1️⃣  Testing AI Engine Health...');
    try {
      const healthRes = await axios.get('http://localhost:8000/');
      console.log('✅ AI Engine Status:', healthRes.data);
      console.log('   Questions loaded:', healthRes.data.questions_loaded);
    } catch (err) {
      console.log('❌ AI Engine not responding. Make sure it\'s running on http://localhost:8000');
      return;
    }
    
    // Test 2: Session Start
    console.log('\n2️⃣  Testing /session/start via proxy...');
    const sessionRes = await axios.post(`${BASE_URL}/session/start`, {
      user_id: TEST_USER_ID,
      demographic: 'adult'
    });
    console.log('✅ Session started:', sessionRes.status === 200 ? 'Success' : 'Failed');
    console.log('   Status:', sessionRes.status);
    console.log('   Response:', sessionRes.data);
    
    // Test 3: Get Next Question
    console.log('\n3️⃣  Testing /rag/next-question via proxy...');
    const questionRes = await axios.post(`${BASE_URL}/rag/next-question`, {
      user_id: TEST_USER_ID
    });
    console.log('✅ Question received:');
    console.log('   ID:', questionRes.data.id);
    console.log('   Type:', questionRes.data.type);
    console.log('   Text:', questionRes.data.text.substring(0, 60) + '...');
    console.log('   Options:', questionRes.data.options.length);
    console.log('   Difficulty:', questionRes.data.difficulty);
    console.log('   Time limit:', questionRes.data.time_limit + 's');
    
    const questionId = questionRes.data.id;
    const firstOptionId = questionRes.data.options[0].id;
    
    // Test 4: Save Response
    console.log('\n4️⃣  Testing /user/save-response via proxy...');
    const saveRes = await axios.post(`${BASE_URL}/user/save-response`, {
      user_id: TEST_USER_ID,
      question_id: questionId,
      response_id: firstOptionId,
      time_taken: 5
    });
    console.log('✅ Response saved:', saveRes.data.status);
    console.log('   Current scores sample:');
    console.log('   - Logic:', saveRes.data.current_scores.logic);
    console.log('   - Math:', saveRes.data.current_scores.math);
    console.log('   - Verbal:', saveRes.data.current_scores.verbal);
    
    // Test 5: Get Recommendations
    console.log('\n5️⃣  Testing /recommend/results via proxy...');
    const resultsRes = await axios.post(`${BASE_URL}/recommend/results`, {
      user_id: TEST_USER_ID,
      personality: {}
    });
    console.log('✅ Recommendations received:', resultsRes.data.recommendations.length);
    console.log('   Top 3 careers:');
    resultsRes.data.recommendations.slice(0, 3).forEach((rec, i) => {
      console.log(`   ${i + 1}. ${rec.title} (${rec.match_score}% match)`);
      console.log(`      Top factors: ${rec.top_factors.join(', ')}`);
    });
    
    console.log('\n✅ All proxy tests passed! Integration is working correctly.\n');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    }
    if (error.code) {
      console.error('   Error code:', error.code);
    }
    console.error('\nFull error:', error);
  }
}

testProxyIntegration();
