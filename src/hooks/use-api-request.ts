import { Method } from '@/types/postman.type';
import { decodeBase64, encodeBase64 } from '@/utils/base64-encoding';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ROUTES } from '@/constants/routes';
import { useRestClientStore } from '@/store/restClient.store';

export const useApiRequest = () => {
  const [method, setMethod] = useState<Method>('GET');
  const [url, setUrl] = useState('');
  const [body, setBody] = useState('');

  const bodyState = useRestClientStore((state) => state.body);
  const headersState = useRestClientStore((state) => state.headers);

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const urlSegments = params?.data || [];
  const currentMethodFromUrl =
    (urlSegments[0]?.toUpperCase() as Method) || 'GET';
  const currentUrl = urlSegments[1];
  const currentBody = urlSegments[2];

  useEffect(() => {
    setMethod(currentMethodFromUrl);
  }, [currentMethodFromUrl]);

  useEffect(() => {
    setUrl(currentUrl ? decodeBase64(currentUrl) : '');
  }, [currentUrl]);

  useEffect(() => {
    setBody(currentBody ? decodeBase64(currentBody) : '');
  }, [currentBody]);

  const handleMethodChange = (newMethod: Method) => {
    setMethod(newMethod);

    const newSegments: string[] = [newMethod];

    if (urlSegments.length > 1) {
      newSegments.push(...urlSegments.slice(1));
    }

    const currentParams = new URLSearchParams(searchParams.toString());
    const queryString = currentParams.toString();
    const basePath = `${ROUTES.REST_CLIENT}/${newSegments.join('/')}`;
    const newPath = queryString ? `${basePath}?${queryString}` : basePath;

    router.push(newPath);
  };

  const onSendRequest = (url: string) => {
    const code = encodeBase64(url);
    const codeBudy = encodeBase64(bodyState);

    const newSegments: string[] = [method, code, codeBudy];

    const params = new URLSearchParams();

    headersState.forEach((header) => {
      if (header.key && header.value) {
        const encodedKey = encodeURIComponent(header.key);
        const encodedValue = encodeURIComponent(header.value);
        params.set(encodedKey, encodedValue);
      }
    });

    const queryString = params.toString();
    const basePath = `${ROUTES.REST_CLIENT}/${newSegments.join('/')}`;
    const newPath = queryString ? `${basePath}?${queryString}` : basePath;

    router.push(newPath);
  };

  return { method, url, body, handleMethodChange, onSendRequest };
};
