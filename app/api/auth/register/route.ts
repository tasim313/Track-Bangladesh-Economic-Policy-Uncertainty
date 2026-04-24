import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { registerUser } from '@/lib/server/auth-service'

const schema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
})

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.flatten().formErrors[0] ?? 'Invalid registration payload.' },
      { status: 400 },
    )
  }

  try {
    const result = await registerUser(parsed.data)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Unable to register user.',
      },
      { status: 400 },
    )
  }
}
