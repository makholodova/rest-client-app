export const encodeBase64Url = (str: string): string =>
  Buffer.from(str, 'utf-8').toString('base64').replace(/=+$/, '');

export const decodeBase64Url = (str: string): string => {
  const pad = str.length % 4 === 0 ? '' : '===='.slice(str.length % 4);
  return Buffer.from(str + pad, 'base64').toString('utf-8');
};
