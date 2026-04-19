import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'

const schema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('standard'),
    sources: z.array(z.enum(['prothom-alo', 'daily-star'])).min(1),
    startYear: z.number().min(2010).max(2024),
    endYear: z.number().min(2010).max(2024),
    language: z.enum(['bangla', 'english', 'mixed']),
    frequency: z.enum(['daily', 'monthly']),
  }),
  z.object({
    mode: z.literal('bulk'),
    urls: z.array(z.string().url()).min(1),
  }),
])

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.flatten().formErrors[0] ?? 'Invalid job payload.' },
      { status: 400 },
    )
  }

  const payload = parsed.data

  return NextResponse.json({
    id: crypto.randomUUID(),
    queuedAt: new Date().toISOString(),
    mode: payload.mode,
    message:
      payload.mode === 'standard'
        ? `Queued ${payload.sources.length} standard sources for ${payload.startYear}-${payload.endYear}.`
        : `Queued ${payload.urls.length} external evidence links.`,
  })
}
