import { decodeBase64 } from '@/utils/base64-encoding';

type FetchResult = {
  content: string;
  status: number;
  responseHeaders: Headers;
};

const createRequestConfig = (
  method: string,
  bodyData: string | null,
  headers: { [key: string]: string } | null
): RequestInit => {
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      if (key && value) {
        requestHeaders[key] = value;
      }
    });
  }

  const config: RequestInit = {
    method: method,
    headers: requestHeaders,
  };

  if (bodyData && method !== 'GET' && method !== 'HEAD') {
    config.body = JSON.stringify(bodyData);
  }

  return config;
};

export const fetchApi = async (
  data: string[],
  headers: { [key: string]: string } | null
): Promise<FetchResult> => {
  try {
    const method = data?.[0] || 'GET';
    const encodedUrl = data?.[1] as string;
    const encodeBody = data?.[2] as string;

    if (!encodedUrl) {
      return { content: ' ', status: 200, responseHeaders: new Headers() };
    }

    const url = decodeBase64(encodedUrl);
    const body = encodeBody ? decodeBase64(encodeBody) : null;

    const config = createRequestConfig(method, body, headers);
    const response = await fetch(url, config);

    if (!response.ok) {
      return {
        content: '{error}',
        status: response.status,
        responseHeaders: response.headers,
      };
    }

    const content = await response.text();
    return {
      content,
      status: response.status,
      responseHeaders: response.headers,
    };
  } catch {
    return { content: '{error}', status: 500, responseHeaders: new Headers() };
  }
};
