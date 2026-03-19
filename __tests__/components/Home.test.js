import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '@/pages/index';

describe('Home Page', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('應該渲染表單和標題', () => {
    render(<Home />);

    expect(screen.getByText('AI聊天分析系統')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('名稱')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('貼聊天內容')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /分析/i })).toBeInTheDocument();
  });

  it('應該在提交表單時發送正確的請求', async () => {
    const mockResponse = { personality: 'friendly' };
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    render(<Home />);

    const nameInput = screen.getByPlaceholderText('名稱');
    const chatInput = screen.getByPlaceholderText('貼聊天內容');
    const submitButton = screen.getByRole('button', { name: /分析/i });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(chatInput, { target: { value: 'Hello World' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/analyze',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            name: 'Test User',
            chat_text: 'Hello World'
          })
        })
      );
    });
  });

  it('應該在分析後顯示結果', async () => {
    const mockResponse = {
      personality: 'outgoing',
      communication_style: 'friendly'
    };

    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    render(<Home />);

    const nameInput = screen.getByPlaceholderText('名稱');
    const chatInput = screen.getByPlaceholderText('貼聊天內容');
    const submitButton = screen.getByRole('button', { name: /分析/i });

    fireEvent.change(nameInput, { target: { value: 'Test' } });
    fireEvent.change(chatInput, { target: { value: 'Hello' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/分析結果/i)).toBeInTheDocument();
      expect(screen.getByText(/outgoing/i)).toBeInTheDocument();
    });
  });

  it('應該正確顯示加載狀態', async () => {
    global.fetch.mockImplementationOnce(
      () => new Promise(() => {}) // Never resolves
    );

    render(<Home />);

    const nameInput = screen.getByPlaceholderText('名稱');
    const chatInput = screen.getByPlaceholderText('貼聊天內容');
    const submitButton = screen.getByRole('button', { name: /分析/i });

    fireEvent.change(nameInput, { target: { value: 'Test' } });
    fireEvent.change(chatInput, { target: { value: 'Hello' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /分析中.../i })).toBeDisabled();
    });
  });

  it('應該正確處理錯誤', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    window.alert = jest.fn();

    render(<Home />);

    const nameInput = screen.getByPlaceholderText('名稱');
    const chatInput = screen.getByPlaceholderText('貼聊天內容');
    const submitButton = screen.getByRole('button', { name: /分析/i });

    fireEvent.change(nameInput, { target: { value: 'Test' } });
    fireEvent.change(chatInput, { target: { value: 'Hello' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining('Network error')
      );
    });
  });

  it('應該在提交後重置表單', async () => {
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ personality: 'test' }),
    });

    render(<Home />);

    const nameInput = screen.getByPlaceholderText('名稱');
    const chatInput = screen.getByPlaceholderText('貼聊天內容');
    const submitButton = screen.getByRole('button', { name: /分析/i });

    fireEvent.change(nameInput, { target: { value: 'Test' } });
    fireEvent.change(chatInput, { target: { value: 'Hello' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(nameInput.value).toBe('');
      expect(chatInput.value).toBe('');
    });
  });
});
