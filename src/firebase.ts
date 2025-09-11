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
  apiKey: 'AIzaSyBO_yryYqJQVYRsV4gD0NZ8Ulplxw96Kz8',
  authDomain: 'rest-client-app-cfaa5.firebaseapp.com',
  projectId: 'rest-client-app-cfaa5',
  storageBucket: 'rest-client-app-cfaa5.firebasestorage.app',
  messagingSenderId: '807816489019',
  appId: '1:807816489019:web:253791a85b40cc0eefd41e',
  measurementId: 'G-ZVR99WFE0W',
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const token = await res.user.getIdToken();
    await fetch('/api/set-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    if (err instanceof FirebaseError) {
      toast.error(err.message);
    } else {
      toast.error('Unexpected error');
    }
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
