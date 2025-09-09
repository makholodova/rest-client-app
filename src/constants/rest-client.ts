import { Method, ProgrammingLanguage } from '@/types/postman.type';

export const METHOD_OPTIONS: Method[] = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS',
];

export const LANGUAGE_OPTIONS: { key: ProgrammingLanguage; label: string }[] = [
  { key: 'csharp', label: 'C#' },
  { key: 'curl', label: 'cURL' },
  { key: 'dart', label: 'Dart' },
  { key: 'go', label: 'Go' },
  { key: 'http', label: 'HTTP raw' },
  { key: 'java', label: 'Java' },
  { key: 'javascript', label: 'JavaScript' },
  { key: 'kotlin', label: 'Kotlin' },
  { key: 'c', label: 'C' },
  { key: 'nodejs', label: 'Node.js' },
  { key: 'objective-c', label: 'Objective-C' },
  { key: 'ocaml', label: 'OCaml' },
  { key: 'php', label: 'PHP' },
  { key: 'powershell', label: 'PowerShell' },
  { key: 'python', label: 'Python' },
  { key: 'r', label: 'R' },
  { key: 'ruby', label: 'Ruby' },
  { key: 'rust', label: 'Rust' },
  { key: 'shell', label: 'Shell' },
  { key: 'swift', label: 'Swift' },
];
