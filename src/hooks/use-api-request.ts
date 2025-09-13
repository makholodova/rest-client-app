import { Method } from '@/types/postman.type';
import {
  clientDecodeBase64,
  clientEncodeBase64,
} from '@/utils/base64-encoding';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ROUTES } from '@/constants/routes';

export const useApiRequest = () => {
  const [method, setMethod] = useState<Method>('GET');
  const [url, setUrl] = useState('');
  const router = useRouter();
  const params = useParams();

  const urlSegments = params?.data || [];
  const currentMethodFromUrl =
    (urlSegments[0]?.toUpperCase() as Method) || 'GET';
  const currentUrl = urlSegments[1];

  useEffect(() => {
    setMethod(currentMethodFromUrl);
  }, [currentMethodFromUrl]);

  useEffect(() => {
    setUrl(currentUrl ? clientDecodeBase64(currentUrl) : '');
  }, [currentUrl]);

  const handleMethodChange = (newMethod: Method) => {
    setMethod(newMethod);

    const newSegments: string[] = [newMethod];

    if (urlSegments.length > 1) {
      newSegments.push(...urlSegments.slice(1));
    }

    const newPath = `${ROUTES.REST_CLIENT}/${newSegments.join('/')}`;
    router.push(newPath);
  };

  const onSendRequest = (url: string) => {
    const code = clientEncodeBase64(url);

    const newSegments: string[] = [method];

    newSegments.push(code);

    const newPath = `${ROUTES.REST_CLIENT}/${newSegments.join('/')}`;
    router.push(newPath);
  };

  return { method, url, handleMethodChange, onSendRequest };
};
