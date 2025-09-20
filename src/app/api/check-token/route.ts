import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const token = (await cookies()).get('AUTH-TOKEN');
  return NextResponse.json({ hasToken: !!token, hasValidToken: !!token });
}
