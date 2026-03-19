import { runAI } from "@/services/ai";
import { buildPrompt } from "@/services/prompt";
import { saveRecord } from "@/services/storage";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { chat_text, images } = req.body;

    if (!chat_text?.trim() && (!images || images.length === 0)) {
      return res.status(400).json({ error: '請輸入文字或選擇圖片' });
    }

    // 構建提示詞（含圖片信息）
    const prompt = buildPrompt(chat_text, images);

    // 調用 AI
    let aiText;
    try {
      aiText = await runAI(prompt);
    } catch (aiError) {
      console.error('AI 調用失敗:', aiError);
      return res.status(500).json({ 
        error: `AI 服務錯誤: ${aiError.message || '無法連接到 OpenRouter，請檢查 API 密鑰'}` 
      });
    }

    if (!aiText || aiText.trim() === '') {
      return res.status(500).json({ 
        error: 'AI 沒有返回結果，請檢查 OpenRouter API 餘額和密鑰' 
      });
    }

    // 解析 AI 響應
    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch {
      parsed = { raw: aiText };
    }

    // 提取完整度分類
    const completeness = parsed.completeness || '未知';

    // 保存到 NocoDB
    const recordData = {
      chat_text: chat_text || '',
      images_count: images?.length || 0,
      analysis: JSON.stringify(parsed),
      completeness: completeness,
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    try {
      await saveRecord(recordData);
    } catch (saveError) {
      console.error('保存記錄失敗:', saveError);
      // 不中斷分析流程，只記錄警告
    }

    // 回傳結果（包含完整度分類）
    res.status(200).json({
      completeness: completeness,
      analysis: parsed
    });

  } catch (err) {
    console.error('分析端點錯誤:', err);
    res.status(500).json({ error: err.message || '未知錯誤' });
  }
}
