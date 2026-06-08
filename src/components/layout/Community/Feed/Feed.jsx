import { useState, useMemo } from "react";
import styles from "./Feed.module.css";
import PostCard from "../PostCard/PostCard";
import CreatePostModal from "../CreatePostModal/CreatePostModal";
import { PostSkeleton } from "../Skeletons/Skeletons";
import { usePosts } from "../../../../context/PostsContext";
import { useAuth } from "../../../../context/AuthContext";
import { BsImage, BsCode, BsFileEarmarkText } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";

const FILTERS = ["For You", "Trending", "Latest"];

export default function Feed() {
  const { posts } = usePosts();
  const { user }  = useAuth();
  const [activeFilter, setActiveFilter] = useState("For You");
  const [showModal, setShowModal]       = useState(false);
  const [sortOpen, setSortOpen]         = useState(false);

  const loading = false;
  const error   = null;

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    let list = [...posts];
    if (activeFilter === "Trending") list.sort((a, b) => b.likes - a.likes);
    if (activeFilter === "Latest")   list.reverse();
    return list;
  }, [posts, activeFilter]);

  return (
    <>
      <main className={styles.feed}>
        {/* Create Post Card */}
        <div className={styles.createPost}>
          <div className={styles.createTop}>
            <img src={user?.avatar} alt={user?.name} className={styles.avatar} />
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
            <button className={styles.createBtn} onClick={() => setShowModal(true)}><BsImage size={13} /> Image</button>
            <button className={styles.createBtn} onClick={() => setShowModal(true)}><BsCode size={13} /> Code</button>
            <button className={styles.createBtn} onClick={() => setShowModal(true)}><BsFileEarmarkText size={13} /> Article</button>
            <button className={styles.postBtn} onClick={() => setShowModal(true)}>Post</button>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          {FILTERS.map((f, i) => (
            <span key={f}>
              {i === FILTERS.length - 1 && <div className={styles.filterSep} />}
              <button
                className={`${styles.filterBtn} ${activeFilter === f ? styles.filterActive : ""}`}
                onClick={() => setActiveFilter(f)}
              >
                {f === "For You"  && "⭐ "}
                {f === "Trending" && "🔥 "}
                {f}
              </button>
            </span>
          ))}
          <div className={styles.sortWrap}>
            <button className={styles.sortBtn} onClick={() => setSortOpen((v) => !v)}>
              Top <FiChevronDown size={12} />
            </button>
            {sortOpen && (
              <div className={styles.sortMenu}>
                {["Top", "New", "Hot"].map((s) => (
                  <button key={s} className={styles.sortItem} onClick={() => setSortOpen(false)}>{s}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Posts */}
        {loading && <><PostSkeleton /><PostSkeleton /><PostSkeleton /></>}
        {error   && <p className={styles.errorMsg}>⚠ Failed to load posts: {error}</p>}
        {!loading && !error && filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </main>

      {showModal && <CreatePostModal onClose={() => setShowModal(false)} />}
    </>
  );
}
