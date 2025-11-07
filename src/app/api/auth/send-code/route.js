import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function POST(request) {
  try {
    const { phone, ipAddress, userAgent, deviceType, location } = await request.json()

    if (!phone) {
      return NextResponse.json(
        { message: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Валидация номера телефона
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { message: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    // Генерация 6-значного кода
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 минут

    // Находим или создаем пользователя
    let user = await prisma.user.findUnique({
      where: { phone },
      include: { userProfiles: true }
    })

    const isNewUser = !user

    if (!user) {
      user = await prisma.user.create({
        data: { 
          phone,
          name: `User ${phone}`,
          kycStatus: 'PENDING',
          accountStatus: 'ACTIVE'
        },
        include: { userProfiles: true }
      })

      // Создаем пустой профиль для нового пользователя
      await prisma.userProfile.create({
        data: {
          userId: user.id
        }
      })
    }

    // Удаляем старые коды для этого номера
    await prisma.verificationCode.deleteMany({
      where: { phone }
    })

    // Создаем новый код
    await prisma.verificationCode.create({
      data: {
        phone,
        code,
        expiresAt,
        userId: user.id
      }
    })

    // Сохраняем попытку входа в историю
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

    // В реальном приложении здесь будет интеграция с SMS сервисом
    console.log(`Verification code for ${phone}: ${code}`)

    return NextResponse.json({
      message: 'Verification code sent successfully',
      isNewUser,
      userId: user.id,
      code: process.env.NODE_ENV === 'development' ? code : undefined
    })

  } catch (error) {
    console.error('Error sending verification code:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}