import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/index.module.css';

export default function History() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'complete', 'incomplete'

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/records');
      const data = await response.json();
      setRecords(data.records || []);
    } catch (error) {
      console.error('Failed to fetch records:', error);
      // 離線模式 - 從 localStorage 讀取
      const cached = localStorage.getItem('analysis_records');
      if (cached) {
        setRecords(JSON.parse(cached));
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record => {
    if (filter === 'all') return true;
    if (filter === 'complete') return record.completeness === '完整';
    if (filter === 'incomplete') return record.completeness === '未完整';
    return true;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-TW');
  };

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>分析記錄</h1>
        <Link href="/">
          <button style={{ padding: '8px 16px', backgroundColor: '#4a90e2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            新增分析
          </button>
        </Link>
      </div>

      {/* 篩選按鈕 */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 16px',
            backgroundColor: filter === 'all' ? '#4a90e2' : '#d9d9d9',
            color: filter === 'all' ? 'white' : '#666',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          所有記錄 ({records.length})
        </button>
        <button
          onClick={() => setFilter('complete')}
          style={{
            padding: '8px 16px',
            backgroundColor: filter === 'complete' ? '#52c41a' : '#d9d9d9',
            color: filter === 'complete' ? 'white' : '#666',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ✓ 完整 ({records.filter(r => r.completeness === '完整').length})
        </button>
        <button
          onClick={() => setFilter('incomplete')}
          style={{
            padding: '8px 16px',
            backgroundColor: filter === 'incomplete' ? '#faad14' : '#d9d9d9',
            color: filter === 'incomplete' ? 'white' : '#666',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ✗ 未完整 ({records.filter(r => r.completeness === '未完整').length})
        </button>
      </div>

      {/* 記錄列表 */}
      {loading ? (
        <p>加載中...</p>
      ) : filteredRecords.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>
          {filter === 'all' ? '沒有記錄' : '該分類沒有記錄'}
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
          {filteredRecords.map((record, idx) => (
            <div
              key={idx}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: record.completeness === '完整' ? '#f6ffed' : '#fffbe6',
                borderLeft: `4px solid ${record.completeness === '完整' ? '#52c41a' : '#faad14'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    backgroundColor: record.completeness === '完整' ? '#52c41a' : '#faad14',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  {record.completeness === '完整' ? '✓ 完整' : '✗ 未完整'}
                </span>
                {record.images_count > 0 && (
                  <span style={{ fontSize: '12px', color: '#999' }}>
                    🖼️ {record.images_count} 張圖
                  </span>
                )}
              </div>

              <p style={{ margin: '10px 0', fontWeight: 'bold', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {record.chat_text || '（無文字內容）'}
              </p>

              <p style={{ margin: '10px 0', fontSize: '12px', color: '#666' }}>
                {formatDate(record.created_at || record.timestamp)}
              </p>

              {record.analysis && (
                <details style={{ marginTop: '10px', fontSize: '12px' }}>
                  <summary style={{ cursor: 'pointer', color: '#4a90e2', fontWeight: 'bold' }}>
                    查看分析詳情
                  </summary>
                  <pre
                    style={{
                      marginTop: '10px',
                      background: 'white',
                      padding: '10px',
                      borderRadius: '4px',
                      overflow: 'auto',
                      maxHeight: '300px',
                      fontSize: '11px'
                    }}
                  >
                    {typeof record.analysis === 'string' ? record.analysis : JSON.stringify(record.analysis, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
