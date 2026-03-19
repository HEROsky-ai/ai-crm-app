import { buildPrompt } from '@/services/prompt';

describe('Prompt Service', () => {
  describe('buildPrompt', () => {
    it('應該正確構建聊天分析提示詞', () => {
      const chat = '你好，我想了解你的想法';
      const images = '用戶頭像';

      const prompt = buildPrompt(chat, images);

      expect(prompt).toContain('你是聊天分析專家');
      expect(prompt).toContain(chat);
      expect(prompt).toContain(images);
      expect(prompt).toContain('personality');
      expect(prompt).toContain('FORMDH');
    });

    it('當沒有圖片時應該顯示"無"', () => {
      const chat = '測試聊天';
      const prompt = buildPrompt(chat);

      expect(prompt).toContain('無');
    });

    it('應該返回包含所有分析字段的提示詞', () => {
      const chat = '聊天內容';
      const prompt = buildPrompt(chat, 'image');

      const requiredFields = [
        'personality',
        'communication_style',
        'emotion',
        'interest_level',
        'chat_score',
        'relationship_stage',
        'suggest_topics',
        'avoid_topics',
        'tone',
        'reply_examples',
        'risk_alert'
      ];

      requiredFields.forEach(field => {
        expect(prompt).toContain(field);
      });
    });

    it('應該正確格式化 FORMDH 框架', () => {
      const chat = '測試';
      const prompt = buildPrompt(chat);

      expect(prompt).toContain('"F": ""');
      expect(prompt).toContain('"O": ""');
      expect(prompt).toContain('"R": ""');
      expect(prompt).toContain('"M": ""');
      expect(prompt).toContain('"D": ""');
      expect(prompt).toContain('"H": ""');
    });
  });
});
