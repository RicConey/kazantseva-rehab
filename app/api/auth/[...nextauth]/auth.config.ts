// app/api/auth/[...nextauth]/auth.config.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { RateLimiterMemory } from 'rate-limiter-flexible';

function sanitizeInput(input: unknown): input is string {
  if (typeof input !== 'string' || input.length === 0) return false;
  const unsafe = /[<>"'`\\\/;{}()\[\]$]/;
  return !unsafe.test(input);
}

// лимит: 5 попыток за 15 минут
const loginLimiter = new RateLimiterMemory({
  points: 5,
  duration: 15 * 60,
});

export const authConfig: NextAuthOptions = {
  // ... остальные настройки ...
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Имя', type: 'text' },
        password: { label: 'Пароль', type: 'password' },
      },
      async authorize(credentials, req) {
        // IP из заголовков
        const header = req.headers['x-forwarded-for'] || req.headers['x-real-ip'];
        const ip = Array.isArray(header) ? header[0] : header || 'unknown';

        // проверяем лимит
        try {
          await loginLimiter.consume(ip);
        } catch {
          throw new Error('TooManyRequests');
        }

        if (
          !credentials ||
          !sanitizeInput(credentials.username) ||
          !sanitizeInput(credentials.password)
        ) {
          throw new Error('CredentialsSignin');
        }
        // анти-брутфорс задержка
        await new Promise(r => setTimeout(r, 1000));

        const validUser = credentials.username === process.env.ADMIN_USERNAME;
        const validPass = await bcrypt.compare(
          credentials.password,
          process.env.ADMIN_PASSWORD_HASH!
        );
        if (validUser && validPass) {
          return { id: 'admin', name: 'Admin', role: 'admin' };
        }
        throw new Error('CredentialsSignin');
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  session: { strategy: 'jwt', maxAge: 7 * 24 * 3600, updateAge: 24 * 3600 },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      session.user = session.user ?? {};
      (session.user as any).role = token.role;
      return session;
    },
  },
};

export default authConfig;
