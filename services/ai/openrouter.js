export async function analyzeWithOpenRouter(prompt) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      throw new Error('缺少 OPENROUTER_API_KEY 環境變數');
    }

    if (!apiKey.startsWith('sk-or-v1-')) {
      throw new Error('invalid OPENROUTER_API_KEY 格式，應以 sk-or-v1- 開頭');
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await res.json();

    // 檢查 API 錯誤響應
    if (!res.ok) {
      console.error('OpenRouter API 錯誤:', data);
      throw new Error(`OpenRouter API 錯誤 (${res.status}): ${data.error?.message || JSON.stringify(data)}`);
    }

    // 檢查是否有有效的內容
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error('OpenRouter 無效回應:', data);
      throw new Error('OpenRouter 未返回有效內容，請檢查 API 密鑰和配額');
    }

    return content;
  } catch (error) {
    console.error('OpenRouter 函數錯誤:', error);
    throw error;
  }
}

// 向後兼容
export const callOpenRouter = analyzeWithOpenRouter;
