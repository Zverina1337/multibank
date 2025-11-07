import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    return NextResponse.json({ 
      ip: ip.split(',')[0].trim() // Берем первый IP из цепочки
    })
  } catch (error) {
    return NextResponse.json({ ip: 'unknown' })
  }
}