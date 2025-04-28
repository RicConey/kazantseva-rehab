import SignInForm from './SignInForm';
import { cookies } from 'next/headers';

export default async function SignInPage() {
    const cookieStore = await cookies();
    const csrfCookie = cookieStore.get('next-auth.csrf-token');
    const csrfToken = csrfCookie ? csrfCookie.value.split('|')[0] : '';

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
                <SignInForm csrfToken={csrfToken} />
            </div>
        </div>
    );
}
