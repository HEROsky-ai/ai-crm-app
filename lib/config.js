// 集中配置管理
export const NOCODB_URL = process.env.NOCODB_URL || '';
export const NOCODB_TOKEN = process.env.NOCODB_TOKEN || '';
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
export const AI_PROVIDER = process.env.AI_PROVIDER || 'openrouter';
export const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || 'nocodb';

// 驗証必要的環境變數
export function validateConfig() {
  const required = {
    NOCODB_URL: NOCODB_URL,
    NOCODB_TOKEN: NOCODB_TOKEN,
    OPENROUTER_API_KEY: OPENROUTER_API_KEY
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
  }

  return missing.length === 0;
}
