import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import History from '../pages/history';

describe('History Page', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    localStorage.clear();
  });

  test('renders history page with title', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ records: [], success: true })
    });

    render(<History />);
    await waitFor(() => {
      expect(screen.getByText('分析記錄')).toBeInTheDocument();
    });
  });

  test('displays filter buttons for completeness classification', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ records: [], success: true })
    });

    render(<History />);
    
    await waitFor(() => {
      expect(screen.getByText(/所有記錄/)).toBeInTheDocument();
      expect(screen.getByText(/完整/)).toBeInTheDocument();
      expect(screen.getByText(/未完整/)).toBeInTheDocument();
    });
  });

  test('fetches and displays records from API', async () => {
    const mockRecords = [
      {
        id: 1,
        chat_text: '我想要買一個產品',
        completeness: '完整',
        images_count: 0,
        created_at: '2024-01-01T10:00:00Z',
        analysis: { category: 'inquiry' }
      }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ records: mockRecords, success: true })
    });

    render(<History />);

    await waitFor(() => {
      expect(screen.getByText('我想要買一個產品')).toBeInTheDocument();
    });
  });

  test('uses localStorage fallback when API fails', async () => {
    const cachedRecords = [
      {
        chat_text: '快取的訊息',
        completeness: '完整',
        images_count: 0,
        created_at: '2024-01-01T10:00:00Z'
      }
    ];

    localStorage.setItem('analysis_records', JSON.stringify(cachedRecords));
    global.fetch.mockRejectedValueOnce(new Error('API Error'));

    render(<History />);

    await waitFor(() => {
      expect(screen.getByText('快取的訊息')).toBeInTheDocument();
    });
  });

  test('navigation link to create new analysis', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ records: [], success: true })
    });

    render(<History />);
    
    await waitFor(() => {
      const newAnalysisLink = screen.getByText('新增分析');
      expect(newAnalysisLink.closest('a')).toHaveAttribute('href');
    });
  });
});
