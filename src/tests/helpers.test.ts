import { parseJSON, bytes, shortDate } from '@/utils/helpers';

describe('parseJSON', () => {
  it('returns fallback if null', () => {
    expect(parseJSON(null, { ok: true })).toEqual({ ok: true });
  });

  it('parses valid JSON', () => {
    expect(parseJSON('{"a":1}', {})).toEqual({ a: 1 });
  });

  it('returns a fallback if the JSON is invalid', () => {
    expect(parseJSON('{oops}', { fail: true })).toEqual({ fail: true });
  });
});

describe('bytes', () => {
  it.each([
    [0, '0 B'],
    [512, '512 B'],
    [1024, '1.0 KB'],
    [1048576, '1.00 MB'],
  ])('formats %d => %s', (n, out) => {
    expect(bytes(n)).toBe(out);
  });
});

describe('shortDate', () => {
  it('returns a string with date and time', () => {
    const iso = '2025-09-20T12:34:56.000Z';
    const result = shortDate(iso);

    expect(result).toContain('2025');
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });
});
