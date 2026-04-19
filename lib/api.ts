import { getSession } from 'next-auth/react'

export async function apiFetch(path: string, init: RequestInit = {}) {
  const session = await getSession()
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? ''
  const url = baseUrl ? `${baseUrl.replace(/\/$/, '')}${path}` : path

  return fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
      ...(init.headers ?? {}),
    },
  })
}
