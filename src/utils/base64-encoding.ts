export const encodeBase64 = (str: string): string => {
  if (typeof window === 'undefined') {
    return Buffer.from(str).toString('base64');
  } else {
    return btoa(encodeURIComponent(str));
  }
};

export const decodeBase64 = (str: string): string => {
  if (typeof window === 'undefined') {
    return Buffer.from(str, 'base64').toString('utf-8');
  } else {
    return decodeURIComponent(atob(str));
  }
};
