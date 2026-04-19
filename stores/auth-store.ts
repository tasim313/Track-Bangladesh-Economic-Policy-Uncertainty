'use client'

import { create } from 'zustand'

type AuthStore = {
  accessToken?: string
  setAccessToken: (token?: string) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: undefined,
  setAccessToken: (token) => set({ accessToken: token }),
}))
