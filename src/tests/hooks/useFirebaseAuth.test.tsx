import { renderHook, act } from '@testing-library/react';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { AuthUser } from '../../types/interfaces';
import { auth } from '@/firebase';

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
}));

jest.mock('@/firebase', () => ({
  auth: {},
}));

const mockOnAuthStateChanged = onAuthStateChanged as jest.MockedFunction<
  typeof onAuthStateChanged
>;

type AuthCallback = Parameters<typeof onAuthStateChanged>[1];

let mockUnsubscribe: jest.Mock;
let authCallback: AuthCallback;

const createMockUser = (overrides: Partial<User> = {}): User =>
  ({
    uid: 'test-uid',
    email: 'test@example.com',
    displayName: 'Test User',
    ...overrides,
  }) as User;

const createExpectedAuthUser = (user: Partial<User>): AuthUser => ({
  uid: user.uid!,
  email: user.email || null,
  name: user.displayName || null,
});

const setup = () => {
  const hook = renderHook(() => useFirebaseAuth());
  authCallback = mockOnAuthStateChanged.mock.calls.at(-1)![1] as AuthCallback;
  return hook;
};

const simulateAuthStateChange = async (user: User | null) => {
  await act(async () => {
    if (typeof authCallback === 'function') {
      authCallback(user);
    } else if (typeof authCallback?.next === 'function') {
      authCallback.next(user);
    }
  });
};

beforeEach(() => {
  mockUnsubscribe = jest.fn();
  mockOnAuthStateChanged.mockReturnValue(mockUnsubscribe);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('useFirebaseAuth', () => {
  it('should initialize with null authUser and loading true', () => {
    const { result } = setup();
    expect(result.current.authUser).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it('should subscribe to auth state changes on mount', () => {
    setup();
    expect(mockOnAuthStateChanged).toHaveBeenCalledTimes(1);
    expect(mockOnAuthStateChanged).toHaveBeenCalledWith(auth, authCallback);
  });

  it('should unsubscribe from auth state changes on unmount', () => {
    const { unmount } = setup();
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });

  it('handles login with valid user', async () => {
    const { result } = setup();
    const mockUser = createMockUser();
    const expectedAuthUser = createExpectedAuthUser(mockUser);
    await simulateAuthStateChange(mockUser);
    expect(result.current.authUser).toEqual(expectedAuthUser);
    expect(result.current.loading).toBe(false);
  });

  it('handles login with null email and displayName', async () => {
    const { result } = setup();
    const mockUser = createMockUser({ email: null, displayName: null });
    const expectedAuthUser = createExpectedAuthUser(mockUser);
    await simulateAuthStateChange(mockUser);
    expect(result.current.authUser).toEqual(expectedAuthUser);
    expect(result.current.loading).toBe(false);
  });

  it('should handle multiple auth state changes', async () => {
    const { result } = setup();
    const mockUser1 = createMockUser({ uid: 'u1', email: 'u1@mail.com' });
    const mockUser2 = createMockUser({ uid: 'u2', email: 'u2@mail.com' });
    await simulateAuthStateChange(mockUser1);
    expect(result.current.authUser).toEqual(createExpectedAuthUser(mockUser1));
    await simulateAuthStateChange(mockUser2);
    expect(result.current.authUser).toEqual(createExpectedAuthUser(mockUser2));
    await simulateAuthStateChange(null);
    expect(result.current.authUser).toBeNull();
  });

  it('should not unsubscribe if component re-renders', () => {
    const { rerender } = setup();
    rerender();
    expect(mockUnsubscribe).not.toHaveBeenCalled();
    expect(mockOnAuthStateChanged).toHaveBeenCalledTimes(1);
  });
});
