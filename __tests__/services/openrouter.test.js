import { analyzeWithOpenRouter } from '@/services/ai/openrouter';

describe('OpenRouter Service', () => {
  const mockApiKey = 'test-api-key';

  beforeEach(() => {
    process.env.OPENROUTER_API_KEY = mockApiKey;
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  describe('analyzeWithOpenRouter', () => {
    it('應該正確調用 OpenRouter API', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: '模擬的 AI 響應'
            }
          }
        ]
      };

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const prompt = '測試提示詞';
      const result = await analyzeWithOpenRouter(prompt);

      expect(result).toBe('模擬的 AI 響應');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://openrouter.ai/api/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: {
            Authorization: `Bearer ${mockApiKey}`,
            'Content-Type': 'application/json'
          }
        })
      );
    });

    it('應該正確處理 API 響應', async () => {
      const expectedContent = '{"personality": "outgoing"}';
      const mockResponse = {
        choices: [
          {
            message: {
              content: expectedContent
            }
          }
        ]
      };

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await analyzeWithOpenRouter('提示詞');
      expect(result).toBe(expectedContent);
    });

    it('當 API 返回錯誤時應該拋出異常', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({
          error: { message: 'API 錯誤' }
        }),
      });

      await expect(analyzeWithOpenRouter('提示詞')).rejects.toThrow('API 錯誤');
    });
  });
});
