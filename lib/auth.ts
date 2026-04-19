import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import type { Provider } from 'next-auth/providers/index'
import { loginWithCredentials, refreshAccessToken } from '@/lib/server/auth-service'

const providers: Provider[] = [
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials.password) {
        throw new Error('Email and password are required.')
      }

      const result = await loginWithCredentials(credentials.email, credentials.password)

      return {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name ?? result.user.fullName,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        accessTokenExpires: result.accessTokenExpires,
      }
    },
  }),
]

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  )
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  providers,
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.user = {
          id: user.id,
          email: user.email ?? token.email ?? '',
          name: user.name,
          fullName: user.name ?? undefined,
        }
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.accessTokenExpires = user.accessTokenExpires
      }

      if (account?.provider === 'google' && account.id_token) {
        token.accessToken = account.id_token
        token.accessTokenExpires = Date.now() + 60 * 60 * 1000
        token.user = {
          id: token.sub ?? crypto.randomUUID(),
          email: token.email ?? '',
          name: token.name,
          fullName: token.name ?? undefined,
        }
      }

      if (token.accessToken && token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token
      }

      if (!token.refreshToken) {
        return token
      }

      try {
        const refreshed = await refreshAccessToken(token.refreshToken)

        return {
          ...token,
          accessToken: refreshed.accessToken,
          refreshToken: refreshed.refreshToken,
          accessTokenExpires: refreshed.accessTokenExpires,
          error: undefined,
        }
      } catch {
        return {
          ...token,
          error: 'RefreshAccessTokenError',
        }
      }
    },
    async session({ session, token }) {
      if (session.user && token.user) {
        session.user.id = token.user.id
        session.user.email = token.user.email
        session.user.name = token.user.name
        session.user.fullName = token.user.fullName
      }

      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      session.accessTokenExpires = token.accessTokenExpires
      session.error = token.error

      return session
    },
  },
}
