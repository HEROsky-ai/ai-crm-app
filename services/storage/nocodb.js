export async function saveToNocoDB(data) {
  const res = await fetch(
    `${process.env.NOCODB_URL}`,
    {
      method: "POST",
      headers: {
        "xc-auth": process.env.NOCODB_TOKEN,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );

  return res.json();
}

// 向後兼容
export async function insertNocoDB(data) {
  return saveToNocoDB(data);
}

export async function queryNocoDB(recordId) {
  if (!process.env.NOCODB_URL || !process.env.NOCODB_TOKEN) {
    throw new Error('NocoDB 環境變量未設定');
  }

  try {
    const response = await fetch(`${process.env.NOCODB_URL}/${recordId}`, {
      method: 'GET',
      headers: {
        'xc-auth': process.env.NOCODB_TOKEN,
      },
    });

    if (!response.ok) {
      throw new Error('NocoDB 查詢失敗');
    }

    return await response.json();
  } catch (error) {
    throw new Error(`NocoDB 查詢失敗: ${error.message}`);
  }
}
