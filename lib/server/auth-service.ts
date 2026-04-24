type BackendUser = {
  id: string
  email: string
  name?: string
  fullName?: string
}

export type AuthTokens = {
  accessToken: string
  refreshToken: string
  accessTokenExpires: number
  user: BackendUser
}

type RegisterPayload = {
  fullName: string
  email: string
  password: string
}

type ResetPayload = {
  email: string
  token: string
  password: string
}

const AUTH_REFRESH_BUFFER_MS = 60 * 1000

function getApiUrl() {
  return process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL
}

function inThirtyMinutes() {
  return Date.now() + 30 * 60 * 1000
}

function normalizeUser(payload: Record<string, unknown>, emailFallback?: string): BackendUser {
  const user = (payload.user ?? payload.data ?? {}) as Record<string, unknown>
  const firstName = typeof user.first_name === 'string' ? user.first_name : ''
  const lastName = typeof user.last_name === 'string' ? user.last_name : ''
  const fullName =
    typeof user.full_name === 'string'
      ? user.full_name
      : `${firstName} ${lastName}`.trim() || undefined

  return {
    id: String(user.id ?? payload.user_id ?? crypto.randomUUID()),
    email: String(user.email ?? emailFallback ?? ''),
    name: typeof user.name === 'string' ? user.name : fullName ?? emailFallback?.split('@')[0],
    fullName,
  }
}

function normalizeTokens(payload: Record<string, unknown>, emailFallback?: string): AuthTokens {
  const accessToken =
    String(payload.access ?? payload.access_token ?? (payload.tokens as Record<string, unknown> | undefined)?.access ?? 'demo-access-token')
  const refreshToken =
    String(payload.refresh ?? payload.refresh_token ?? (payload.tokens as Record<string, unknown> | undefined)?.refresh ?? 'demo-refresh-token')
  const expiresIn =
    Number(payload.expires_in ?? payload.access_expires_in ?? (payload.tokens as Record<string, unknown> | undefined)?.expires_in ?? 1800)

  return {
    accessToken,
    refreshToken,
    accessTokenExpires: Date.now() + expiresIn * 1000 - AUTH_REFRESH_BUFFER_MS,
    user: normalizeUser(payload, emailFallback),
  }
}

async function postToBackend(path: string | string[], body: Record<string, unknown>) {
  const apiUrl = getApiUrl()

  if (!apiUrl) {
    return null
  }

  const paths = Array.isArray(path) ? path : [path]

  for (const candidatePath of paths) {
    const response = await fetch(`${apiUrl.replace(/\/$/, '')}${candidatePath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    })

    const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>

    if (response.ok) {
      return payload
    }

    if (response.status === 404 || response.status === 405) {
      continue
    }

    const message =
      typeof payload.detail === 'string'
        ? payload.detail
        : typeof payload.message === 'string'
          ? payload.message
          : 'The authentication service rejected the request.'

    throw new Error(message)
  }

  return null
}

export async function loginWithCredentials(email: string, password: string) {
  if (!email || !password) {
    throw new Error('Email and password are required.')
  }

  const payload = await postToBackend(
    ['/api/v1/auth/token/', '/auth/login/'],
    { email, username: email, password },
  )

  if (!payload) {
    return {
      accessToken: `demo-access-${Buffer.from(email).toString('base64url')}`,
      refreshToken: `demo-refresh-${Date.now()}`,
      accessTokenExpires: inThirtyMinutes(),
      user: {
        id: `demo-${Buffer.from(email).toString('base64url')}`,
        email,
        name: email.split('@')[0],
        fullName: email.split('@')[0],
      },
    } satisfies AuthTokens
  }

  return normalizeTokens(payload, email)
}

export async function refreshAccessToken(refreshToken: string) {
  if (!refreshToken) {
    throw new Error('Missing refresh token.')
  }

  const payload = await postToBackend(['/api/v1/auth/token/refresh/', '/auth/token/refresh/'], { refresh: refreshToken })

  if (!payload) {
    return {
      accessToken: `demo-access-refresh-${Date.now()}`,
      refreshToken,
      accessTokenExpires: inThirtyMinutes(),
    }
  }

  return {
    accessToken: String(payload.access ?? payload.access_token ?? refreshToken),
    refreshToken: String(payload.refresh ?? payload.refresh_token ?? refreshToken),
    accessTokenExpires:
      Date.now() +
      Number(payload.expires_in ?? payload.access_expires_in ?? 1800) * 1000 -
      AUTH_REFRESH_BUFFER_MS,
  }
}

export async function registerUser(payload: RegisterPayload) {
  const backendPayload = await postToBackend(['/api/v1/auth/register/', '/auth/register/'], {
    full_name: payload.fullName,
    email: payload.email,
    password: payload.password,
  })

  if (!backendPayload) {
    return {
      message: 'Account created in scaffold mode.',
    }
  }

  return backendPayload
}

export async function requestPasswordReset(email: string) {
  const payload = await postToBackend('/auth/password/forgot/', { email })

  if (!payload) {
    return {
      message: 'Password reset instructions generated in scaffold mode.',
    }
  }

  return payload
}

export async function resetPassword(payload: ResetPayload) {
  const response = await postToBackend('/auth/password/reset/', {
    email: payload.email,
    token: payload.token,
    password: payload.password,
  })

  if (!response) {
    return {
      message: 'Password updated in scaffold mode.',
    }
  }

  return response
}
