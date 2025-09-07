import { ConfigRequest, LanguageOption } from '@/types/postman.type';
import type { NextRequest } from 'next/server';

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

export async function POST(configRequest: NextRequest) {
  try {
    const config: ConfigRequest = await configRequest.json();

    const request = new sdk.Request(config.url);
    request.method = config.method;

    const supportedCodegens: LanguageOption[] = codegen.getLanguageList();
    const zap = supportedCodegens.find((item) => item.key === config.language);

    const snippet = await new Promise<string>((resolve, reject) => {
      codegen.convert(
        config.language,
        zap?.variants[0].key ?? 'fetch',
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

    return Response.json({
      success: true,
      code: snippet,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
