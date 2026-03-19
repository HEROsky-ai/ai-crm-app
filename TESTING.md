# 測試文檔

## 測試架構概覽

本項目使用 Jest 和 React Testing Library 進行全面的單元測試和集成測試。

## 測試覆蓋範圍

### 1. 服務層測試 (`__tests__/services/`)

#### `prompt.test.js`
測試提示詞構建邏輯：
- ✅ 正確構建聊天分析提示詞
- ✅ 處理圖片描述字段
- ✅ 包含所有必需的分析維度
- ✅ 正確格式化 FORMDH 框架

#### `openrouter.test.js`
測試 OpenRouter AI 服務集成：
- ✅ 正確調用 OpenRouter API
- ✅ 處理 API 響應
- ✅ 錯誤處理和異常拋出

#### `ai.test.js`
測試 AI 服務層抽象：
- ✅ 使用正確的 AI 提供商（OpenRouter）
- ✅ 自動提示詞生成和自定義提示詞支持
- ✅ 返回帶時間戳的分析結果

#### `storage.test.js`
測試數據儲存功能：
- ✅ 保存分析結果到 NocoDB
- ✅ 查詢已存儲的結果
- ✅ 正確的數據格式化

### 2. API 集成測試 (`__tests__/api/`)

#### `analyze.test.js`
測試 `/api/analyze` 端點：
- ✅ 成功分析聊天並保存結果
- ✅ 處理無效的 JSON 響應
- ✅ 錯誤處理（返回 500 狀態）
- ✅ 字段驗證

### 3. 組件測試 (`__tests__/components/`)

#### `Home.test.js`
測試主頁組件：
- ✅ 渲染表單和標題
- ✅ 正確提交表單數據
- ✅ 顯示分析結果
- ✅ 加載狀態管理
- ✅ 錯誤處理
- ✅ 表單重置

## 運行測試

### 安裝依賴

```bash
npm install
```

### 運行所有測試

```bash
npm test
```

### 監聽模式運行測試（開發時使用）

```bash
npm run test:watch
```

### 生成測試覆蓋率報告

```bash
npm run test:coverage
```

## 測試文件結構

```
__tests__/
├── services/
│   ├── prompt.test.js      # 提示詞構建測試
│   ├── ai.test.js          # AI 服務測試
│   ├── openrouter.test.js  # OpenRouter 集成測試
│   └── storage.test.js     # 存儲服務測試
├── api/
│   └── analyze.test.js     # 分析 API 端點測試
└── components/
    └── Home.test.js        # 主頁組件測試
```

## 配置文件

- `jest.config.js` - Jest 配置文件
- `jest.setup.js` - Jest 初始化文件

## 測試工具

- **Jest** - 測試框架
- **@testing-library/react** - React 組件測試
- **@testing-library/jest-dom** - DOM 斷言擴展

## 測試覆蓋率目標

目標覆蓋率：
- 服務層：90%+ 
- API 層：85%+
- 組件層：80%+

## 常見問題

### 運行測試时出现 "Cannot find module" 错误

確保已安裝所有依賴：
```bash
npm install
```

### 某些測試失敗

1. 檢查環境變量是否正確設置
2. 確保所有 mock 函數都正確配置
3. 檢查工作目錄

### 如何調試測試

在測試中添加 `console.log()`：
```javascript
it('test name', () => {
  console.log('Debug info');
  expect(...).toBe(...);
});
```

然後使用：
```bash
npm test -- --verbose
```

## Git 提交檢查

建議在提交前運行測試：
```bash
npm test && git commit
```
