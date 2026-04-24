export async function apiFetch(path: string, init: RequestInit = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? ''
  const url = baseUrl ? `${baseUrl.replace(/\/$/, '')}${path}` : path
  const token = typeof window !== 'undefined' ? localStorage.getItem('epu-auth') : null
  let accessToken: string | undefined

  if (token) {
    try {
      const parsed = JSON.parse(token) as {
        accessToken?: string
        state?: {
          accessToken?: string
          state?: {
            accessToken?: string
          }
        }
      }
      accessToken =
        parsed?.state?.accessToken ??
        parsed?.accessToken ??
        parsed?.state?.state?.accessToken
    } catch {
      accessToken = undefined
    }
  }

  return fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(init.headers ?? {}),
    },
  })
}
