import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '../../../../../lib/prisma'

export async function POST(request) {
  try {
    const {
      phone,
      name,
      email,
      dateOfBirth,
      gender,
      country,
      city,
      address,
      postalCode,
      idNumber,
      idType,
      occupation,
      company,
      incomeRange,
      // Profile data
      maritalStatus,
      dependents,
      educationLevel,
      investmentExperience,
      investmentGoals,
      sourceOfFunds,
      taxResidency,
      politicallyExposed
    } = await request.json()

    // Валидация обязательных полей
    if (!phone) {
      return NextResponse.json(
        { message: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Проверяем, существует ли пользователь
    const existingUser = await prisma.user.findUnique({
      where: { phone }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this phone number' },
        { status: 400 }
      )
    }

    // Создаем пользователя с полной информацией
    const user = await prisma.user.create({
      data: {
        phone,
        name,
        email,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        country,
        city,
        address,
        postalCode,
        idNumber,
        idType,
        occupation,
        company,
        incomeRange,
        kycStatus: 'PENDING',
        accountStatus: 'ACTIVE',
        userProfiles: {
          create: {
            maritalStatus,
            dependents: dependents ? parseInt(dependents) : null,
            educationLevel,
            investmentExperience,
            investmentGoals,
            sourceOfFunds,
            taxResidency,
            politicallyExposed: politicallyExposed || false
          }
        }
      },
      include: {
        userProfiles: true
      }
    })

    // Генерация верификационного кода
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 минут

    await prisma.verificationCode.create({
      data: {
        phone,
        code: verificationCode,
        expiresAt,
        userId: user.id
      }
    })

    // В реальном приложении здесь будет отправка SMS
    console.log(`Verification code for ${phone}: ${verificationCode}`)

    return NextResponse.json({
      message: 'User registered successfully. Verification code sent.',
      userId: user.id,
      code: process.env.NODE_ENV === 'development' ? verificationCode : undefined
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}