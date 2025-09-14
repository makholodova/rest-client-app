import { LanguageOption, ProgrammingLanguage } from '@/types/postman.type';
import { useEffect, useState } from 'react';
import { useApiRequest } from './use-api-request';
import { useRestClientStore } from '@/store/restClient.store';

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
  const headers = useRestClientStore((state) => state.headers);
  const body = useRestClientStore((state) => state.body);

  const { method, url } = useApiRequest();

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const [language, query] = event.target.value.split('|');

    setLanguage(language as ProgrammingLanguage);
    setQuery(query);
  };

  const createCode = async () => {
    if (!url) {
      return '{enter url}';
    }

    const request = new sdk.Request(url);
    request.method = method;
    // request.url.variables.members = config.variables ?? [];
    request.headers.members = headers ?? [];

    request.body = new sdk.RequestBody({
      mode: 'raw',
      raw: JSON.stringify(body),
      options: {
        raw: {
          language: 'json',
        },
      },
    });

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
  }, [language, query, url, headers, body]);

  return {
    code,
    setCode,
    value: language + '|' + query,
    language,
    supportedLanguages,
    handleLanguageChange,
  };
};
