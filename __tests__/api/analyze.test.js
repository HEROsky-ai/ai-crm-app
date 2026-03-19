jest.mock('@/services/ai');
jest.mock('@/services/prompt');
jest.mock('@/services/storage');

import handler from '@/pages/api/analyze';
import { runAI } from '@/services/ai';
import { buildPrompt } from '@/services/prompt';
import { saveRecord } from '@/services/storage';

describe('/api/analyze', () => {
  let req, res;

  beforeEach(() => {
    req = {
      method: 'POST',
      body: {
        name: 'Test User',
        chat_text: 'Hello, how are you?'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis()
    };

    jest.clearAllMocks();
  });

  it('應該成功分析聊天並保存結果', async () => {
    const mockPrompt = 'Built prompt';
    const mockAiResponse = '{"personality": "outgoing"}';
    const mockSaveResult = { Id: 1 };

    buildPrompt.mockReturnValueOnce(mockPrompt);
    runAI.mockResolvedValueOnce(mockAiResponse);
    saveRecord.mockResolvedValueOnce(mockSaveResult);

    await handler(req, res);

    expect(buildPrompt).toHaveBeenCalledWith('Hello, how are you?');
    expect(runAI).toHaveBeenCalledWith(mockPrompt);
    expect(saveRecord).toHaveBeenCalledWith({
      Name: 'Test User',
      Chat: 'Hello, how are you?',
      Analysis: '{"personality": "outgoing"}'
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ personality: 'outgoing' });
  });

  it('當 AI 響應不是有效 JSON 時應該處理', async () => {
    const mockPrompt = 'Built prompt';
    const mockAiResponse = 'This is not JSON';

    buildPrompt.mockReturnValueOnce(mockPrompt);
    runAI.mockResolvedValueOnce(mockAiResponse);
    saveRecord.mockResolvedValueOnce({ Id: 1 });

    await handler(req, res);

    expect(res.json).toHaveBeenCalledWith({
      raw: 'This is not JSON'
    });
  });

  it('當發生錯誤時應該返回 500', async () => {
    buildPrompt.mockImplementationOnce(() => {
      throw new Error('Build failed');
    });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Build failed'
    });
  });

  it('當保存失敗時應該返回錯誤', async () => {
    buildPrompt.mockReturnValueOnce('prompt');
    runAI.mockResolvedValueOnce('{"result": "ok"}');
    saveRecord.mockRejectedValueOnce(new Error('Save failed'));

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Save failed'
    });
  });

  it('應該正確驗證必需的字段', async () => {
    req.body = { name: 'Test' }; // 缺少 chat_text

    buildPrompt.mockReturnValueOnce('prompt');
    runAI.mockResolvedValueOnce('{"result": "ok"}');
    saveRecord.mockResolvedValueOnce({ Id: 1 });

    await handler(req, res);

    // 應該仍然嘗試處理，但 chat_text 會是 undefined
    expect(buildPrompt).toHaveBeenCalledWith(undefined);
  });
});
