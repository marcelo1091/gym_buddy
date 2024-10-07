import styles from "./loading.module.css";

export const Loading = () => {
  return (
    <div className={styles.loadingBackground}>
      <div className={styles.loadingContainer}>
        <div className={styles.ldsRing}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p>Loading</p>
      </div>
    </div>
  );
};
