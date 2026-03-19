jest.mock('@/services/ai/openrouter');
jest.mock('@/services/prompt');

import { runAI, analyzeWithAI } from '@/services/ai';
import { analyzeWithOpenRouter } from '@/services/ai/openrouter';
import { buildPrompt } from '@/services/prompt';

describe('AI Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.AI_PROVIDER = 'openrouter';
  });

  describe('runAI', () => {
    it('應該使用 OpenRouter 提供商', async () => {
      analyzeWithOpenRouter.mockResolvedValueOnce('AI 響應');

      const result = await runAI('測試提示詞');

      expect(result).toBe('AI 響應');
      expect(analyzeWithOpenRouter).toHaveBeenCalledWith('測試提示詞');
    });

    it('當無效的提供商時應該拋出錯誤', async () => {
      process.env.AI_PROVIDER = 'invalid';

      await expect(runAI('提示詞')).rejects.toThrow('No AI provider');
    });
  });

  describe('analyzeWithAI', () => {
    it('應該使用自動生成的 Prompt 進行分析', async () => {
      const mockData = { chat: '測試' };
      const mockPrompt = '構建的提示詞';
      const mockAiResponse = '分析結果';

      buildPrompt.mockReturnValueOnce(mockPrompt);
      analyzeWithOpenRouter.mockResolvedValueOnce(mockAiResponse);

      const result = await analyzeWithAI(mockData);

      expect(result).toHaveProperty('analysis', mockAiResponse);
      expect(result).toHaveProperty('timestamp');
      expect(buildPrompt).toHaveBeenCalledWith(mockData);
    });

    it('應該使用自定義 Prompt 模板', async () => {
      const mockData = { chat: '測試' };
      const customPrompt = '自定義提示詞';
      const mockAiResponse = '分析結果';

      analyzeWithOpenRouter.mockResolvedValueOnce(mockAiResponse);

      const result = await analyzeWithAI(mockData, customPrompt);

      expect(analyzeWithOpenRouter).toHaveBeenCalledWith(customPrompt);
      expect(buildPrompt).not.toHaveBeenCalled();
    });

    it('應該返回帶時間戳的分析結果', async () => {
      buildPrompt.mockReturnValueOnce('提示詞');
      analyzeWithOpenRouter.mockResolvedValueOnce('結果');

      const result = await analyzeWithAI({});

      expect(result).toHaveProperty('analysis');
      expect(result).toHaveProperty('timestamp');
      expect(new Date(result.timestamp)).toBeInstanceOf(Date);
    });
  });
});
