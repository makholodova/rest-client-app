import {
  LanguageOption,
  Method,
  ProgrammingLanguage,
} from '@/types/postman.type';
import { decodeBase64 } from '@/utils/base64-encoding';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const codegen = require('postman-code-generators');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const sdk = require('postman-collection');
const options = {
  indentCount: 3,
  indentType: 'Space',
  trimRequestBody: true,
  followRedirect: true,
};

export const useCodeGenerator = () => {
  const [query, setQuery] = useState('fetch');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');

  const supportedLanguages: LanguageOption[] = codegen.getLanguageList();

  const { data } = useParams();

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const [language, query] = event.target.value.split('|');
    console.log(language);
    console.log(query);

    setLanguage(language as ProgrammingLanguage);
    setQuery(query);
  };

  const createCode = async () => {
    if (!Array.isArray(data) || data.length < 2) {
      return '{enter url}';
    }

    const request = new sdk.Request(decodeBase64(data[1] as string));
    request.method = data[0] as Method;
    // request.url.variables.members = config.variables ?? [];
    // request.headers.members = config.headers ?? [];

    return await new Promise<string>((resolve, reject) => {
      codegen.convert(
        language,
        query ?? 'fetch',
        request,
        options,
        (error: Error, snippet: string) => {
          if (error) {
            reject(error);
          } else if (snippet) {
            resolve(snippet);
          } else {
            reject(new Error('Failed to generate code'));
          }
        }
      );
    });
  };

  useEffect(() => {
    (async () => {
      setCode(await createCode());
    })();
  }, [language, query, data]);

  return {
    code,
    setCode,
    value: language + '|' + query,
    language,
    supportedLanguages,
    handleLanguageChange,
  };
};
