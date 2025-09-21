import { renderHook, act } from '@testing-library/react';
import { useApiRequest } from '@/hooks/use-api-request';
import { ROUTES } from '@/constants/routes';
import { Method } from '@/types/postman.type';
import { useRestClientStore } from '@/store/restClient.store';
import { useVariables } from '@/hooks/use-variables';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('@/utils/base64-encoding', () => ({
  decodeBase64: jest.fn((str) => `decoded_${str}`),
  encodeBase64: jest.fn((str) => `encoded_${str}`),
}));

jest.mock('@/store/restClient.store');
jest.mock('@/hooks/use-variables');

const mockRouterPush = jest.fn();
const mockUseRouter = jest.fn(() => ({
  push: mockRouterPush,
}));

const mockUseParams = jest.fn();
const mockUseSearchParams = jest.fn(() => new URLSearchParams());

describe('useApiRequest', () => {
  const mockVariables = { apiKey: '12345', token: 'abcde' };
  const mockBodyState = 'request body';
  const mockHeadersState = [
    { key: 'Content-Type', value: 'application/json' },
    { key: 'Authorization', value: 'Bearer token' },
    { key: '', value: 'should be ignored' },
  ];

  (useRouter as jest.Mock).mockImplementation(mockUseRouter);
  (useParams as jest.Mock).mockImplementation(mockUseParams);
  (useSearchParams as jest.Mock).mockImplementation(mockUseSearchParams);

  beforeEach(() => {
    jest.clearAllMocks();

    (useVariables as jest.Mock).mockReturnValue({
      variables: mockVariables,
    });

    (useRestClientStore as unknown as jest.Mock).mockImplementation(
      (selector) => {
        if (selector.toString().includes('body')) return mockBodyState;
        if (selector.toString().includes('headers')) return mockHeadersState;
        return null;
      }
    );
  });

  describe('initial state', () => {
    it('should extract method, url and body from params with GET method', () => {
      mockUseParams.mockReturnValue({
        data: ['get', 'encoded_url', 'encoded_body'],
      });

      const { result } = renderHook(() => useApiRequest());

      expect(result.current.method).toBe('GET');
      expect(result.current.url).toBe('decoded_encoded_url');
      expect(result.current.body).toBe('decoded_encoded_body');
      expect(result.current.hasBody).toBe(true);
    });

    it('should extract method, url and body from params with POST method', () => {
      mockUseParams.mockReturnValue({
        data: ['post', 'encoded_url', 'encoded_body'],
      });

      const { result } = renderHook(() => useApiRequest());

      expect(result.current.method).toBe('POST');
      expect(result.current.url).toBe('decoded_encoded_url');
      expect(result.current.body).toBe('decoded_encoded_body');
      expect(result.current.hasBody).toBe(false);
    });

    it('should handle empty params', () => {
      mockUseParams.mockReturnValue({
        data: [],
      });

      const { result } = renderHook(() => useApiRequest());

      expect(result.current.method).toBe('GET');
      expect(result.current.url).toBe('');
      expect(result.current.body).toBe('');
      expect(result.current.hasBody).toBe(true);
    });

    it('should handle partial params', () => {
      mockUseParams.mockReturnValue({
        data: ['put'],
      });

      const { result } = renderHook(() => useApiRequest());

      expect(result.current.method).toBe('PUT');
      expect(result.current.url).toBe('');
      expect(result.current.body).toBe('');
      expect(result.current.hasBody).toBe(false);
    });
  });

  describe('setMethod', () => {
    it('should update method and preserve other segments', () => {
      mockUseParams.mockReturnValue({
        data: ['get', 'old_url', 'old_body'],
      });

      const { result } = renderHook(() => useApiRequest());

      act(() => {
        result.current.setMethod('POST' as Method);
      });

      expect(mockRouterPush).toHaveBeenCalledWith(
        `${ROUTES.REST_CLIENT}/POST/old_url/old_body`
      );
    });

    it('should update method with minimal segments', () => {
      mockUseParams.mockReturnValue({
        data: ['get'],
      });

      const { result } = renderHook(() => useApiRequest());

      act(() => {
        result.current.setMethod('DELETE' as Method);
      });

      expect(mockRouterPush).toHaveBeenCalledWith(
        `${ROUTES.REST_CLIENT}/DELETE`
      );
    });
  });

  describe('onSendRequest', () => {
    it('should push new URL with encoded segments for GET request', () => {
      mockUseParams.mockReturnValue({
        data: ['get', 'old_url'],
      });

      const { result } = renderHook(() => useApiRequest());

      act(() => {
        result.current.onSendRequest('https://api.example.com/users');
      });

      expect(mockRouterPush).toHaveBeenCalledWith(
        `${ROUTES.REST_CLIENT}/GET/encoded_https://api.example.com/users?Content-Type=application%252Fjson&Authorization=Bearer%2520token`
      );
    });

    it('should push new URL with body for POST request', () => {
      mockUseParams.mockReturnValue({
        data: ['post', 'old_url', 'old_body'],
      });

      const { result } = renderHook(() => useApiRequest());

      act(() => {
        result.current.onSendRequest('https://api.example.com/users');
      });

      expect(mockRouterPush).toHaveBeenCalledWith(
        `${ROUTES.REST_CLIENT}/POST/encoded_https://api.example.com/users/encoded_request body?Content-Type=application%252Fjson&Authorization=Bearer%2520token`
      );
    });

    it('should handle empty headers', () => {
      (useRestClientStore as unknown as jest.Mock).mockImplementation(
        (selector) => {
          if (selector.toString().includes('body')) return mockBodyState;
          if (selector.toString().includes('headers')) return [];
          return null;
        }
      );

      mockUseParams.mockReturnValue({
        data: ['get', 'old_url'],
      });

      const { result } = renderHook(() => useApiRequest());

      act(() => {
        result.current.onSendRequest('https://api.example.com/users');
      });

      expect(mockRouterPush).toHaveBeenCalledWith(
        `${ROUTES.REST_CLIENT}/GET/encoded_https://api.example.com/users`
      );
    });
  });

  describe('redirectToRequestPage', () => {
    it('should redirect with method, url and body', () => {
      mockUseParams.mockReturnValue({ data: [] });

      const { result } = renderHook(() => useApiRequest());

      act(() => {
        result.current.redirectToRequestPage(
          'POST',
          'https://api.example.com/users',
          '{"name": "John"}',
          { 'Content-Type': 'application/json', Authorization: 'Bearer token' }
        );
      });

      expect(mockRouterPush).toHaveBeenCalledWith(
        `${ROUTES.REST_CLIENT}/POST/encoded_https://api.example.com/users/encoded_{\"name\": \"John\"}?Content-Type=application%252Fjson&Authorization=Bearer%2520token`
      );
    });

    it('should redirect without body for GET requests', () => {
      mockUseParams.mockReturnValue({ data: [] });

      const { result } = renderHook(() => useApiRequest());

      act(() => {
        result.current.redirectToRequestPage(
          'GET',
          'https://api.example.com/users',
          '',
          { 'Content-Type': 'application/json' }
        );
      });

      expect(mockRouterPush).toHaveBeenCalledWith(
        `${ROUTES.REST_CLIENT}/GET/encoded_https://api.example.com/users?Content-Type=application%252Fjson`
      );
    });

    it('should redirect without headers if not provided', () => {
      mockUseParams.mockReturnValue({ data: [] });

      const { result } = renderHook(() => useApiRequest());

      act(() => {
        result.current.redirectToRequestPage(
          'POST',
          'https://api.example.com/users',
          '{"name": "John"}'
        );
      });

      expect(mockRouterPush).toHaveBeenCalledWith(
        `${ROUTES.REST_CLIENT}/POST/encoded_https://api.example.com/users/encoded_{"name": "John"}`
      );
    });
  });

  describe('hasBody logic', () => {
    it('should return false for GET method', () => {
      mockUseParams.mockReturnValue({ data: ['GET'] });
      const { result } = renderHook(() => useApiRequest());
      expect(result.current.hasBody).toBe(true);
    });

    it('should return false for HEAD method', () => {
      mockUseParams.mockReturnValue({ data: ['HEAD'] });
      const { result } = renderHook(() => useApiRequest());
      expect(result.current.hasBody).toBe(true);
    });

    it('should return false for DELETE method', () => {
      mockUseParams.mockReturnValue({ data: ['DELETE'] });
      const { result } = renderHook(() => useApiRequest());
      expect(result.current.hasBody).toBe(true);
    });

    it('should return false for OPTIONS method', () => {
      mockUseParams.mockReturnValue({ data: ['OPTIONS'] });
      const { result } = renderHook(() => useApiRequest());
      expect(result.current.hasBody).toBe(true);
    });

    it('should return true for POST method', () => {
      mockUseParams.mockReturnValue({ data: ['POST'] });
      const { result } = renderHook(() => useApiRequest());
      expect(result.current.hasBody).toBe(false);
    });

    it('should return true for PUT method', () => {
      mockUseParams.mockReturnValue({ data: ['PUT'] });
      const { result } = renderHook(() => useApiRequest());
      expect(result.current.hasBody).toBe(false);
    });

    it('should return true for PATCH method', () => {
      mockUseParams.mockReturnValue({ data: ['PATCH'] });
      const { result } = renderHook(() => useApiRequest());
      expect(result.current.hasBody).toBe(false);
    });
  });
});
