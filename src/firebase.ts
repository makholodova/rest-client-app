import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FirebaseError } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const token = await res.user.getIdToken();
    const apiRes = await fetch('/api/set-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!apiRes.ok) {
      toast.error('Token set error');
      return false;
    }
    return true;
  } catch (err) {
    if (err instanceof FirebaseError) {
      toast.error(err.message);
    } else {
      toast.error('Unexpected error');
    }
    return false;
  }
};

const registerWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await updateProfile(user, { displayName: name });
    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      name,
      authProvider: 'local',
      email,
    });
    const token = await user.getIdToken();
    const apiRes = await fetch('/api/set-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!apiRes.ok) {
      toast.error('Token set error');
      return false;
    }
    return true;
  } catch (err) {
    if (err instanceof FirebaseError) {
      toast.error(err.message);
    } else {
      toast.error('Unexpected error');
    }
  }
};

const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    toast.success('Password reset link sent!');
  } catch (err) {
    if (err instanceof FirebaseError) {
      toast.error(err.message);
    } else {
      toast.error('Unexpected error');
    }
  }
};

const logout = async () => {
  try {
    signOut(auth);
    await fetch('/api/logout', { method: 'POST' });
  } catch (err) {
    if (err instanceof FirebaseError) toast.error(err.message);
    toast.error('Logout error');
  }
};

export {
  auth,
  db,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
