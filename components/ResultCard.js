import styles from '../styles/ResultCard.module.css';

export default function ResultCard({ data }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>分析結果</h2>
        <p className={styles.timestamp}>{new Date(data.timestamp).toLocaleString()}</p>
      </div>

      {data.input && (
        <div className={styles.section}>
          <h3>輸入信息</h3>
          <pre className={styles.content}>{JSON.stringify(JSON.parse(data.input), null, 2)}</pre>
        </div>
      )}

      {data.analysis && (
        <div className={styles.section}>
          <h3>AI 分析</h3>
          <div className={styles.content}>{data.analysis}</div>
        </div>
      )}

      <div className={styles.footer}>
        <a href="/">返回主頁</a>
      </div>
    </div>
  );
}
