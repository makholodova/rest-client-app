export const serverEncodeBase64 = (str: string): string =>
  Buffer.from(str).toString('base64');

export const serverDecodeBase64 = (str: string): string =>
  Buffer.from(str, 'base64').toString('utf-8');

export const clientEncodeBase64 = (str: string): string =>
  btoa(unescape(encodeURIComponent(str)));

export const clientDecodeBase64 = (str: string): string =>
  decodeURIComponent(escape(atob(str)));
