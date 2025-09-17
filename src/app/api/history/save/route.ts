import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth, db } from '@/firebase';
import { HistoryRequest } from '@/types/history.type';

import { addDoc, collection } from 'firebase/firestore';

export type NewHistoryRequest = Omit<HistoryRequest, 'id' | 'timestamp'> & {
  timestamp?: string;
};

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get('AUTH-TOKEN');
    if (!token) {
      return NextResponse.json(
        {
          error: 'Error: authorization is required, no token is available now',
        },
        { status: 401 }
      );
    }

    // I'm not sure if this is the best way to get current user, temporary solution
    const userId = auth.currentUser?.uid;
    if (!userId) {
      return NextResponse.json(
        { error: 'User (uid) is not found' },
        { status: 401 }
      );
    }

    const payload = (await req.json()) as NewHistoryRequest;

    const ref = collection(db, 'users', userId, 'history');

    await addDoc(ref, {
      method: (payload.method || 'GET').toUpperCase(),
      url: payload.url,
      headers: payload.headers || {},
      body: payload.body ?? null,
      status: payload.status ?? null,
      latency_ms: payload.latency_ms ?? 0,
      timestamp: payload.timestamp || new Date().toISOString(),
      req_size_bytes: payload.req_size_bytes ?? 0,
      res_size_bytes: payload.res_size_bytes ?? 0,
      error: payload.error ?? null,
    });

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error:
          e instanceof Error ? e.message : 'Unknown NextResponse.json error',
      },
      { status: 500 }
    );
  }
}
