import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { ROUTES } from './constants/routes';

const intlMiddleware = createIntlMiddleware(routing);

export function middleware(request: NextRequest) {
  const authResult = applyAuthLogic(request);
  if (authResult) {
    return authResult;
  }

  return intlMiddleware(request);
}

function applyAuthLogic(request: NextRequest): NextResponse | null {
  const token = request.cookies.get('AUTH-TOKEN')?.value;
  const pathname = request.nextUrl.pathname;

  const localesPattern = new RegExp(`^\/(${routing.locales.join('|')})`);
  const cleanPathname = pathname.replace(localesPattern, '') || '/';

  if (cleanPathname.startsWith(ROUTES.HISTORY) && !token) {
    const loginUrl = new URL(ROUTES.SIGN_IN, request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (
    (cleanPathname.startsWith(ROUTES.SIGN_IN) ||
      cleanPathname.startsWith(ROUTES.SIGN_UP)) &&
    token
  ) {
    const dashboardUrl = new URL(ROUTES.HOME, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return null;
}

export const config = {
  matcher: [
    '/history',
    '/signin',
    '/signup',
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
  ],
};
