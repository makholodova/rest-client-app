type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

export type VariableRequest = {
  key: string;
  value: string;
  type?: 'string' | 'number' | 'boolean';
  description?: string;
};

export type HeaderRequest = {
  key: string;
  value: string;
  description?: string;
  disabled?: boolean;
};

export type ConfigRequest = {
  method: Method;
  url: string;
  language: string;
  variables?: VariableRequest[];
  headers?: HeaderRequest[];
};

type Variant = {
  key: string;
};

export type LanguageOption = {
  key: string;
  label: string;
  syntax_mode: string;
  variants: Variant[];
};
