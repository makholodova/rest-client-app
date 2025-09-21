import { render, screen } from '@testing-library/react';
import ResponseViewer from '@/components/layout/rest-client/response-viewer/response-viewer';

jest.mock('./response-viewer.module.scss', () => ({
  wrapper: 'wrapper',
}));

const fetchApiMock = jest.fn();
jest.mock('@/utils/rest-client-api', () => ({
  fetchApi: (...args) => fetchApiMock(...args),
}));

jest.mock('@/components/ui/code-panel/code-panel', () => {
  type Props = {
    title?: string;
    text?: string;
    isReadOnly?: boolean;
  };

  const CodePanelMock: React.FC<Props> = (props) => (
    <div data-testid="code-panel">
      <div data-testid="title">{props.title}</div>
      <pre data-testid="text">{props.text}</pre>
      <span data-testid="readonly">{String(!!props.isReadOnly)}</span>
    </div>
  );

  (CodePanelMock as { displayName?: string }).displayName = 'CodePanelMock';
  return CodePanelMock;
});

describe('ResponseViewer', () => {
  beforeEach(() => {
    fetchApiMock.mockReset();
  });

  it('calls fetchApi with data and headers', async () => {
    fetchApiMock.mockResolvedValue({ content: '{"ok":true}', status: 200 });

    const ui = await ResponseViewer({
      data: ['GET', 'https://api.example.com'],
      headers: { Authorization: 'Bearer X' },
    });

    render(ui);

    expect(fetchApiMock).toHaveBeenCalledWith(
      ['GET', 'https://api.example.com'],
      { Authorization: 'Bearer X' }
    );
  });

  it('renders CodePanel when content exists with title "body | <status>"', async () => {
    fetchApiMock.mockResolvedValue({ content: '{"ok":true}', status: 200 });

    const ui = await ResponseViewer({
      data: ['GET', 'https://api.example.com'],
      headers: {},
    });

    render(ui);

    expect(screen.getByTestId('code-panel')).toBeInTheDocument();
    expect(screen.getByTestId('title')).toHaveTextContent('body | 200');
    expect(screen.getByTestId('text')).toHaveTextContent('{"ok":true}');
    expect(screen.getByTestId('readonly')).toHaveTextContent('true');
  });

  it('does not render CodePanel when content is empty', async () => {
    fetchApiMock.mockResolvedValue({ content: '', status: 204 });

    const ui = await ResponseViewer({
      data: ['DELETE', 'https://api.example.com/item/1'],
      headers: null,
    });

    const { container } = render(ui);

    expect(container.querySelector('[data-testid="code-panel"]')).toBeNull();
    expect(container.firstChild).toHaveClass('wrapper');
  });
});
