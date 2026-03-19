export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { completeness } = req.query;
    const NOCODB_URL = process.env.NOCODB_URL;
    const NOCODB_TOKEN = process.env.NOCODB_TOKEN;

    if (!NOCODB_URL || !NOCODB_TOKEN) {
      return res.status(500).json({
        error: 'NocoDB configuration missing'
      });
    }

    // 構建查詢 URL
    let url = NOCODB_URL;
    if (completeness && (completeness === '完整' || completeness === '未完整')) {
      // NocoDB API 查詢語法：?where=(completeness,eq,{value})
      url += `?where=(completeness,eq,${encodeURIComponent(completeness)})&limit=1000&sort=-created_at`;
    } else {
      url += '?limit=1000&sort=-created_at';
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'xc-auth': NOCODB_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`NocoDB API error: ${response.status}`);
    }

    const data = await response.json();
    
    // NocoDB 返回 { list: [...], pageInfo: {...} }
    const records = data.list || [];

    res.status(200).json({
      success: true,
      records: records,
      total: records.length
    });
  } catch (error) {
    console.error('Failed to fetch records:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch records',
      records: [] // 返回空陣列，讓前端降級處理
    });
  }
}
