import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '../../../../../lib/prisma'

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'phone',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        code: { label: 'Code', type: 'text' },
        ipAddress: { label: 'IP Address', type: 'text' },
        userAgent: { label: 'User Agent', type: 'text' },
        deviceType: { label: 'Device Type', type: 'text' },
        location: { label: 'Location', type: 'text' }
      },
      async authorize(credentials) {
        try {
          const { phone, code, ipAddress, userAgent, deviceType, location } = credentials
          
          if (!phone || !code) {
            throw new Error('Phone and code are required')
          }

          // Находим активный код верификации
          const verificationCode = await prisma.verificationCode.findFirst({
            where: {
              phone,
              used: false,
              expiresAt: {
                gt: new Date()
              }
            },
            include: {
              user: {
                include: {
                  userProfiles: true
                }
              }
            }
          })

          if (!verificationCode) {
            throw new Error('No active verification code found or code expired')
          }

          // Проверяем попытки
          if (verificationCode.attempts >= 5) {
            throw new Error('Too many attempts. Please request a new code.')
          }

          // Увеличиваем счетчик попыток
          await prisma.verificationCode.update({
            where: { id: verificationCode.id },
            data: { attempts: verificationCode.attempts + 1 }
          })

          // Проверяем код
          if (verificationCode.code !== code) {
            throw new Error('Invalid verification code')
          }

          // Помечаем код как использованный
          await prisma.verificationCode.update({
            where: { id: verificationCode.id },
            data: { used: true }
          })

          let user = verificationCode.user

          // Обновляем статистику логина пользователя
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              lastLoginAt: new Date(),
              loginCount: { increment: 1 }
            },
            include: {
              userProfiles: true
            }
          })

          // Сохраняем успешный логин в историю
          await prisma.loginHistory.create({
            data: {
              userId: user.id,
              ipAddress: ipAddress || null,
              userAgent: userAgent || null,
              deviceType: deviceType || null,
              location: location || null,
              success: true
            }
          })

          return {
            id: user.id,
            phone: user.phone,
            name: user.name,
            email: user.email,
            profile: user.userProfiles[0] || {}
          }

        } catch (error) {
          console.error('Auth error:', error)
          
          // Сохраняем неудачную попытку входа, если можем определить пользователя
          if (credentials.phone) {
            const user = await prisma.user.findUnique({
              where: { phone: credentials.phone }
            })
            
            if (user) {
              await prisma.loginHistory.create({
                data: {
                  userId: user.id,
                  ipAddress: credentials.ipAddress || null,
                  userAgent: credentials.userAgent || null,
                  deviceType: credentials.deviceType || null,
                  location: credentials.location || null,
                  success: false
                }
              })
            }
          }
          
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.phone = user.phone
        token.id = user.id
        token.profile = user.profile
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.sub
      session.user.phone = token.phone
      session.user.profile = token.profile
      
      // Получаем актуальные данные пользователя
      if (token.sub) {
        const userData = await prisma.user.findUnique({
          where: { id: token.sub },
          include: {
            userProfiles: true
          }
        })
        
        if (userData) {
          session.user.details = userData
          session.user.profile = userData.userProfiles[0] || {}
        }
      }
      
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    verify: '/auth/verify'
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }