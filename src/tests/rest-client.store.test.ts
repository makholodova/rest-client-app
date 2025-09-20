import { act } from '@testing-library/react';
import { useRestClientStore } from '@/store/restClient.store';

describe('useRestClientStore', () => {
  const reset = () =>
    useRestClientStore.setState((s) => ({ ...s, body: '', headers: [] }));

  beforeEach(() => reset());

  it('has a correct initial state', () => {
    const { body, headers } = useRestClientStore.getState();
    expect(body).toBe('');
    expect(headers).toEqual([]);
  });

  it('setBody sets body', () => {
    act(() => {
      useRestClientStore.getState().setBody('{"a":1}');
    });
    expect(useRestClientStore.getState().body).toBe('{"a":1}');
  });

  it('setHeaders accepts an updater function', () => {
    act(() => {
      useRestClientStore
        .getState()
        .setHeaders(() => [
          { key: 'A', value: '1', description: '', disabled: false },
        ]);
    });

    act(() => {
      useRestClientStore
        .getState()
        .setHeaders((prev) => [
          ...prev,
          { key: 'B', value: '2', description: 'x', disabled: true },
        ]);
    });

    const { headers } = useRestClientStore.getState();
    expect(headers).toHaveLength(2);
    expect(headers[0]).toMatchObject({ key: 'A', value: '1' });
    expect(headers[1]).toMatchObject({ key: 'B', value: '2', disabled: true });
  });

  it('addHeader adds an empty header with default values', () => {
    act(() => {
      useRestClientStore.getState().addHeader();
      useRestClientStore.getState().addHeader();
    });

    const { headers } = useRestClientStore.getState();
    expect(headers).toHaveLength(2);
    expect(headers[0]).toEqual({
      key: '',
      value: '',
      description: '',
      disabled: false,
    });
  });

  it('updateHeader updates a specific field of the selected index', () => {
    act(() => {
      useRestClientStore.getState().addHeader();
    });

    const beforeRef = useRestClientStore.getState().headers;

    act(() => {
      useRestClientStore.getState().updateHeader(0, 'key', 'Auth');
      useRestClientStore.getState().updateHeader(0, 'value', 'token');
    });

    const after = useRestClientStore.getState().headers;
    expect(after[0]).toMatchObject({ key: 'Auth', value: 'token' });
    expect(after).not.toBe(beforeRef);
  });

  it('toggleHeader inverts disabled for the selected index', () => {
    act(() => {
      useRestClientStore.getState().addHeader();
    });

    expect(useRestClientStore.getState().headers[0].disabled).toBe(false);

    act(() => {
      useRestClientStore.getState().toggleHeader(0);
    });
    expect(useRestClientStore.getState().headers[0].disabled).toBe(true);

    act(() => {
      useRestClientStore.getState().toggleHeader(0);
    });
    expect(useRestClientStore.getState().headers[0].disabled).toBe(false);
  });

  it('removeHeader removes an element by index.', () => {
    act(() => {
      useRestClientStore.getState().setHeaders([
        { key: 'A', value: '1', description: '', disabled: false },
        { key: 'B', value: '2', description: '', disabled: false },
        { key: 'C', value: '3', description: '', disabled: false },
      ]);
    });

    act(() => {
      useRestClientStore.getState().removeHeader(1);
    });

    const { headers } = useRestClientStore.getState();
    expect(headers).toHaveLength(2);
    expect(headers.map((h) => h.key)).toEqual(['A', 'C']);
  });
});
