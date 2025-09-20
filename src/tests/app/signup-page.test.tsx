import {render, screen, fireEvent, waitFor, act} from '@testing-library/react';
import { registerWithEmailAndPassword } from '@/firebase';
import SignUpPage from "@/app/[locale]/signup/page";

const pushMock = jest.fn();

jest.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key,
}));

jest.mock('@/firebase', () => ({
	registerWithEmailAndPassword: jest.fn(),
}));

jest.mock('next/navigation', () => ({
	useRouter: () => ({ push: pushMock }),
}));

jest.mock('@hookform/resolvers/zod', () => ({
	zodResolver: () => (_values: any) => ({ values: _values, errors: {} }),
}));

jest.mock('@/components/ui/app-link/app-link', () => (props: any) => (
	<a data-testid="app-link" href={props.href}>{props.children}</a>
));
jest.mock('@/components/ui/button/button', () => (props: any) => (
	<button type={props.type || 'button'} onClick={props.onClick}>
		{props.children}
	</button>
));
jest.mock('@/components/ui/field-input/field-input', () => ({
	FieldInput: (props: any) => <input data-testid={props.type} {...props} />,
}));
jest.mock('@/components/layout/page/page', () => (props: any) => (
	<div data-testid="page">{props.children}</div>
));

jest.mock('../signin/signin.module.scss', () => ({
	content: 'content',
	formContainer: 'formContainer',
	title: 'title',
	error: 'error',
	linkWrapper: 'linkWrapper',
}));

describe('SignUpPage (minimal)', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		pushMock.mockClear();
	});

	it('renders basic form elements',async  () => {
		await act(async () => {
			render(<SignUpPage />);
		});
		expect(screen.getByTestId('page')).toBeInTheDocument();
		expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('title');
		expect(screen.getByTestId('text')).toBeInTheDocument();
		expect(screen.getByTestId('email')).toBeInTheDocument();
		expect(screen.getByTestId('app-link')).toHaveAttribute('href', '/signin');
	});

	it('A successful submit calls register and pushes to HOME', async () => {
		(registerWithEmailAndPassword as jest.Mock).mockResolvedValue(true);

		render(<SignUpPage />);

		fireEvent.change(screen.getByTestId('text'),   { target: { value: 'Alice' } });
		fireEvent.change(screen.getByTestId('email'),  { target: { value: 'a@b.com' } });

		const inputs = screen.getAllByTestId('password');
		fireEvent.change(inputs[0], { target: { value: 'secret123' } });
		fireEvent.change(inputs[1], { target: { value: 'secret123' } });


		fireEvent.click(screen.getByRole('button', { name: 'submitBtn' }));

		await waitFor(() => {
			expect(registerWithEmailAndPassword).toHaveBeenCalledWith(
				'Alice',
				'a@b.com',
				'secret123'
			);
			expect(pushMock).toHaveBeenCalledTimes(1);
		});
	});
});
