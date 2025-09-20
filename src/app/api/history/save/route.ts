import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { HistoryRequest } from '@/types/history.type';
import { getAdminAuth } from '@/firebase-admin';
import { addDoc, collection } from 'firebase/firestore';

export type NewHistoryRequest = Omit<HistoryRequest, 'id' | 'timestamp'> & {
  timestamp?: string;
  status?: number | null;
};

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');

    if (!authHeader) {
      return NextResponse.json(
        {
          error:
            'Post error: authorization is required, no token is available now',
        },
        { status: 401 }
      );
    }
    const decodedToken = await getAdminAuth().verifyIdToken(authHeader);
    const userId = decodedToken.uid;
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
