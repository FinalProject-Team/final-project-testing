import styles from "./Skeletons.module.css";

export function PostSkeleton() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonRow}>
        <div className={styles.skeletonAvatar} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <div className={styles.skeletonLine} style={{ width: "55%" }} />
          <div className={styles.skeletonLine} style={{ width: "35%" }} />
        </div>
      </div>
      <div className={styles.skeletonBlock} />
      <div className={styles.skeletonLine} style={{ width: "80%", marginBottom: 8 }} />
      <div className={styles.skeletonLine} style={{ width: "60%" }} />
    </div>
  );
}

export function SideWidgetSkeleton({ lines = 4 }) {
  return (
    <div className={styles.skeletonCard} style={{ borderRadius: 16 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}
        >
          <div className={styles.skeletonAvatar} style={{ width: 30, height: 30 }} />
          <div style={{ flex: 1 }}>
            <div className={styles.skeletonLine} style={{ width: "70%", marginBottom: 5 }} />
            <div className={styles.skeletonLine} style={{ width: "45%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
