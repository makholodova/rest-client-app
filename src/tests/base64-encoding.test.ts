import { encodeBase64, decodeBase64 } from '@/utils/base64-encoding';

describe('encodeBase64 / decodeBase64', () => {
  it('encodes and decodes an ASCII string', () => {
    const src = 'hello world';
    const encoded = encodeBase64(src);
    expect(encoded).toBe('aGVsbG8gd29ybGQ');
    expect(decodeBase64(encoded)).toBe(src);
  });

  it('handles empty strings correctly', () => {
    expect(encodeBase64('')).toBe('');
    expect(decodeBase64('')).toBe('');
  });

  it('decode correctly adds padding', () => {
    const encoded = 'YQ';
    expect(decodeBase64(encoded)).toBe('a');
  });
});
