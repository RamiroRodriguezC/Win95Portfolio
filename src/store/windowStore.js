import { create } from 'zustand'
import { APP_REGISTRY } from '../apps/_registry'

export const useWindowStore = create((set, get) => ({
  windows: [],

  openWindow: (appId) => {
    const { windows } = get()
    const app = APP_REGISTRY[appId]
    if (!app) return

    const existing = windows.find(w => w.appId === appId)
    if (existing) {
      get().focusWindow(existing.id)
      return
    }

    const newWindow = {
      id: `${appId}-${Date.now()}`,
      appId,
      isMinimized: false,
      zIndex: get()._nextZIndex(),
    }

    set(state => ({ windows: [...state.windows, newWindow] }))
  },

  closeWindow: (windowId) => {
    set(state => ({
      windows: state.windows.filter(w => w.id !== windowId),
    }))
  },

  minimizeWindow: (windowId) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === windowId ? { ...w, isMinimized: true } : w
      ),
    }))
  },

  restoreWindow: (windowId) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === windowId ? { ...w, isMinimized: false } : w
      ),
    }))
    get().focusWindow(windowId)
  },

  focusWindow: (windowId) => {
    const nextZ = get()._nextZIndex()
    set(state => ({
      windows: state.windows.map(w =>
        w.id === windowId ? { ...w, zIndex: nextZ } : w
      ),
    }))
  },

  _nextZIndex: () => {
    const { windows } = get()
    if (windows.length === 0) return 10
    return Math.max(...windows.map(w => w.zIndex)) + 1
  },
}))
