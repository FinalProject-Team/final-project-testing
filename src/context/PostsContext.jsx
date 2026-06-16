import { createContext, useContext, useState, useEffect } from "react";
import { POSTS_DATA } from "../data/communityData";
import {
  apiGetAllPosts,
  apiCreatePost,
  apiLikePost,
  apiSavePost,
  apiAddComment,
  apiDeletePost,
} from "../services/api/api";

// ─────────────────────────────────────────────────────
//  Global posts state — all mutations live here.
//  Connected to real API endpoints via services/api/api.js
// ─────────────────────────────────────────────────────

const PostsContext = createContext(null);

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch posts from API on mount
  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGetAllPosts();
      setPosts(Array.isArray(data) ? data : data?.posts || POSTS_DATA);
    } catch (err) {
      console.error("Failed to load posts:", err);
      setError(err.message);
      // Fallback to mock data on error
      setPosts(POSTS_DATA);
    } finally {
      setLoading(false);
    }
  }

  // ── Like ──────────────────────────────────────────
  async function toggleLike(postId) {
    try {
      await apiLikePost(postId);
      setPosts((prev) =>
        prev.map((p) =>
          p.id !== postId ? p : {
            ...p,
            liked: !p.liked,
            likes: p.liked ? p.likes - 1 : p.likes + 1,
          }
        )
      );
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  }

  // ── Save ──────────────────────────────────────────
  async function toggleSave(postId) {
    try {
      await apiSavePost(postId);
      setPosts((prev) =>
        prev.map((p) =>
          p.id !== postId ? p : { ...p, saved: !p.saved }
        )
      );
    } catch (err) {
      console.error("Failed to save post:", err);
    }
  }

  // ── Add Comment ───────────────────────────────────
  async function addComment(postId, commentText, user) {
    if (!commentText.trim()) return;
    try {
      await apiAddComment(postId, commentText);
      const newComment = {
        id: Date.now(),
        author: { name: user.name, avatar: user.avatar, role: user.role },
        text: commentText.trim(),
        timeAgo: "just now",
        likes: 0,
        liked: false,
      };
      setPosts((prev) =>
        prev.map((p) =>
          p.id !== postId ? p : {
            ...p,
            comments: p.comments + 1,
            commentList: [newComment, ...(p.commentList || [])],
          }
        )
      );
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  }

  // ── Add Post ──────────────────────────────────────
  async function addPost(postData, user) {
    try {
      const newPostFromApi = await apiCreatePost(postData.content, postData.image || "");
      const newPost = {
        id: newPostFromApi.id || Date.now(),
        type: postData.type || "Discussion",
        author: {
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          verified: user.verified || false,
          level: user.level || 1,
        },
        timeAgo: "just now",
        content: postData.content,
        tags: postData.tags || [],
        image: postData.image || null,
        likes: 0,
        comments: 0,
        saves: 0,
        liked: false,
        saved: false,
        commentList: [],
        ...(postData.poll ? { poll: postData.poll } : {}),
      };
      setPosts((prev) => [newPost, ...prev]);
      return newPost;
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  }

  // ── Delete Post ───────────────────────────────────
  async function deletePost(postId) {
    try {
      await apiDeletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  }

  return (
    <PostsContext.Provider value={{
      posts, loading, error, loadPosts,
      toggleLike, toggleSave, addComment, addPost, deletePost,
    }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error("usePosts must be used inside <PostsProvider>");
  return ctx;
}