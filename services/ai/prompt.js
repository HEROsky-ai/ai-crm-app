export function buildPrompt(data) {
  // 根據不同的數據類型構建適當的提示詞
  let prompt = '請分析以下信息並提供見解:\n\n';

  if (typeof data === 'object') {
    Object.entries(data).forEach(([key, value]) => {
      prompt += `${key}: ${value}\n`;
    });
  } else {
    prompt += data;
  }

  prompt += '\n請提供詳細的分析和建議。';
  return prompt;
}
