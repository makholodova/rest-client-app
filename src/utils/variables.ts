import { parseJSON } from './helpers';

export const VARIABLES_KEY = 'variables';

export type Variables = Record<string, string>;

export const loadVariables = (): Variables => {
  return parseJSON<Variables>(localStorage.getItem(VARIABLES_KEY), {});
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
