import {
  fetchApi,
  createRequestConfig,
  saveRequestToHistory,
} from '@/utils/rest-client-api';
import { decodeBase64 } from '@/utils/base64-encoding';
import { Method } from '@/types/postman.type';
import { cookies, headers } from 'next/headers';

jest.mock('@/utils/base64-encoding');
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
  headers: jest.fn(),
}));

global.fetch = jest.fn() as jest.Mock;
global.TextEncoder = jest.fn().mockImplementation(() => ({
  encode: jest.fn().mockImplementation((str) => {
    return {
      length: str ? str.length : 0,
    };
  }),
})) as unknown as typeof TextEncoder;

jest.mock('@/utils/rest-client-api', () => {
  const originalModule = jest.requireActual('@/utils/rest-client-api');
  return {
    ...originalModule,
    saveRequestToHistory: jest.fn(),
  };
});

describe('createRequestConfig', () => {
  it('should create config for GET request without body', () => {
    const config = createRequestConfig('GET', null, null);

    expect(config).toEqual({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should create config for POST request with body', () => {
    const bodyData = '{"name": "test"}';
    const config = createRequestConfig('POST', bodyData, null);

    expect(config).toEqual({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.parse(bodyData),
    });
  });

  it('should create config with custom headers', () => {
    const customHeaders = {
      Authorization: 'Bearer token',
      'X-Custom-Header': 'value',
    };

    const config = createRequestConfig('GET', null, customHeaders);

    expect(config).toEqual({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token',
        'X-Custom-Header': 'value',
      },
    });
  });

  it('should not include body for HEAD request', () => {
    const bodyData = '{"name": "test"}';
    const config = createRequestConfig('HEAD', bodyData, null);

    expect(config).toEqual({
      method: 'HEAD',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(config.body).toBeUndefined();
  });

  it('should filter out empty header values', () => {
    const customHeaders = {
      Authorization: 'Bearer token',
      'Empty-Header': '',
      'X-Custom-Header': 'value',
    };

    const config = createRequestConfig('GET', null, customHeaders);

    expect(config.headers).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer token',
      'X-Custom-Header': 'value',
    });
    expect(config.headers).not.toHaveProperty('Empty-Header');
  });
});

describe('fetchApi', () => {
  const mockDecodeBase64 = decodeBase64 as jest.Mock;
  const mockCookies = cookies as jest.Mock;
  const mockHeaders = headers as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockDecodeBase64.mockImplementation((str: string) => `decoded_${str}`);

    mockCookies.mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: 'auth-token' }),
    });

    mockHeaders.mockResolvedValue({
      get: jest.fn().mockReturnValue('localhost:3000'),
    });

    (saveRequestToHistory as jest.Mock).mockResolvedValue(undefined);
  });

  it('should return empty content for missing URL', async () => {
    const result = await fetchApi([], null);

    expect(result).toEqual({
      content: ' ',
      status: 200,
      responseHeaders: expect.any(Headers),
    });
  });

  it('should handle request with body for POST method', async () => {
    const mockResponse = {
      status: 200,
      ok: true,
      headers: new Headers(),
      text: jest.fn().mockResolvedValue('success'),
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    mockDecodeBase64
      .mockImplementationOnce((_: string) => 'https://api.example.com')
      .mockImplementationOnce((_: string) => '{"name": "test"}');

    await fetchApi(['POST', 'encoded_url', 'encoded_body'], null);

    expect(global.fetch).toHaveBeenCalledWith('https://api.example.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: { name: 'test' },
    });
  });
});

describe('saveRequestToHistory', () => {
  const originalSaveRequestToHistory = jest.requireActual(
    '@/utils/rest-client-api'
  ).saveRequestToHistory;
  const mockCookies = cookies as jest.Mock;
  const mockHeaders = headers as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    global.fetch = jest.fn() as jest.Mock;

    mockCookies.mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: 'auth-token' }),
    });

    mockHeaders.mockResolvedValue({
      get: jest.fn().mockReturnValue('localhost:3000'),
    });
  });

  it('should save request to history with auth token', async () => {
    const mockFetch = global.fetch as jest.Mock;
    mockFetch.mockResolvedValue({ ok: true });

    await originalSaveRequestToHistory(
      'POST' as Method,
      'https://api.example.com',
      { 'Content-Type': 'application/json' },
      200,
      true,
      Date.now() - 100,
      'response content',
      'request body'
    );

    expect(mockFetch).toHaveBeenCalledWith(
      'https://localhost:3000/api/history/save',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'auth-token',
        },
        body: expect.any(String),
      }
    );

    const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(requestBody).toEqual({
      method: 'POST',
      url: 'https://api.example.com',
      reqHeaders: { 'Content-Type': 'application/json' },
      body: 'request body',
      status: 200,
      latency_ms: expect.any(Number),
      req_size_bytes: expect.any(Number),
      res_size_bytes: expect.any(Number),
      error: null,
      timestamp: expect.any(String),
    });
  });

  it('should save request to history without auth token', async () => {
    mockCookies.mockResolvedValue({
      get: jest.fn().mockReturnValue(undefined),
    });

    const mockFetch = global.fetch as jest.Mock;
    mockFetch.mockResolvedValue({ ok: true });

    await originalSaveRequestToHistory(
      'GET' as Method,
      'https://api.example.com',
      null,
      404,
      false,
      Date.now() - 100,
      'error response',
      undefined
    );

    expect(mockFetch).toHaveBeenCalledWith(
      'https://localhost:3000/api/history/save',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: '',
        },
        body: expect.any(String),
      }
    );
  });
});
