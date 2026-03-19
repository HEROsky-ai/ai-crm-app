import { analyzeWithOpenRouter } from "./openrouter";
import { buildPrompt } from "./prompt";

export async function runAI(prompt) {
  const provider = process.env.AI_PROVIDER;

  if (provider === "openrouter") {
    return analyzeWithOpenRouter(prompt);
  }

  throw new Error("No AI provider");
}

export async function analyzeWithAI(data, promptTemplate = null) {
  try {
    // 構建或使用自定義提示詞
    const prompt = promptTemplate || buildPrompt(data);

    // 調用 AI
    const response = await runAI(prompt);

    return {
      analysis: response,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    throw new Error(`AI 分析失敗: ${error.message}`);
  }
}

export { analyzeWithOpenRouter, buildPrompt };
