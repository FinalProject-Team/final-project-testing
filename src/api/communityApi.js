// ❌ STATIC DATA — caching wrapper around communityService.js which returns mock data
// TODO: Once real API is connected in communityService.js, this cache layer will work correctly automatically
// ═══════════════════════════════════════════════════════
//  communityApi.js — caching wrapper over service layer
//  localStorage cache (5-min TTL) per key.
//  TODO: When backend is live, remove cache wrappers and
//        call services directly with axios interceptors.
// ═══════════════════════════════════════════════════════

import {
  fetchPosts,
} from "../services/community/postService";
import {
  fetchTrending,
  fetchLeaderboard,
  fetchEvents,
  fetchSuggestedMembers,
} from "../services/community/communityService";

const TTL = 5 * 60 * 1000; // 5 minutes

function getCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > TTL) { localStorage.removeItem(key); return null; }
    return data;
  } catch { return null; }
}

function setCache(key, data) {
  try { localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() })); } catch {}
}

export async function getPosts() {
  // NOTE: Posts come from PostsContext (live state), not cache
  // This is kept for SSR/initial hydration pattern
  return fetchPosts();
}

export async function getTrendingTopics() {
  const c = getCache("ct_trending");
  if (c) return c;
  const d = await fetchTrending();
  setCache("ct_trending", d);
  return d;
}

export async function getLeaderboard() {
  const c = getCache("ct_leaderboard");
  if (c) return c;
  const d = await fetchLeaderboard();
  setCache("ct_leaderboard", d);
  return d;
}

export async function getEvents() {
  const c = getCache("ct_events");
  if (c) return c;
  const d = await fetchEvents();
  setCache("ct_events", d);
  return d;
}

export async function getSuggestedMembers() {
  const c = getCache("ct_suggested");
  if (c) return c;
  const d = await fetchSuggestedMembers();
  setCache("ct_suggested", d);
  return d;
}

export function invalidateCache() {
  ["ct_trending","ct_leaderboard","ct_events","ct_suggested"].forEach(
    (k) => localStorage.removeItem(k)
  );
}
