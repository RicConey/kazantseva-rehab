'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from '../../../components/AdminAppointments.module.css';

interface Props {
    csrfToken: string;
}

export default function SignInForm({ csrfToken }: Props) {
    const params = useSearchParams();
    const router = useRouter();

    const [trap, setTrap] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [dots, setDots] = useState('');

    const callbackUrl = params.get('from') ?? '/admin';
    const errorCode = params.get('error');
    const friendly: Record<string,string> = {
        CredentialsSignin: 'Невірне ім’я або пароль.',
        TooManyRequests:   'Забагато спроб. Спробуйте пізніше.',
    };

    // Подставляем сообщение из URL
    useEffect(() => {
        if (errorCode) {
            setErrorMsg(friendly[errorCode] ?? `Помилка сервера: ${errorCode}`);
        }
    }, [errorCode]);

    // Анимация точек во время загрузки
    useEffect(() => {
        if (!loading) {
            setDots('');
            return;
        }
        const iv = setInterval(() => {
            setDots(prev => (prev.length < 3 ? prev + '.' : ''));
        }, 500);
        return () => clearInterval(iv);
    }, [loading]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (trap) return; // honeypot

        if (!csrfToken) {
            alert('Не вдалося завантажити токен безпеки. Оновіть сторінку.');
            return;
        }

        setLoading(true);
        setErrorMsg(null);

        const formData = new FormData(e.currentTarget);
        const res = await signIn<'credentials'>('credentials', {
            redirect: false,
            username: formData.get('username') as string,
            password: formData.get('password') as string,
            csrfToken,
            callbackUrl,
        });

        if (res?.error) {
            setLoading(false);
            router.replace(`/auth/signin?error=${encodeURIComponent(res.error)}`);
        } else {
            router.replace(res?.url || '/admin');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`${styles.formCard} ${styles.formGrid}`}>
            <h1 className={styles.title}>Вхід в адмінку</h1>

            {errorMsg && <div className={styles.error}>{errorMsg}</div>}

            <input name="csrfToken"   type="hidden" value={csrfToken} />
            <input name="callbackUrl"  type="hidden" value={callbackUrl} />

            <div className={styles.field}>
                <label>Ім’я користувача</label>
                <input
                    name="username"
                    type="text"
                    required
                    autoComplete="username"
                    maxLength={100}
                    className={styles.input}
                />
            </div>

            <div className={styles.field}>
                <label>Пароль</label>
                <input
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    minLength={8}
                    maxLength={128}
                    className={styles.input}
                />
            </div>

            {/* honeypot */}
            <div style={{ position: 'absolute', left: '-9999px' }}>
                <input
                    name="trap"
                    value={trap}
                    onChange={e => setTrap(e.target.value)}
                    autoComplete="off"
                    tabIndex={-1}
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className={styles.submitButton}
            >
                {loading
                    ? <>Завантаження{dots}</>
                    : 'Увійти'}
            </button>
        </form>
    );
}
