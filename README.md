# AI 聊天分析系統

一個使用 AI 分析聊天內容的智能系統，集成 OpenRouter AI 和 NocoDB 數據庫。

## 功能特性

- 🤖 **AI 聊天分析** - 使用 GPT-4o-mini 分析聊天內容
- 📊 **多維度分析** - 性格、溝通風格、情感、興趣度等
- 📍 **FORMDH 框架** - 事實、看法、理由、動機、夢想、習慣分析
- 💾 **數據持久化** - 使用 NocoDB 存儲分析結果
- 🔒 **隱私保護** - 敏感信息使用環境變量管理

## 技術棧

- **前端**: Next.js 14, React 18
- **後端**: Node.js, Next.js API Routes
- **AI**: OpenRouter (GPT-4o-mini)
- **數據庫**: NocoDB
- **測試**: Jest, React Testing Library

## 快速開始

### 環境配置

複製環境變量模板並填入你的 API 密鑰：

```bash
cp .env.example .env.local
```

編輯 `.env.local`：
```
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=你的_OPENROUTER_API_KEY
STORAGE_PROVIDER=nocodb
NOCODB_URL=你的_NOCODB_API_URL
NOCODB_TOKEN=你的_NOCODB_TOKEN
```

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

訪問 http://localhost:3000

### 生產構建

```bash
npm run build
npm start
```

## 項目結構

```
ai-crm-app/
├── pages/
│   ├── index.js                 # 主頁面
│   ├── dashboard.js             # 儀表板
│   └── api/
│       └── analyze.js           # 分析 API 端點
├── services/
│   ├── ai/
│   │   ├── index.js            # AI 服務層
│   │   ├── openrouter.js       # OpenRouter 集成
│   │   └── prompt.js (存在 services/ 下)
│   ├── prompt.js               # 提示詞構建
│   └── storage/
│       ├── index.js            # 存儲服務層
│       └── nocodb.js           # NocoDB 集成
├── components/
│   ├── UploadForm.js           # 上傳表單組件
│   └── ResultCard.js           # 結果卡片組件
├── styles/
│   ├── index.module.css
│   ├── dashboard.module.css
│   ├── UploadForm.module.css
│   └── ResultCard.module.css
├── __tests__/                   # 測試文件
│   ├── services/
│   ├── api/
│   └── components/
├── jest.config.js              # Jest 配置
├── jest.setup.js               # Jest 初始化
└── TESTING.md                  # 測試文檔
```

## API 端點

### POST /api/analyze

分析聊天內容。

**請求體**:
```json
{
  "name": "使用者名稱",
  "chat_text": "聊天內容"
}
```

**響應**:
```json
{
  "personality": "性格描述",
  "communication_style": "溝通風格",
  "emotion": "當前情緒",
  "interest_level": "興趣度",
  "FORMDH": {
    "F": "事實",
    "O": "看法",
    "R": "理由",
    "M": "動機",
    "D": "夢想",
    "H": "習慣"
  },
  "chat_score": 75,
  "relationship_stage": "關係階段",
  "suggest_topics": ["建議話題1", "建議話題2"],
  "avoid_topics": ["應避免話題1"],
  "tone": "語氣描述",
  "reply_examples": ["回復示例1"],
  "risk_alert": "風險提示"
}
```

## 工作流程

```
用戶輸入 (名稱 + 聊天內容)
    ↓
提交表單到 /api/analyze
    ↓
構建分析提示詞
    ↓
調用 OpenRouter GPT-4o-mini
    ↓
解析 AI 響應 (JSON)
    ↓
保存結果到 NocoDB
    ↓
顯示分析結果
```

## 測試

完整的單元測試和集成測試覆蓋：

```bash
# 運行所有測試
npm test

# 監聽模式
npm run test:watch

# 覆蓋率報告
npm run test:coverage
```

詳見 [TESTING.md](TESTING.md)

## 環境變量說明

| 變量 | 說明 | 範例 |
|------|------|------|
| `AI_PROVIDER` | AI 提供商 | `openrouter` |
| `OPENROUTER_API_KEY` | OpenRouter API 密鑰 | `sk-or-v1-...` |
| `STORAGE_PROVIDER` | 存儲提供商 | `nocodb` |
| `NOCODB_URL` | NocoDB API 地址 | `https://app.nocodb.com/...` |
| `NOCODB_TOKEN` | NocoDB 認證令牌 | `xmzgXvs4MX9gx...` |

## 安全建議

⚠️ **重要**：
- 不要將 `.env.local` 提交到版本控制
- 定期輪換 API 密鑰
- 在生產環境使用環境變量管理服務
- 使用 HTTPS 通信

## 許可證

ISC
