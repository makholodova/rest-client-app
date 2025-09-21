import { Method } from '@/types/postman.type';
import { decodeBase64 } from '@/utils/base64-encoding';
import { headers } from 'next/headers';
import { cookies } from 'next/headers';

type FetchResult = {
  content: string;
  status: number;
  responseHeaders: Headers;
};

export const createRequestConfig = (
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

  if (bodyData 
    && !(method === 'GET' 
    || method === 'HEAD' 
    || method === 'DELETE' 
    || method === 'OPTIONS')) {
    config.body = JSON.parse(bodyData);
  }

  return config;
};

export const saveRequestToHistory = async (
  method: Method,
  url: string,
  reqHeaders: { [key: string]: string } | null,
  status: number,
  ok: boolean,
  startedAt: number,
  result: string,
  body?: string
) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('AUTH-TOKEN')?.value;

  const endedAt = Date.now();
  const latency = endedAt - startedAt;

  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  await fetch(`${baseUrl}/api/history/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? token : '',
    },
    body: JSON.stringify({
      method,
      url,
      reqHeaders,
      body,
      status,
      latency_ms: latency,
      req_size_bytes: body ? new TextEncoder().encode(body).length : 0,
      res_size_bytes: new TextEncoder().encode(result).length,
      error: ok ? null : { type: 'http', message: String(status) },
      timestamp: new Date().toISOString(),
    }),
  });
};

export const fetchApi = async (
  data: string[],
  headers: { [key: string]: string } | null
): Promise<FetchResult> => {
  const startedAt = Date.now();

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
    const content = await response.text();

    await saveRequestToHistory(
      method as Method,
      url,
      headers,
      response.status,
      response.ok,
      startedAt,
      content,
      JSON.stringify(body) ?? undefined
    );

    if (!response.ok) {
      return {
        content: response.statusText,
        status: response.status,
        responseHeaders: response.headers,
      };
    }

    return {
      content,
      status: response.status,
      responseHeaders: response.headers,
    };
  } catch {

    const errorContent = data?.[2] ? JSON.stringify(decodeBase64(data[2])) : '';

    await saveRequestToHistory(
      (data?.[0] as Method) || 'GET',
      data?.[1] ? decodeBase64(data[1]) : 'unknown',
      headers,
      500,
      false,
      startedAt,
      '',
      errorContent
    );

    return { content: '{error}', status: 500, responseHeaders: new Headers() };
  }
};
