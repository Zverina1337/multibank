import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '../../../../../lib/prisma';

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'phone',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        code: { label: 'Code', type: 'text' },
      },
      async authorize(credentials) {
        try {
          const { phone, code } = credentials;

          if (!phone || !code) {
            throw new Error('Phone and code are required');
          }

          // Находим активный код верификации
          const verificationCode = await prisma.verificationCode.findFirst({
            where: {
              phone,
              used: false,
              expiresAt: {
                gt: new Date(),
              },
            },
            include: {
              user: true,
            },
          });

          if (!verificationCode) {
            throw new Error(
              'No active verification code found or code expired'
            );
          }

          // Проверяем попытки
          if (verificationCode.attempts >= 5) {
            throw new Error('Too many attempts. Please request a new code.');
          }

          // Увеличиваем счетчик попыток
          await prisma.verificationCode.update({
            where: { id: verificationCode.id },
            data: { attempts: verificationCode.attempts + 1 },
          });

          // Проверяем код
          if (verificationCode.code !== code) {
            throw new Error('Invalid verification code');
          }

          // Помечаем код как использованный
          await prisma.verificationCode.update({
            where: { id: verificationCode.id },
            data: { used: true },
          });

          let user = verificationCode.user;

          // Если пользователь не найден, создаем нового
          if (!user) {
            user = await prisma.user.create({
              data: {
                phone,
                name: `User ${phone}`,
              },
            });
          }

          return {
            id: user.id,
            phone: user.phone,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.phone = user.phone;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.phone = token.phone;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    verify: '/auth/verify',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
