jest.mock('@/services/storage/nocodb');

import { saveRecord, storeResult, getResult } from '@/services/storage';
import { saveToNocoDB, queryNocoDB } from '@/services/storage/nocodb';

describe('Storage Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveRecord', () => {
    it('應該直接調用 saveToNocoDB', async () => {
      const mockData = { Name: 'Test', Chat: 'Hello' };
      const mockResult = { Id: 1, ...mockData };

      saveToNocoDB.mockResolvedValueOnce(mockResult);

      const result = await saveRecord(mockData);

      expect(result).toEqual(mockResult);
      expect(saveToNocoDB).toHaveBeenCalledWith(mockData);
    });

    it('應該正確處理錯誤', async () => {
      saveToNocoDB.mockRejectedValueOnce(new Error('Network error'));

      await expect(saveRecord({})).rejects.toThrow('網路錯誤');
    });
  });

  describe('storeResult', () => {
    it('應該正確格式化和保存分析結果', async () => {
      const inputData = { name: 'User', chat: 'Hello' };
      const analysisResult = {
        analysis: 'Result',
        timestamp: '2024-01-01T00:00:00Z'
      };

      const mockSaveResult = { Id: 1 };
      saveToNocoDB.mockResolvedValueOnce(mockSaveResult);

      const result = await storeResult(inputData, analysisResult);

      expect(saveToNocoDB).toHaveBeenCalledWith({
        input: JSON.stringify(inputData),
        analysis: 'Result',
        timestamp: '2024-01-01T00:00:00Z'
      });
      expect(result).toEqual(mockSaveResult);
    });
  });

  describe('getResult', () => {
    it('應該查詢並返回結果', async () => {
      const mockResult = { Id: 1, Name: 'Test' };
      queryNocoDB.mockResolvedValueOnce(mockResult);

      const result = await getResult('123');

      expect(queryNocoDB).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockResult);
    });

    it('應該正確處理查詢錯誤', async () => {
      queryNocoDB.mockRejectedValueOnce(new Error('Query failed'));

      await expect(getResult('123')).rejects.toThrow('獲取結果失敗');
    });
  });
});
