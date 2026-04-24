'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthStore = {
  user?: {
    id?: string
    email?: string
    name?: string
    fullName?: string
  }
  accessToken?: string
  refreshToken?: string
  accessTokenExpires?: number
  isHydrated: boolean
  setAuth: (auth: {
    accessToken: string
    refreshToken?: string
    accessTokenExpires?: number
    user?: {
      id?: string
      email?: string
      name?: string
      fullName?: string
    }
  }) => void
  clearAuth: () => void
  setHydrated: (value: boolean) => void
  setAccessToken: (token?: string) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: undefined,
      refreshToken: undefined,
      accessTokenExpires: undefined,
      user: undefined,
      isHydrated: false,
      setAuth: (auth) =>
        set({
          accessToken: auth.accessToken,
          refreshToken: auth.refreshToken,
          accessTokenExpires: auth.accessTokenExpires,
          user: auth.user,
        }),
      clearAuth: () =>
        set({
          accessToken: undefined,
          refreshToken: undefined,
          accessTokenExpires: undefined,
          user: undefined,
        }),
      setHydrated: (value) => set({ isHydrated: value }),
      setAccessToken: (token) => set({ accessToken: token }),
    }),
    {
      name: 'epu-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    },
  ),
)
