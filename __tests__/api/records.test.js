import { createMocks } from 'node-mocks-http';
import handler from '../../../pages/api/records';

describe('/api/records', () => {
  beforeEach(() => {
    process.env.NOCODB_URL = 'https://app.nocodb.com/api/v2/tables/test/records';
    process.env.NOCODB_TOKEN = 'test-token';
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns 405 for non-GET requests', async () => {
    const { req, res } = createMocks({
      method: 'POST'
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(405);
  });

  test('returns error when environment variables are missing', async () => {
    delete process.env.NOCODB_URL;
    
    const { req, res } = createMocks({
      method: 'GET'
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toHaveProperty('error');
  });

  test('fetches records successfully', async () => {
    const mockRecords = {
      list: [
        {
          id: 1,
          chat_text: 'Test message',
          completeness: '完整',
          images_count: 0,
          created_at: '2024-01-01T10:00:00Z'
        }
      ],
      pageInfo: { page: 1, pageSize: 25 }
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRecords
    });

    const { req, res } = createMocks({
      method: 'GET'
    });

    await handler(req, res);
    
    expect(res._getStatusCode()).toBe(200);
    const response = JSON.parse(res._getData());
    expect(response.success).toBe(true);
    expect(response.records).toHaveLength(1);
    expect(response.records[0].chat_text).toBe('Test message');
  });

  test('filters records by completeness parameter', async () => {
    const mockRecords = {
      list: [
        {
          id: 1,
          chat_text: 'Complete message',
          completeness: '完整',
          images_count: 0,
          created_at: '2024-01-01T10:00:00Z'
        }
      ]
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRecords
    });

    const { req, res } = createMocks({
      method: 'GET',
      query: { completeness: '完整' }
    });

    await handler(req, res);
    
    const response = JSON.parse(res._getData());
    expect(response.records[0].completeness).toBe('完整');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('completeness'),
      expect.any(Object)
    );
  });

  test('handles API errors gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('API Error'));

    const { req, res } = createMocks({
      method: 'GET'
    });

    await handler(req, res);
    
    expect(res._getStatusCode()).toBe(500);
    const response = JSON.parse(res._getData());
    expect(response.success).toBe(false);
    expect(response.records).toEqual([]);
  });

  test('sends correct headers to NocoDB API', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ list: [] })
    });

    const { req, res } = createMocks({
      method: 'GET'
    });

    await handler(req, res);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'xc-auth': 'test-token',
          'Content-Type': 'application/json'
        })
      })
    );
  });

  test('handles NocoDB 404 error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    const { req, res } = createMocks({
      method: 'GET'
    });

    await handler(req, res);
    
    expect(res._getStatusCode()).toBe(500);
    const response = JSON.parse(res._getData());
    expect(response.success).toBe(false);
  });

  test('returns empty array when no completeness filter matches', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ list: [] })
    });

    const { req, res } = createMocks({
      method: 'GET',
      query: { completeness: 'invalid' }
    });

    await handler(req, res);
    
    const response = JSON.parse(res._getData());
    expect(response.records).toEqual([]);
    expect(response.total).toBe(0);
  });
});
