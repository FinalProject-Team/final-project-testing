// ❌ STATIC DATA — all functions return mock data from communityData.js with simulated delays
// TODO: Replace each function body with real axios calls:
//   fetchPosts()   → GET /api/posts
//   createPost()   → POST /api/posts
//   likePost()     → PATCH /api/posts/:id/like
//   deletePost()   → DELETE /api/posts/:id
// ═══════════════════════════════════════════════════════
//  Post Service — all post-related API calls
//  Currently returns mock data.
//  TODO: Replace each function body with real axios calls
//        once the backend is ready.
// ═══════════════════════════════════════════════════════

import { POSTS_DATA } from "../../data/communityData";

const DELAY = (ms) => new Promise((r) => setTimeout(r, ms));

// TODO: GET /api/posts?filter=forYou&page=1
export async function fetchPosts(filter = "forYou") {
  await DELAY(500);
  return POSTS_DATA;
}

// TODO: POST /api/posts
export async function createPost(payload) {
  await DELAY(300);
  return { id: Date.now(), ...payload };
}

// TODO: PATCH /api/posts/:id/like
export async function likePost(postId) {
  await DELAY(100);
  return { success: true, postId };
}

// TODO: PATCH /api/posts/:id/save
export async function savePost(postId) {
  await DELAY(100);
  return { success: true, postId };
}

// TODO: POST /api/posts/:id/comments
export async function postComment(postId, text) {
  await DELAY(200);
  return {
    id: Date.now(),
    postId,
    text,
    timeAgo: "just now",
  };
}

// TODO: POST /api/posts/:id/poll/vote
export async function castPollVote(postId, optionIndex) {
  await DELAY(150);
  return { success: true, postId, optionIndex };
}

// TODO: DELETE /api/posts/:id
export async function removePost(postId) {
  await DELAY(200);
  return { success: true, postId };
}
