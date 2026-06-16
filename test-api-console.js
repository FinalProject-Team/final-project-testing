#!/usr/bin/env node

/**
 * Quick Testing Commands for Employer Dashboard & Community API
 * Copy-paste these commands into browser console to test
 */

// ============================================
// TEST 1: Check if you're logged in
// ============================================
console.log('🔐 Current User Info:');
const user = JSON.parse(localStorage.getItem('user') || '{}');
const token = localStorage.getItem('token');
console.log('User:', user);
console.log('Token:', token ? '✓ Present' : '✗ Missing');
console.log('Role:', user.role);

// ============================================
// TEST 2: Verify Employer Dashboard Route
// ============================================
// Navigate to: http://localhost:5173/dashboard/employer
// Or click the "Employer Dashboard" link in sidebar
// Check for message in console: "EmployerDashboard mounted"

// ============================================
// TEST 3: Test Community Posts API
// ============================================
const testCommunityAPI = async () => {
  console.log('🌐 Testing Community API...');
  try {
    const response = await fetch(
      'https://final-project-backend-production-214a.up.railway.app/api/community/posts'
    );
    const data = await response.json();
    console.log('✓ API Response:', data);
    console.log('✓ Posts count:', Array.isArray(data) ? data.length : data?.data?.length);
  } catch (error) {
    console.error('✗ API Error:', error);
  }
};

// ============================================
// TEST 4: Test Protected Endpoint (requires token)
// ============================================
const testEmployerJobs = async () => {
  console.log('💼 Testing Employer Jobs API...');
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(
      'https://final-project-backend-production-214a.up.railway.app/api/jobs/my/jobs',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const data = await response.json();
    console.log('✓ Status:', response.status);
    console.log('✓ Jobs:', data);
  } catch (error) {
    console.error('✗ Error:', error);
  }
};

// ============================================
// HOW TO USE:
// ============================================
// 1. Open browser DevTools (F12)
// 2. Go to Console tab
// 3. Copy and paste individual test commands:

// Copy this to console:
// testCommunityAPI();

// Copy this to console:
// testEmployerJobs();

// ============================================
// EXPECTED RESULTS:
// ============================================
// Test 1: User role should be "job_seeker"
// Test 2: Should see "EmployerDashboard mounted" in console
// Test 3: Should see array of posts
// Test 4: Should see status 200 and array of jobs

console.log('\n✨ Paste these commands in console:');
console.log('  testCommunityAPI()');
console.log('  testEmployerJobs()');

// ============================================
// Export for use in console
// ============================================
if (typeof window !== 'undefined') {
  window.testCommunityAPI = testCommunityAPI;
  window.testEmployerJobs = testEmployerJobs;
}

module.exports = { testCommunityAPI, testEmployerJobs };
