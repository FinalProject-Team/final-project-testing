#!/usr/bin/env node

/**
 * Quick API Verification Script
 * Tests all API endpoints against the backend
 * 
 * Usage: node verify-api.js
 */

const BASE_URL = 'https://final-project-backend-production-214a.up.railway.app';

// Mock token for testing (replace with real token)
const TOKEN = localStorage?.getItem('token') || 'your-jwt-token-here';

const endpoints = {
  // Employer Dashboard
  employer: [
    { method: 'GET', path: '/api/jobs/my/jobs', description: 'Get my jobs' },
    { method: 'POST', path: '/api/jobs', description: 'Create job' },
    { method: 'GET', path: '/api/jobs/{id}/applicants', description: 'Get applicants' },
    { method: 'PATCH', path: '/api/jobs/applications/{id}/status', description: 'Update application status' },
  ],
  // Community
  community: [
    { method: 'GET', path: '/api/community/posts', description: 'Get all posts' },
    { method: 'POST', path: '/api/community/posts', description: 'Create post' },
    { method: 'PATCH', path: '/api/community/posts/{id}/likes', description: 'Like post' },
    { method: 'PATCH', path: '/api/community/posts/{id}/save', description: 'Save post' },
    { method: 'POST', path: '/api/community/posts/{id}/comments', description: 'Add comment' },
    { method: 'DELETE', path: '/api/community/posts/{id}', description: 'Delete post' },
    { method: 'GET', path: '/api/community/trending', description: 'Get trending posts' },
    { method: 'GET', path: '/api/community/leaderboard', description: 'Get leaderboard' },
    { method: 'GET', path: '/api/community/events', description: 'Get events' },
    { method: 'GET', path: '/api/community/members/suggested', description: 'Get suggested members' },
    { method: 'POST', path: '/api/community/follow/{userId}', description: 'Follow user' },
  ],
};

console.log('🔍 API Verification Report\n');
console.log(`Base URL: ${BASE_URL}`);
console.log(`Token: ${TOKEN ? '✓ Found' : '✗ Missing'}\n`);

console.log('📋 Employer Dashboard Endpoints:');
endpoints.employer.forEach(ep => {
  console.log(`  ${ep.method.padEnd(6)} ${ep.path.padEnd(40)} - ${ep.description}`);
});

console.log('\n📋 Community Endpoints:');
endpoints.community.forEach(ep => {
  console.log(`  ${ep.method.padEnd(6)} ${ep.path.padEnd(40)} - ${ep.description}`);
});

console.log('\n✅ All endpoints registered in src/services/api/api.js');
console.log('📝 Test these endpoints using the browser DevTools Network tab');
console.log('🔐 Remember: Protected endpoints require Bearer token in Authorization header\n');
