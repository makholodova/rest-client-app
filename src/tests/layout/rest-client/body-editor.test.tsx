import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import BodyEditor from '../../../components/layout/rest-client/tabs/body-editor/body-editor';

jest.mock('@/hooks/use-api-request', () => ({
  useApiRequest: jest.fn(() => ({ hasBody: false })),
}));

const setBodyMock = jest.fn();
let storeState = { body: '{}', setBody: setBodyMock };

jest.mock('@/store/restClient.store', () => ({
  useRestClientStore: (selector: any) => selector(storeState),
}));

jest.mock('@/components/ui/code-panel/code-panel', () => ({
  __esModule: true,
  default: (props: any) => (
    <div
      data-testid="codepanel"
      data-language={props.language}
      data-text={props.text}
      data-readonly={props.isReadOnly}
      onClick={() => props.setText('updated')}
    >
      {props.title}
    </div>
  ),
}));

describe('BodyEditor', () => {
  beforeEach(() => {
    setBodyMock.mockClear();
    storeState = { body: '{}', setBody: setBodyMock };
  });

  afterEach(() => {
    cleanup();
  });

  test('renders the language selector and CodePanel with initial props', () => {
    render(<BodyEditor />);

    const select = screen.getByRole('combobox');
    const panel = screen.getByTestId('codepanel');

    expect(select).toHaveValue('json');
    expect(panel).toHaveAttribute('data-language', 'json');
    expect(panel).toHaveAttribute('data-text', '{}');
    expect(panel).toHaveAttribute('data-readonly', 'false');
    expect(panel).toHaveTextContent('request body');
  });

  test('switches the language to "text"', () => {
    render(<BodyEditor />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'text' } });

    const panel = screen.getByTestId('codepanel');
    expect(panel).toHaveAttribute('data-language', 'text');
  });

  test('calls setBody when interacting with CodePanel', () => {
    render(<BodyEditor />);

    const panel = screen.getByTestId('codepanel');
    fireEvent.click(panel);

    expect(setBodyMock).toHaveBeenCalledTimes(1);
    expect(setBodyMock).toHaveBeenCalledWith('updated');
  });

  test('isReadOnly=true when hasBody=true', async () => {
    const { useApiRequest } = require('@/hooks/use-api-request');
    (useApiRequest as jest.Mock).mockReturnValueOnce({ hasBody: true });

    render(<BodyEditor />);

    const panel = screen.getByTestId('codepanel');
    expect(panel).toHaveAttribute('data-readonly', 'true');
  });
});
