export function buildPrompt(chat, images) {
  return `
你是聊天分析專家

聊天內容：
${chat}

圖片數量：${images?.length || 0}

請分析信息的完整度（有清楚的上下文、足夠的細節、即能判斷用户意圖）：
- 如果信息充分、詳細、有明確的背景或意圖 → 回傳 "完整"
- 如果信息不足、缺少關鍵細節或上下文不清 → 回傳 "未完整"

請輸出 JSON格式（必須包含 completeness 字段）：

{
  "completeness": "完整 或 未完整",
  "personality": "",
  "communication_style": "",
  "emotion": "",
  "interest_level": "",
  "FORMDH": {
    "F": "",
    "O": "",
    "R": "",
    "M": "",
    "D": "",
    "H": ""
  },
  "chat_score": 0,
  "relationship_stage": "",
  "suggest_topics": [],
  "avoid_topics": [],
  "tone": "",
  "reply_examples": [],
  "risk_alert": "",
  "completeness_reason": "說明為什麼是完整或未完整"
}
`;
}
