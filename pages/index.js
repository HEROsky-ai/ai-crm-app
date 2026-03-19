import { useState } from "react";
import styles from '../styles/index.module.css';

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const name = e.target.name.value;
    const chat = e.target.chat.value;

    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({
          name,
          chat_text: chat
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();
      setResult(data);
      e.target.reset();
    } catch (error) {
      alert('錯誤: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <h1>AI聊天分析系統</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
        <input 
          name="name" 
          placeholder="名稱" 
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <br />
        <textarea 
          name="chat" 
          placeholder="貼聊天內容" 
          required
          rows={10}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <br />
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '10px 20px', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? '分析中...' : '分析'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h2>分析結果</h2>
          <pre style={{ background: '#f5f5f5', padding: '20px', borderRadius: '4px', overflow: 'auto' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
