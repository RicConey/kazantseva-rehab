// app/api/auth/[...nextauth]/auth.config.ts

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

function sanitizeInput(input: unknown): input is string {
  if (typeof input !== 'string' || input.length === 0) return false;
  const unsafe = /[<>"'`\\\/;{}()\[\]$]/;
  return !unsafe.test(input);
}

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Ім’я', type: 'text' },
        password: { label: 'Пароль', type: 'password' },
      },
      async authorize(credentials) {
        if (
          !credentials ||
          !sanitizeInput(credentials.username) ||
          !sanitizeInput(credentials.password)
        ) {
          throw new Error('Невірне ім’я або пароль');
        }
        // анти‑брутфорс
        await new Promise(r => setTimeout(r, 1000));
        const isValidUsername = credentials.username === process.env.ADMIN_USERNAME;
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          process.env.ADMIN_PASSWORD_HASH!
        );
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
  session: {
    // Литеральный тип 'jwt' автоматически подходит под SessionStrategy
    strategy: 'jwt',
  },
};

export default authConfig;
