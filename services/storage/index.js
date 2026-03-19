import { saveToNocoDB, queryNocoDB } from './nocodb';

export async function saveRecord(data) {
  return saveToNocoDB(data);
}

export async function storeResult(inputData, analysisResult) {
  try {
    const record = {
      input: JSON.stringify(inputData),
      analysis: analysisResult.analysis,
      timestamp: analysisResult.timestamp,
    };

    const result = await saveRecord(record);
    return result;
  } catch (error) {
    throw new Error(`儲存結果失敗: ${error.message}`);
  }
}

export async function getResult(recordId) {
  try {
    const result = await queryNocoDB(recordId);
    return result;
  } catch (error) {
    throw new Error(`獲取結果失敗: ${error.message}`);
  }
}

export { saveToNocoDB, queryNocoDB };
