type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

export type ConfigRequest = {
  method: Method;
  url: string;
  language: string;
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
