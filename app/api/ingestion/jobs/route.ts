import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

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
  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.flatten().formErrors[0] ?? 'Invalid job payload.' },
      { status: 400 },
    )
  }

  const payload = parsed.data
  const authorization = request.headers.get('authorization')

  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) {
    return NextResponse.json({ message: 'Backend API URL is not configured.' }, { status: 500 })
  }

  if (payload.mode === 'bulk') {
    return NextResponse.json(
      { message: 'Bulk mode is not available on the backend yet.' },
      { status: 400 },
    )
  }

  const source =
    payload.sources.length === 2
      ? 'both'
      : payload.sources[0] === 'prothom-alo'
        ? 'prothom_alo'
        : 'daily_star'

  const response = await fetch(`${apiUrl.replace(/\/$/, '')}/api/v1/jobs/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authorization ? { Authorization: authorization } : {}),
    },
    body: JSON.stringify({
      source,
      date_from: `${payload.startYear}-01-01`,
      date_to: `${payload.endYear}-12-31`,
    }),
    cache: 'no-store',
  })

  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>

  if (!response.ok) {
    const message =
      typeof data.detail === 'string'
        ? data.detail
        : typeof data.message === 'string'
          ? data.message
          : 'Unable to queue crawl job.'

    return NextResponse.json({ message }, { status: response.status })
  }

  return NextResponse.json({
    id: data.id ?? crypto.randomUUID(),
    queuedAt: new Date().toISOString(),
    mode: 'standard',
    message: `Queued crawl job for ${payload.startYear}-${payload.endYear}.`,
  })
}
