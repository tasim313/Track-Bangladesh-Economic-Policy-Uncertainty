import { DefaultSession } from 'next-auth'
import { JWT as DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    error?: 'RefreshAccessTokenError'
    user: DefaultSession['user'] & {
      id: string
      fullName?: string
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    user?: {
      id: string
      email: string
      name?: string | null
      fullName?: string
    }
    error?: 'RefreshAccessTokenError'
  }
}
