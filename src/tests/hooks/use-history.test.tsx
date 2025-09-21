import { renderHook, act } from '@testing-library/react';
import { useHistory } from '../../hooks/use-history';
import { db } from '@/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  CollectionReference,
  Query,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot,
  QueryOrderByConstraint,
  DocumentReference,
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { HistoryRequest } from '@/types/history.type';
import { Method } from '@/types/postman.type';

jest.mock('@/firebase', () => ({
  db: {},
  auth: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
}));

const mockOnAuthStateChanged = onAuthStateChanged as jest.MockedFunction<
  typeof onAuthStateChanged
>;
const mockCollection = collection as jest.MockedFunction<typeof collection>;
const mockAddDoc = addDoc as jest.MockedFunction<typeof addDoc>;
const mockGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;
const mockQuery = query as jest.MockedFunction<typeof query>;
const mockOrderBy = orderBy as jest.MockedFunction<typeof orderBy>;

const createMockHistoryRequest = (
  overrides: Partial<HistoryRequest> = {}
): HistoryRequest => ({
  id: 'test-id',
  method: 'GET' as Method,
  url: 'https://api.example.com/test',
  headers: { 'Content-Type': 'application/json' },
  body: null,
  status: 200,
  latency_ms: 150,
  timestamp: '2023-01-01T00:00:00.000Z',
  req_size_bytes: 100,
  res_size_bytes: 200,
  error: null,
  ...overrides,
});

const createMockSaveRequest = (
  overrides: Partial<Omit<HistoryRequest, 'id'>> = {}
) => ({
  method: 'POST' as Method,
  url: 'https://api.example.com/test',
  headers: { 'Content-Type': 'application/json' },
  body: '{"test": "data"}',
  status: 201,
  latency_ms: 200,
  timestamp: '2023-01-01T00:00:00.000Z',
  req_size_bytes: 150,
  res_size_bytes: 300,
  ...overrides,
});

const createMockFirestoreDoc = (
  data: Partial<HistoryRequest>
): DocumentSnapshot<DocumentData> =>
  ({
    id: data.id || 'doc-id',
    data: () => data,
    exists: true,
    metadata: {} as DocumentData,
    ref: {} as DocumentData,
  }) as unknown as DocumentSnapshot<DocumentData>;

describe('useHistory', () => {
  let mockUnsubscribe: jest.Mock;
  let authCallback: ((user: User | null) => void) | null = null;

  beforeEach(() => {
    mockUnsubscribe = jest.fn();
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      authCallback = callback as (user: User | null) => void;
      return mockUnsubscribe;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    authCallback = null;
  });

  const simulateAuthStateChange = async (user: User | null) => {
    if (authCallback) {
      await act(async () => {
        if (authCallback !== null) authCallback(user);
      });
    }
  };

  describe('initialization', () => {
    it('should initialize with empty state', () => {
      const { result } = renderHook(() => useHistory());
      expect(result.current.history).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.authLoading).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.userId).toBeNull();
    });

    it('should subscribe to auth state changes on mount', () => {
      renderHook(() => useHistory());
      expect(mockOnAuthStateChanged).toHaveBeenCalledWith(
        require('@/firebase').auth,
        authCallback
      );
    });

    it('should unsubscribe from auth state changes on unmount', () => {
      const { unmount } = renderHook(() => useHistory());
      unmount();
      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('loadHistory', () => {
    it('should load history successfully', async () => {
      const mockUser = { uid: 'user123' } as User;
      const mockHistoryData = [
        createMockHistoryRequest({ id: 'doc1' }),
        createMockHistoryRequest({ id: 'doc2' }),
      ];
      const mockSnapshot = {
        docs: mockHistoryData.map(createMockFirestoreDoc),
      } as QuerySnapshot<DocumentData>;
      mockCollection.mockReturnValue({} as CollectionReference<DocumentData>);
      mockOrderBy.mockReturnValue({} as QueryOrderByConstraint);
      mockQuery.mockReturnValue({} as Query<DocumentData>);
      mockGetDocs.mockResolvedValue(mockSnapshot);
      const { result } = renderHook(() => useHistory());
      await simulateAuthStateChange(mockUser);
      await act(async () => {
        await result.current.loadHistory();
      });
      expect(result.current.history).toEqual(mockHistoryData);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockCollection).toHaveBeenCalledWith(
        db,
        'users',
        'user123',
        'history'
      );
      expect(mockOrderBy).toHaveBeenCalledWith('timestamp', 'desc');
    });

    it('should set error when no user is authenticated', async () => {
      const { result } = renderHook(() => useHistory());
      await simulateAuthStateChange(null);
      await act(async () => {
        await result.current.loadHistory();
      });
      expect(result.current.error).toBe(
        'Error: Sign in to have access to history, loadhistory error'
      );
      expect(result.current.history).toEqual([]);
    });

    it('should handle unknown errors', async () => {
      const mockUser = { uid: 'user123' } as User;
      mockCollection.mockReturnValue({} as CollectionReference<DocumentData>);
      mockOrderBy.mockReturnValue({} as QueryOrderByConstraint);
      mockQuery.mockReturnValue({} as Query<DocumentData>);
      mockGetDocs.mockRejectedValue('unknown error');
      const { result } = renderHook(() => useHistory());
      await simulateAuthStateChange(mockUser);
      await act(async () => {
        await result.current.loadHistory();
      });
      expect(result.current.error).toBe(
        'Failed to load history, unknown error'
      );
      expect(result.current.loading).toBe(false);
    });
  });

  describe('saveHistory', () => {
    it('should save history successfully', async () => {
      const mockUser = { uid: 'user123' } as User;
      const mockRequest = createMockSaveRequest();
      const mockCollectionRef = {} as CollectionReference<DocumentData>;
      mockCollection.mockReturnValue(mockCollectionRef);
      mockAddDoc.mockResolvedValue({
        id: 'new-doc-id',
      } as DocumentReference<DocumentData>);
      const mockHistoryData = [createMockHistoryRequest({ id: 'new-doc-id' })];
      const mockSnapshot = {
        docs: mockHistoryData.map(createMockFirestoreDoc),
      } as QuerySnapshot<DocumentData>;
      mockOrderBy.mockReturnValue({} as QueryOrderByConstraint);
      mockQuery.mockReturnValue({} as Query<DocumentData>);
      mockGetDocs.mockResolvedValue(mockSnapshot);
      const { result } = renderHook(() => useHistory());
      await simulateAuthStateChange(mockUser);
      await act(async () => {
        await result.current.saveHistory(mockRequest);
      });
      expect(mockAddDoc).toHaveBeenCalledWith(mockCollectionRef, {
        ...mockRequest,
        timestamp: mockRequest.timestamp,
      });
      expect(result.current.error).toBeNull();
    });

    it('should set error when no user is authenticated', async () => {
      const mockRequest = createMockSaveRequest({
        headers: {},
        body: null,
        status: 200,
        latency_ms: 100,
        req_size_bytes: 50,
        res_size_bytes: 100,
      });
      const { result } = renderHook(() => useHistory());
      await simulateAuthStateChange(null);
      await act(async () => {
        await result.current.saveHistory(mockRequest);
      });
      expect(result.current.error).toBe(
        'Error: Sign in to have access to history, saveHistory error'
      );
    });
  });
});
