import { runAI } from "@/services/ai";
import { buildPrompt } from "@/services/prompt";
import { saveRecord } from "@/services/storage";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { chat_text, images } = req.body;

    if (!chat_text?.trim() && (!images || images.length === 0)) {
      return res.status(400).json({ error: '請輸入文字或選擇圖片' });
    }

    // 構建提示詞（含圖片信息）
    const prompt = buildPrompt(chat_text, images);

    // 調用 AI
    const aiText = await runAI(prompt);

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

    await saveRecord(recordData);

    // 回傳結果（包含完整度分類）
    res.status(200).json({
      completeness: completeness,
      analysis: parsed
    });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}
