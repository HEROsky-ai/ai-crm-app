export function buildPrompt(chat, images) {
  return `
你是聊天分析專家

聊天內容：
${chat}

圖片描述：
${images || "無"}

請輸出 JSON：

{
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
  "risk_alert": ""
}
`;
}
