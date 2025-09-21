import { render, screen } from '@testing-library/react';
import RestClient from '@/components/layout/rest-client/rest-client';

jest.mock('@/components/layout/rest-client/request-form/request-form', () => {
  const RequestFormMock: React.FC = () => (
    <div data-testid="request-form">RequestForm</div>
  );
  (RequestFormMock as { displayName?: string }).displayName = 'RequestFormMock';
  return RequestFormMock;
});

jest.mock('@/components/layout/rest-client/tabs/headers/headers', () => {
  const HeadersMock: React.FC = () => <div data-testid="headers">Headers</div>;
  (HeadersMock as { displayName?: string }).displayName = 'HeadersMock';
  return HeadersMock;
});

jest.mock(
  '@/components/layout/rest-client/tabs/body-editor/body-editor',
  () => {
    const BodyEditorMock: React.FC = () => (
      <div data-testid="body-editor">BodyEditor</div>
    );
    (BodyEditorMock as { displayName?: string }).displayName = 'BodyEditorMock';
    return BodyEditorMock;
  }
);

jest.mock(
  '@/components/layout/rest-client/tabs/code-generator/code-generator',
  () => {
    const CodeGeneratorMock: React.FC = () => (
      <div data-testid="code-generator">CodeGenerator</div>
    );
    (CodeGeneratorMock as { displayName?: string }).displayName =
      'CodeGeneratorMock';
    return CodeGeneratorMock;
  }
);
jest.mock('@/components/ui/tabs/tabs', () => ({
  Tabs: ({ tabs }) => (
    <div data-testid="tabs">
      {tabs.map((tab) => (
        <div key={tab.label} data-testid="tab">
          {tab.label}
        </div>
      ))}
    </div>
  ),
}));

const getTranslationsMock = jest.fn();
jest.mock('next-intl/server', () => ({
  getTranslations: (ns: string) => getTranslationsMock(ns),
}));

describe('RestClient', () => {
  it('renders RequestForm and Tabs with translated labels', async () => {
    getTranslationsMock.mockResolvedValue((key: string) => {
      const dict: Record<string, string> = {
        headers: 'Headers label',
        body: 'Body label',
        code: 'Code label',
      };
      return dict[key] ?? key;
    });

    const ui = await RestClient();
    render(ui);

    expect(screen.getByTestId('request-form')).toBeInTheDocument();

    const labels = screen.getAllByTestId('tab').map((el) => el.textContent);
    expect(labels).toEqual(['Headers label', 'Body label', 'Code label']);

    expect(getTranslationsMock).toHaveBeenCalledWith('RestClient');
  });
});
