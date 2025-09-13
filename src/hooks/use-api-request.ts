import { Method } from '@/types/postman.type';
import { decodeBase64, encodeBase64 } from '@/utils/base64-encoding';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ROUTES } from '@/constants/routes';

export const useApiRequest = () => {
  const [method, setMethod] = useState<Method>('GET');
  const [url, setUrl] = useState('');
  const [body, setBody] = useState('');

  const router = useRouter();
  const params = useParams();

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

    const newPath = `${ROUTES.REST_CLIENT}/${newSegments.join('/')}`;
    router.push(newPath);
  };

  const onSendRequest = (url: string) => {
    const code = encodeBase64(url);

    const newSegments: string[] = [method, code];

    if (currentBody) {
      newSegments.push(currentBody);
    }

    const newPath = `${ROUTES.REST_CLIENT}/${newSegments.join('/')}`;
    router.push(newPath);
  };

  const onSendBody = (body: string) => {
    const encodeBody = encodeBase64(body);

    const newSegments: string[] = [method, currentUrl, encodeBody];

    const newPath = `${ROUTES.REST_CLIENT}/${newSegments.join('/')}`;
    router.push(newPath);
  };

  return { method, url, body, handleMethodChange, onSendRequest, onSendBody };
};
