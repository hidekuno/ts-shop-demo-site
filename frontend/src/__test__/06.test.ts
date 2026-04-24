/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import {getAuthToken, setAuthToken, removeAuthToken, apiFetch} from '../api';

if (!AbortSignal.timeout) {
  AbortSignal.timeout = (ms) => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(new DOMException('TimeoutError')), ms);
    return controller.signal;
  };
}

describe('api token management', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('setAuthToken stores token in localStorage', () => {
    setAuthToken('test-token');
    expect(localStorage.getItem('token')).toBe('test-token');
  });

  test('getAuthToken retrieves stored token', () => {
    localStorage.setItem('token', 'my-token');
    expect(getAuthToken()).toBe('my-token');
  });

  test('getAuthToken returns null when no token exists', () => {
    expect(getAuthToken()).toBeNull();
  });

  test('removeAuthToken deletes token from localStorage', () => {
    localStorage.setItem('token', 'to-be-removed');
    removeAuthToken();
    expect(localStorage.getItem('token')).toBeNull();
  });
});

describe('apiFetch', () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn();
  });

  test('returns parsed JSON on successful response', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({result: 'ok'}),
    });
    const result = await apiFetch('/test');
    expect(result).toEqual({result: 'ok'});
  });

  test('includes Authorization header when token exists', async () => {
    setAuthToken('bearer-token');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    await apiFetch('/test');
    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(options.headers['Authorization']).toBe('Bearer bearer-token');
  });

  test('omits Authorization header when no token', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    await apiFetch('/test');
    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(options.headers['Authorization']).toBeUndefined();
  });

  test('removes token and throws on 401 response', async () => {
    setAuthToken('expired-token');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({detail: 'Unauthorized'}),
    });
    await expect(apiFetch('/test')).rejects.toThrow('Unauthorized');
    expect(getAuthToken()).toBeNull();
  });

  test('throws error message from response body on non-401 failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({detail: 'Internal Server Error'}),
    });
    await expect(apiFetch('/test')).rejects.toThrow('Internal Server Error');
  });

  test('throws fallback message when response body is not JSON', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => { throw new Error('not json'); },
    });
    await expect(apiFetch('/test')).rejects.toThrow('Unknown error');
  });

  test('throws fallback API error when detail field is missing', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({}),
    });
    await expect(apiFetch('/test')).rejects.toThrow('API error: 422');
  });
});
