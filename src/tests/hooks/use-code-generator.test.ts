import { renderHook, act } from '@testing-library/react';
import { useCodeGenerator } from '@/hooks/use-code-generator';
import { useApiRequest } from '@/hooks/use-api-request';
import { useRestClientStore } from '@/store/restClient.store';

jest.mock('@/hooks/use-api-request');
jest.mock('@/store/restClient.store');

jest.mock('postman-code-generators', () => ({
  getLanguageList: jest.fn(() => [
    { name: 'JavaScript', lang: 'javascript', variant: 'fetch' },
    { name: 'Python', lang: 'python', variant: 'requests' },
    { name: 'cURL', lang: 'curl', variant: 'curl' },
  ]),
  convert: jest.fn((language, variant, request, options, callback) => {
    callback(null, `${language}-${variant}-snippet`);
  }),
}));

jest.mock('postman-collection', () => ({
  Request: jest.fn().mockImplementation((url) => ({
    url,
    method: '',
    headers: {
      members: [],
    },
    body: null,
  })),
  RequestBody: jest.fn().mockImplementation((options) => options),
}));

describe('useCodeGenerator', () => {
  const mockHeaders = [
    { key: 'Content-Type', value: 'application/json' },
    { key: 'Authorization', value: 'Bearer token' },
  ];

  const mockBody = '{"name": "test"}';
  const mockMethod = 'POST';
  const mockUrl = 'https://api.example.com/users';

  beforeEach(() => {
    jest.clearAllMocks();

    (useApiRequest as jest.Mock).mockReturnValue({
      method: mockMethod,
      url: mockUrl,
    });

    (useRestClientStore as unknown as jest.Mock).mockImplementation(
      (selector) => {
        if (selector.toString().includes('headers')) return mockHeaders;
        if (selector.toString().includes('body')) return mockBody;
        return null;
      }
    );
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCodeGenerator());

    expect(result.current.language).toBe('javascript');
    expect(result.current.value).toBe('javascript|fetch');
    expect(result.current.code).toBe('');
    expect(result.current.supportedLanguages).toHaveLength(3);
  });

  it('should handle language change', () => {
    const { result } = renderHook(() => useCodeGenerator());

    act(() => {
      const mockEvent = {
        target: { value: 'python|requests' },
      } as React.ChangeEvent<HTMLSelectElement>;
      result.current.handleLanguageChange(mockEvent);
    });

    expect(result.current.language).toBe('python');
    expect(result.current.value).toBe('python|requests');
  });

  it('should generate code when dependencies change', async () => {
    const { result } = renderHook(() => useCodeGenerator());

    await expect(() => {
      return new Promise<void>((resolve) => {
        const checkCode = () => {
          if (result.current.code !== '') {
            resolve();
          } else {
            setTimeout(checkCode, 10);
          }
        };
        checkCode();
      });
    }).resolves.toBeUndefined();

    expect(result.current.code).toBe('javascript-fetch-snippet');
  });

  it('should handle empty URL by returning empty code', async () => {
    (useApiRequest as jest.Mock).mockReturnValueOnce({
      method: mockMethod,
      url: '',
    });

    const { result } = renderHook(() => useCodeGenerator());

    expect(result.current.code).toBe('');
  });

  it('should create proper Request object', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Request, RequestBody } = require('postman-collection');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { convert } = require('postman-code-generators');

    renderHook(() => useCodeGenerator());

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(Request).toHaveBeenCalledWith(mockUrl);

    expect(RequestBody).toHaveBeenCalledWith({
      mode: 'raw',
      raw: JSON.stringify(JSON.parse(mockBody)),
      options: {
        raw: {
          language: 'json',
        },
      },
    });

    expect(convert).toHaveBeenCalledWith(
      'javascript',
      'fetch',
      expect.any(Object),
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('should update code when language changes', async () => {
    const { result } = renderHook(() => useCodeGenerator());

    await new Promise((resolve) => setTimeout(resolve, 100));

    act(() => {
      const mockEvent = {
        target: { value: 'curl|curl' },
      } as React.ChangeEvent<HTMLSelectElement>;
      result.current.handleLanguageChange(mockEvent);
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(result.current.code).toBe('curl-curl-snippet');
  });

  it('should handle JSON parsing error in body', async () => {
    (useRestClientStore as unknown as jest.Mock).mockImplementationOnce(
      (selector) => {
        if (selector.toString().includes('headers')) return mockHeaders;
        if (selector.toString().includes('body')) return 'invalid-json';
        return null;
      }
    );

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { RequestBody } = require('postman-collection');
    renderHook(() => useCodeGenerator());

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(RequestBody).toHaveBeenCalledWith({
      mode: 'raw',
      raw: JSON.stringify({ name: 'test' }),
      options: {
        raw: {
          language: 'json',
        },
      },
    });
  });

  it('should support manual code setting', () => {
    const { result } = renderHook(() => useCodeGenerator());

    act(() => {
      result.current.setCode('custom code');
    });

    expect(result.current.code).toBe('custom code');
  });

  it('should provide supported languages list', () => {
    const { result } = renderHook(() => useCodeGenerator());

    expect(result.current.supportedLanguages).toEqual([
      { name: 'JavaScript', lang: 'javascript', variant: 'fetch' },
      { name: 'Python', lang: 'python', variant: 'requests' },
      { name: 'cURL', lang: 'curl', variant: 'curl' },
    ]);
  });
});
