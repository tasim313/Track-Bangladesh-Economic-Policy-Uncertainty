import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requestPasswordReset } from '@/lib/server/auth-service'

const schema = z.object({
  email: z.string().email('Enter a valid email address.'),
})

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.flatten().formErrors[0] ?? 'Invalid email.' },
      { status: 400 },
    )
  }

  const result = await requestPasswordReset(parsed.data.email)
  return NextResponse.json(result)
}
