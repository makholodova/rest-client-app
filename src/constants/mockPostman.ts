import { HeaderRequest, VariableRequest } from '../types/postman.type';

export const mockVariables: VariableRequest[] = [
  {
    key: 'apiUrl',
    value: 'https://jsonplaceholder.typicode.com',
    type: 'string',
    description: 'Базовый URL API для тестовых запросов',
  },
  {
    key: 'userId',
    value: '1',
    type: 'number',
    description: 'ID пользователя для запросов',
  },
  {
    key: 'isTestMode',
    value: 'true',
    type: 'boolean',
    description: 'Флаг тестового режима работы',
  },
];

export const mockHeaders: HeaderRequest[] = [
  {
    key: 'Content-Type',
    value: 'application/json',
    description: 'Тип отправляемых данных',
  },
  {
    key: 'Authorization',
    value: 'Bearer your-token-here',
    description: 'Токен авторизации',
  },
  {
    key: 'X-Custom-Header',
    value: 'custom-value',
    disabled: false,
  },
  {
    key: 'TEST HEADER',
    value: 'TEST HEADER',
    description: 'проверяем передачу заголовков',
  },
];
