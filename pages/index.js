import { useState, useRef, useEffect } from "react";
import styles from '../styles/index.module.css';
import Link from 'next/link';

export default function Home() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [chatText, setChatText] = useState("");
  const fileInputRef = useRef(null);
  const textAreaRef = useRef(null);

  const MAX_IMAGES = 15;

  // 處理圖片選擇
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const availableSlots = MAX_IMAGES - images.length;
    const filesToAdd = files.slice(0, availableSlots);

    filesToAdd.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    if (files.length > availableSlots) {
      alert(`最多只能上傳 ${MAX_IMAGES} 張圖片，已達到上限`);
    }
  };

  // 處理粘貼事件 (Ctrl+V)
  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onloadend = () => {
          if (images.length < MAX_IMAGES) {
            setImages(prev => [...prev, reader.result]);
          } else {
            alert(`最多只能上傳 ${MAX_IMAGES} 張圖片`);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // 刪除圖片
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // 保存記錄到 localStorage
  const saveToLocalStorage = (record) => {
    try {
      const existing = JSON.parse(localStorage.getItem('analysis_records') || '[]');
      const updated = [record, ...existing].slice(0, 100); // 保留最近 100 筆
      localStorage.setItem('analysis_records', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  // 分析
  async function handleSubmit(e) {
    e.preventDefault();

    if (!chatText.trim() && images.length === 0) {
      setError('請輸入文字或選擇圖片');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({
          chat_text: chatText,
          images: images
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `API 錯誤 (${res.status}): 分析失敗，請檢查 OpenRouter API 密鑰`);
      }

      setResult(data);
      setError(null);
      
      // 保存到 localStorage 用於離線訪問
      const record = {
        chat_text: chatText,
        images_count: images.length,
        completeness: data.completeness,
        analysis: data.analysis,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      saveToLocalStorage(record);
      
      setChatText("");
      setImages([]);
    } catch (error) {
      console.error('分析錯誤:', error);
      setError(error.message || '分析失敗，請稍後重試');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>AI聊天分析系統</h1>
        <Link href="/history">
          <button style={{ padding: '8px 16px', backgroundColor: '#4a90e2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            查看記錄
          </button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* 文字輸入 */}
        <textarea 
          ref={textAreaRef}
          value={chatText}
          onChange={(e) => setChatText(e.target.value)}
          onPaste={handlePaste}
          placeholder="貼聊天內容或按 Ctrl+V 粘貼圖片"
          rows={8}
          style={{ width: '100%', padding: '10px', marginBottom: '15px', fontFamily: 'system-ui' }}
        />

        {/* 圖片預覽 */}
        {images.length > 0 && (
          <div style={{ marginBottom: '15px' }}>
            <p style={{ marginBottom: '10px', color: '#666' }}>已選擇 {images.length}/{MAX_IMAGES} 張圖片</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px' }}>
              {images.map((img, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <img src={img} alt={`preview-${idx}`} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 文件上傳按鈕 */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={images.length >= MAX_IMAGES || loading}
          style={{ 
            marginBottom: '15px', 
            padding: '10px 20px', 
            backgroundColor: '#95de64',
            border: 'none',
            borderRadius: '4px',
            cursor: images.length >= MAX_IMAGES ? 'not-allowed' : 'pointer',
            opacity: images.length >= MAX_IMAGES ? 0.5 : 1
          }}
        >
          選擇圖片 ({images.length}/{MAX_IMAGES})
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageSelect}
          style={{ display: 'none' }}
        />

        {/* 提交按鈕 */}
        <button 
          type="submit" 
          disabled={loading || (!chatText.trim() && images.length === 0)}
          style={{ 
            width: '100%',
            padding: '12px 20px', 
            backgroundColor: '#4a90e2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading || (!chatText.trim() && images.length === 0) ? 0.5 : 1
          }}
        >
          {loading ? '分析中...' : '開始分析'}
        </button>
      </form>

      {/* 錯誤信息 */}
      {error && (
        <div style={{ 
          marginTop: '30px', 
          maxWidth: '600px', 
          margin: '30px auto',
          background: '#fff1f0', 
          border: '1px solid #ffccc7',
          padding: '15px', 
          borderRadius: '4px',
          color: '#cf1322',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          fontSize: '14px'
        }}>
          <strong>❌ 分析失敗：</strong>
          <br />
          {error}
          <br />
          <br />
          <details style={{ marginTop: '10px', fontSize: '12px', cursor: 'pointer' }}>
            <summary style={{ fontWeight: 'bold', color: '#cf1322' }}>診斷建議</summary>
            <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
              <li>檢查 .env.local 中 OPENROUTER_API_KEY 是否正確（應以 sk-or-v1- 開頭）</li>
              <li>訪問 <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer">openrouter.ai</a> 檢查 API 餘額</li>
              <li>打開瀏覽器 F12 控制台查看完整錯誤信息</li>
              <li>重新構建項目：npm run build</li>
            </ul>
          </details>
        </div>
      )}

      {/* 分析結果 */}
      {result && (
        <div style={{ marginTop: '30px', maxWidth: '600px', margin: '30px auto' }}>
          <h2>分析結果</h2>
          <div style={{ 
            background: '#f5f5f5', 
            padding: '20px', 
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            <p><strong>完整度分類：</strong> <span style={{ 
              color: result.completeness === '完整' ? '#52c41a' : '#faad14',
              fontWeight: 'bold'
            }}>{result.completeness}</span></p>
            <p><strong>分析結果：</strong></p>
            <pre style={{ background: 'white', padding: '10px', borderRadius: '4px', overflow: 'auto', maxHeight: '400px' }}>
              {JSON.stringify(result.analysis, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
