import {
  clearVariables,
  loadVariables,
  replaceVariables,
  saveVariables,
  VARIABLES_KEY,
} from '@/utils/variables';

beforeEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
});

describe('variables utils', () => {
  it('loadVariables returns {} if there is nothing', () => {
    expect(loadVariables()).toEqual({});
  });

  it('saveVariables saves and loadVariables reads', () => {
    const vars = { token: '123', url: 'https://api.test' };
    saveVariables(vars);

    const raw = localStorage.getItem(VARIABLES_KEY);
    expect(raw).toBe(JSON.stringify(vars));
    expect(loadVariables()).toEqual(vars);
  });

  it('replaceVariables substitutes values and leaves an empty string for unknown ones', () => {
    const vars = { name: 'Marina', city: 'Moscow' };

    const result = replaceVariables(
      'Hello {{ name }}, welcome to {{ city }} and {{ unknown }}!',
      vars
    );

    expect(result).toBe('Hello Marina, welcome to Moscow and !');
  });

  it('clearVariables clears localStorage', () => {
    saveVariables({ test: 'ok' });
    expect(localStorage.getItem(VARIABLES_KEY)).not.toBeNull();

    clearVariables();
    expect(localStorage.getItem(VARIABLES_KEY)).toBeNull();
  });
});
