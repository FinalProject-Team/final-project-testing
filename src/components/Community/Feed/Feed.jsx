import { useState, useMemo, useRef, useEffect } from "react";
import styles from "./Feed.module.css";
import PostCard from "../PostCard/PostCard";
import CreatePostModal from "../CreatePostModal/CreatePostModal";
import { PostSkeleton } from "../Skeletons/Skeletons";
import { usePosts } from "../../../context/PostsContext";
import { useAuth } from "../../../context/communityAuth";
import { BsImage, BsBarChart, BsCode, BsFileEarmarkText } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";
import { TbSearch } from "react-icons/tb";
import { useDebounce } from "../../../hooks/useDebounce";

const FILTERS = ["For You", "Following", "Trending", "Latest"];

export default function Feed() {
  const { posts } = usePosts();
  const { user }  = useAuth();
  const [activeFilter, setActiveFilter] = useState("For You");
  const [showModal, setShowModal]       = useState(false);
  const [sortOpen, setSortOpen]         = useState(false);
  const [searchInput, setSearchInput]   = useState("");
  const searchQuery                     = useDebounce(searchInput, 300);
  const sortRef                         = useRef(null);

  // Close sort menu on outside click
  useEffect(() => {
    if (!sortOpen) return;
    function handler(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sortOpen]);

  const loading = false;
  const error   = null;

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    let list = [...posts];

    // Apply search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.content?.toLowerCase().includes(q) ||
          p.author?.name?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q)) ||
          p.type?.toLowerCase().includes(q)
      );
    }

    // Apply tab filter — always sort from a fresh copy
    if (activeFilter === "Trending") list.sort((a, b) => b.likes - a.likes);
    if (activeFilter === "Latest")   list.sort((a, b) => b.id - a.id);

    return list;
  }, [posts, activeFilter, searchQuery]);

  return (
    <>
      <main className={styles.feed}>
        {/* ── Search Bar ── */}
        <div className={styles.searchBar}>
          <TbSearch className={styles.searchIcon} size={16} />
          <input
            className={styles.searchInput}
            placeholder="Search posts, people, tags…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search community posts"
          />
          {searchInput && (
            <button className={styles.clearSearch} onClick={() => setSearchInput("")} aria-label="Clear search">
              ×
            </button>
          )}
        </div>

        {/* ── Create Post Card ── */}
        <div className={styles.createPost}>
          <div className={styles.createTop}>
            <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=user`} alt={user?.name || "User"} className={styles.avatar} />
            <div
              className={styles.createInput}
              role="button"
              tabIndex={0}
              onClick={() => setShowModal(true)}
              onKeyDown={(e) => e.key === "Enter" && setShowModal(true)}
            >
              What's on your mind?
            </div>
          </div>
          <div className={styles.createActions}>
            <button className={styles.createBtn} onClick={() => setShowModal(true)}><BsImage   size={13} /> Image</button>
            <button className={styles.createBtn} onClick={() => setShowModal(true)}><BsBarChart size={13} /> Poll</button>
            <button className={styles.createBtn} onClick={() => setShowModal(true)}><BsCode    size={13} /> Code</button>
            <button className={styles.createBtn} onClick={() => setShowModal(true)}><BsFileEarmarkText size={13} /> Article</button>
            <button className={styles.postBtn}   onClick={() => setShowModal(true)}>Post</button>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className={styles.filters}>
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${activeFilter === f ? styles.filterActive : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f === "For You"  && "⭐ "}
              {f === "Trending" && "🔥 "}
              {f}
            </button>
          ))}
          <div className={styles.sortWrap} ref={sortRef}>
            <button className={styles.sortBtn} onClick={() => setSortOpen((v) => !v)}>
              Top <FiChevronDown size={12} />
            </button>
            {sortOpen && (
              <div className={styles.sortMenu}>
                {["Top", "New", "Hot"].map((s) => (
                  <button key={s} className={styles.sortItem} onClick={() => { setSortOpen(false); setActiveFilter(s === "New" ? "Latest" : "Trending"); }}>{s}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Posts ── */}
        {loading && <><PostSkeleton /><PostSkeleton /><PostSkeleton /></>}
        {error   && <p className={styles.errorMsg}>⚠ Failed to load posts: {error}</p>}
        {!loading && !error && filteredPosts.length === 0 && (
          <div className={styles.emptyState}>
            <p>{searchQuery ? `No posts matching "${searchQuery}"` : "No posts yet. Be the first to post!"}</p>
          </div>
        )}
        {!loading && !error && filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </main>

      {/* Create Post Modal */}
      {showModal && <CreatePostModal onClose={() => setShowModal(false)} />}
    </>
  );
}
