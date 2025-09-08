// import { parseJSON } from './helpers';

export const VARIABLES_KEY = 'variables';

export type Variables = Record<string, string>;

export const loadVariables = (): Variables => {
  const raw = localStorage.getItem(VARIABLES_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Variables;
    }
    return {};
  } catch {
    return {};
  }
  // return parseJSON<Variables>(localStorage.getItem(VARIABLES_KEY), {});
  // This is equivalent to the above code but more concise, using the helper function,
  // and ensuring the parsed value is an object.
  // Do you want me to switch to this implementation?
};

export const saveVariables = (vars: Variables) => {
  localStorage.setItem(VARIABLES_KEY, JSON.stringify(vars));
};

export const replaceVariables = (input: string, vars: Variables): string => {
  return input.replace(/{{(.*?)}}/g, (_, varName) => {
    const key = varName.trim();
    return vars[key] ?? '';
  });
};
export const clearVariables = () => {
  localStorage.removeItem(VARIABLES_KEY);
};
