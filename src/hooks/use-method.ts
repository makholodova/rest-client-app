import { Method } from '@/types/postman.type';
import { encodeBase64 } from '@/utils/base64-encoding';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useMethod = () => {
  const [method, setMethod] = useState<Method>('GET');
  const router = useRouter();
  const params = useParams();

  const urlSegments = params?.data || [];
  const currentMethodFromUrl =
    (urlSegments[0]?.toUpperCase() as Method) || 'GET';

  useEffect(() => {
    setMethod(currentMethodFromUrl);
  }, [currentMethodFromUrl]);

  const handleMethodChange = (newMethod: Method) => {
    setMethod(newMethod);

    const newSegments: string[] = [newMethod];

    if (urlSegments.length > 1) {
      newSegments.push(...urlSegments.slice(1));
    }

    const newPath = `/rest-client/${newSegments.join('/')}`;
    router.push(newPath);
  };

  const onSendRequest = (url: string) => {
    const code = encodeBase64(url);

    const newSegments: string[] = [method];

    newSegments.push(code);

    const newPath = `/rest-client/${newSegments.join('/')}`;
    router.push(newPath);
  };

  return { method, handleMethodChange, onSendRequest };
};
