// ❌ STATIC DATA — all functions return mock data from communityData.js with simulated delays
// TODO: Replace each function body with real axios.get() calls:
//   fetchTrending()       → GET /api/community/trending
//   fetchLeaderboard()    → GET /api/community/leaderboard
//   fetchEvents()         → GET /api/community/events
//   fetchSuggestedMembers() → GET /api/community/members/suggested
// ═══════════════════════════════════════════════════════
//  Community Service — sidebar data (trending, events…)
//  TODO: Replace with real axios calls
// ═══════════════════════════════════════════════════════

import {
  TRENDING_TOPICS, LEADERBOARD, UPCOMING_EVENTS, SUGGESTED_MEMBERS,
} from "../../data/communityData";

const DELAY = (ms) => new Promise((r) => setTimeout(r, ms));

// TODO: GET /api/community/trending
export async function fetchTrending() {
  await DELAY(400);
  return TRENDING_TOPICS;
}

// TODO: GET /api/community/leaderboard
export async function fetchLeaderboard() {
  await DELAY(400);
  return LEADERBOARD;
}

// TODO: GET /api/community/events
export async function fetchEvents() {
  await DELAY(300);
  return UPCOMING_EVENTS;
}

// TODO: GET /api/community/suggested-members
export async function fetchSuggestedMembers() {
  await DELAY(300);
  return SUGGESTED_MEMBERS;
}

// TODO: POST /api/community/follow/:userId
export async function followUser(userId) {
  await DELAY(200);
  return { success: true, userId };
}
