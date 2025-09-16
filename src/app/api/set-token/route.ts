import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { token } = await request.json();
  const maxAge = 60 * 60 * 12;
  const response = NextResponse.json({ success: true });

  response.cookies.set('AUTH-TOKEN', token, {
    httpOnly: true,
    maxAge,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return response;
}
