import { runAI } from "@/services/ai";
import { buildPrompt } from "@/services/prompt";
import { saveRecord } from "@/services/storage";

export default async function handler(req, res) {
  try {
    const { name, chat_text } = req.body;

    const prompt = buildPrompt(chat_text);

    const aiText = await runAI(prompt);

    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch {
      parsed = { raw: aiText };
    }

    await saveRecord({
      Name: name,
      Chat: chat_text,
      Analysis: JSON.stringify(parsed)
    });

    res.status(200).json(parsed);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
