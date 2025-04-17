// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import authConfig from './auth.config'; // вынесем конфигурацию в отдельный файл

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
