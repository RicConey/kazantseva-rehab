import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

function sanitizeInput(input) {
  const unsafe = /[<>"'`\\\/;{}()\[\]$]/;
  return typeof input === 'string' && input.length > 0 && !unsafe.test(input);
}

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Ім’я', type: 'text' },
        password: { label: 'Пароль', type: 'password' },
      },
      async authorize(credentials) {
        const { username, password } = credentials;

        // Базовая валидация
        if (!sanitizeInput(username) || !sanitizeInput(password)) {
          throw new Error('Невірне ім’я або пароль');
        }

        // Защита от brute-force
        await new Promise(res => setTimeout(res, 1000));

        const isValidUsername = username === process.env.ADMIN_USERNAME;
        const isValidPassword = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);

        if (isValidUsername && isValidPassword) {
          return { id: 'admin', name: 'Admin' };
        }

        throw new Error('Невірне ім’я або пароль');
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
};

export default authConfig;
