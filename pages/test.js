import { useState } from 'react';

export default function TestAPI() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_text: '這是一個測試訊息，我想了解更多關於產品的信息',
          images: []
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || `API 錯誤 (${response.status})`);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1>🧪 API 測試頁面</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <button
          onClick={testAPI}
          disabled={loading}
          style={{
            padding: '15px 30px',
            fontSize: '16px',
            backgroundColor: loading ? '#ccc' : '#4a90e2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ 測試中...' : '🚀 點擊測試 API'}
        </button>
      </div>

      {/* 錯誤信息 */}
      {error && (
        <div style={{
          background: '#fff1f0',
          border: '1px solid #ffccc7',
          color: '#cf1322',
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px',
          whiteSpace: 'pre-wrap'
        }}>
          <strong>❌ 錯誤：</strong>
          <br />
          {error}
        </div>
      )}

      {/* 成功結果 */}
      {result && (
        <div style={{
          background: '#f6ffed',
          border: '1px solid #b7eb8f',
          color: '#274e0f',
          padding: '15px',
          borderRadius: '4px'
        }}>
          <strong>✅ 成功！</strong>
          <br />
          <br />
          <strong>完整度分類：</strong> 
          <span style={{ 
            color: result.completeness === '完整' ? '#52c41a' : '#faad14',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            {result.completeness}
          </span>
          
          <br />
          <br />
          
          <strong>完整分析結果：</strong>
          <pre style={{
            background: 'white',
            padding: '10px',
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px',
            fontSize: '12px'
          }}>
            {JSON.stringify(result.analysis, null, 2)}
          </pre>
        </div>
      )}

      {/* 測試信息 */}
      <div style={{
        background: '#e6f7ff',
        border: '1px solid #91d5ff',
        color: '#0050b3',
        padding: '15px',
        borderRadius: '4px',
        marginTop: '30px',
        fontSize: '14px'
      }}>
        <strong>ℹ️ 測試信息：</strong>
        <ul>
          <li>測試文本：「這是一個測試訊息，我想了解更多關於產品的信息」</li>
          <li>測試圖片：無</li>
          <li>API 端點：/api/analyze</li>
          <li>方法：POST</li>
        </ul>
      </div>
    </div>
  );
}
