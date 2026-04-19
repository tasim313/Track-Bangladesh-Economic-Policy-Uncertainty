import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { resetPassword } from '@/lib/server/auth-service'

const schema = z.object({
  email: z.string().email('Enter a valid email address.'),
  token: z.string().min(1, 'Reset token is required.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
})

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.flatten().formErrors[0] ?? 'Invalid reset payload.' },
      { status: 400 },
    )
  }

  const result = await resetPassword(parsed.data)
  return NextResponse.json(result)
}
