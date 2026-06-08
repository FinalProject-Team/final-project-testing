import styles from './Community.module.css';
import Feed from './Feed/Feed';
import RightSidebar from './RightSidebar/RightSidebar';

export default function Community() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.layout}>
        {/* Center feed — only this scrolls */}
        <div className={styles.feedCol}>
          <Feed />
        </div>
        {/* Right sidebar — sticky widgets */}
        <RightSidebar />
      </div>
    </div>
  );
}
