import { ROUTES } from '@/constants/routes';
import { Method } from '@/types/postman.type';
import { decodeBase64, encodeBase64 } from '@/utils/base64-encoding';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useRestClientStore } from '@/store/restClient.store';
import { useVariables } from './use-variables';

export const useApiRequest = () => {
  const { variables } = useVariables();

  const bodyState = useRestClientStore((state) => state.body);
  const headersState = useRestClientStore((state) => state.headers);

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const urlSegments = params?.data || [];
  const method = (urlSegments[0]?.toUpperCase() as Method) || 'GET';
  const url = urlSegments[1] ? decodeBase64(urlSegments[1]) : '';
  const body = urlSegments[2] ? decodeBase64(urlSegments[2]) : '';

  const hasBody =
    method === 'GET' ||
    method === 'HEAD' ||
    method === 'DELETE' ||
    method === 'OPTIONS';

  const replaceVariablesInUrl = (url: string): string => {
    return url.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] || match;
    });
  };

  const push = (newSegments: string[], currentParams: URLSearchParams) => {
    const queryString = currentParams.toString();
    const basePath = `${ROUTES.REST_CLIENT}/${newSegments.join('/')}`;
    const newPath = queryString ? `${basePath}?${queryString}` : basePath;

    router.push(newPath);
  };

  const setMethod = (newMethod: Method) => {
    const newSegments: string[] = [newMethod];

    if (urlSegments.length > 1) {
      newSegments.push(...urlSegments.slice(1));
    }

    const currentParams = new URLSearchParams(searchParams.toString());

    push(newSegments, currentParams);
  };

  const onSendRequest = (newUrl: string) => {
    const encodedUrl = encodeBase64(replaceVariablesInUrl(newUrl));
    const newSegments: string[] = [method, encodedUrl];

    if (!hasBody) {
      newSegments.push(encodeBase64(bodyState));
    }

    const searchParams = new URLSearchParams();

    headersState.forEach((header) => {
      if (header.key && header.value) {
        const encodedKey = encodeURIComponent(header.key);
        const encodedValue = encodeURIComponent(header.value);
        searchParams.set(encodedKey, encodedValue);
      }
    });

    push(newSegments, searchParams);
  };

  const redirectToRequestPage = (
    method: string,
    url: string,
    body: string,
    headers?: Record<string, string>
  ) => {
    const encodedUrl = encodeBase64(replaceVariablesInUrl(url));
    const newSegments: string[] = [method, encodedUrl];

    const searchParams = new URLSearchParams();

    if (body) {
      newSegments.push(encodeBase64(body));
    }

    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        const encodedKey = encodeURIComponent(key);
        const encodedValue = encodeURIComponent(value);
        searchParams.set(encodedKey, encodedValue);
      });
    }

    push(newSegments, searchParams);
  };

  return {
    method,
    hasBody,
    url,
    body,
    setMethod,
    onSendRequest,
    redirectToRequestPage,
  };
};
