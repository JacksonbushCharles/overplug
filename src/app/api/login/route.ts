import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body.password === 'string' ? body.password : ''

  const validEmail = process.env.LOGIN_EMAIL?.trim().toLowerCase() || ''
  const validPassword = process.env.LOGIN_PASSWORD || ''

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 })
  }

  if (email !== validEmail || password !== validPassword) {
    return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 })
  }

  return NextResponse.json({ success: true })
}
