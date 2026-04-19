'use client'

import { create } from 'zustand'

type IngestionMode = 'standard' | 'bulk'

type UIState = {
  sidebarOpen: boolean
  ingestionMode: IngestionMode
  setSidebarOpen: (open: boolean) => void
  setIngestionMode: (mode: IngestionMode) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  ingestionMode: 'standard',
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setIngestionMode: (mode) => set({ ingestionMode: mode }),
}))
