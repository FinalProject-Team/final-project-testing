import { createContext, useContext, useState, useEffect } from "react";
import { POSTS_DATA } from "../data/communityData";

// ─────────────────────────────────────────────────────
//  Global posts state — all mutations live here.
//  TODO: Replace each action with real API calls from
//        src/services/postService.js when backend is ready
// ─────────────────────────────────────────────────────

const PostsContext = createContext(null);

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState(() => {
    try {
      const cached = localStorage.getItem("ct_posts_state");
      if (cached) return JSON.parse(cached);
    } catch { /* ignore */ }
    return POSTS_DATA;
  });

  // Persist local state so refreshes don't lose interactions
  useEffect(() => {
    localStorage.setItem("ct_posts_state", JSON.stringify(posts));
  }, [posts]);

  // ── Like ──────────────────────────────────────────
  function toggleLike(postId) {
    // TODO: PATCH /api/posts/:id/like
    setPosts((prev) =>
      prev.map((p) =>
        p.id !== postId ? p : {
          ...p,
          liked: !p.liked,
          likes: p.liked ? p.likes - 1 : p.likes + 1,
        }
      )
    );
  }

  // ── Save ──────────────────────────────────────────
  function toggleSave(postId) {
    // TODO: PATCH /api/posts/:id/save
    setPosts((prev) =>
      prev.map((p) =>
        p.id !== postId ? p : { ...p, saved: !p.saved }
      )
    );
  }

  // ── Vote on Poll ──────────────────────────────────
  function votePoll(postId, optionIndex) {
    // TODO: POST /api/posts/:id/poll/vote { optionIndex }
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId || !p.poll || p.poll.voted) return p;
        const options = p.poll.options.map((opt, i) =>
          i === optionIndex
            ? { ...opt, votes: opt.votes + 1 }
            : opt
        );
        const total = options.reduce((sum, o) => sum + o.votes, 0);
        const withPercent = options.map((o) => ({
          ...o,
          percent: Math.round((o.votes / total) * 100),
        }));
        return {
          ...p,
          poll: { ...p.poll, options: withPercent, totalVotes: total, voted: optionIndex },
        };
      })
    );
  }

  // ── Add Comment ───────────────────────────────────
  function addComment(postId, commentText, user) {
    // TODO: POST /api/posts/:id/comments { text }
    if (!commentText.trim()) return;
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
  }

  // ── Add Post ──────────────────────────────────────
  function addPost(postData, user) {
    // TODO: POST /api/posts { type, content, tags, image }
    const newPost = {
      id: Date.now(),
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
  }

  // ── Delete Post ───────────────────────────────────
  function deletePost(postId) {
    // TODO: DELETE /api/posts/:id
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }

  return (
    <PostsContext.Provider value={{
      posts, toggleLike, toggleSave, votePoll, addComment, addPost, deletePost,
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
