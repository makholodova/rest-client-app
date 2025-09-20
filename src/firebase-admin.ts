import {
  initializeApp,
  cert,
  getApps,
  App,
  applicationDefault,
} from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

function getPrivateKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY;
  if (!key) return undefined;
  return key.replace(/\\n/g, '\n');
}

export function getAdminApp(): App {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL;
  const privateKey = getPrivateKey();

  if (getApps().length > 0) {
    return getApps()[0];
  }

  if (projectId && clientEmail && privateKey) {
    return initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  }

  return initializeApp({ credential: applicationDefault() });
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}
