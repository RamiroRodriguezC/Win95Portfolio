# 02 — Window Store

Archivo: `src/store/windowStore.js`

Estado global de todas las ventanas. Cualquier componente puede leerlo
y modificarlo directamente sin prop drilling.

---

## Forma del estado

Cada ventana abierta es un objeto en el array `windows`:

```js
{
  id: 'about-1714000000000',  // id único de instancia (appId + timestamp)
  appId: 'about',             // referencia a APP_REGISTRY
  isMinimized: false,
  zIndex: 10,
}
```

`appId` es la clave que conecta la ventana con su definición en el registry.
El store no sabe nada sobre el contenido de las apps.

---

## Código

```js
import { create } from 'zustand'
import { APP_REGISTRY } from '../apps/_registry'

export const useWindowStore = create((set, get) => ({
  windows: [],

  openWindow: (appId) => {
    const { windows } = get()
    const app = APP_REGISTRY[appId]
    if (!app) return

    // Si ya está abierta, solo la enfoca
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

  // Interno: calcula el próximo z-index más alto
  _nextZIndex: () => {
    const { windows } = get()
    if (windows.length === 0) return 10
    return Math.max(...windows.map(w => w.zIndex)) + 1
  },
}))
```

---

## Contrato de uso

| Acción | Llamada |
|---|---|
| Abrir una app por id | `openWindow('about')` |
| Cerrar una ventana | `closeWindow(win.id)` |
| Minimizar | `minimizeWindow(win.id)` |
| Restaurar desde taskbar | `restoreWindow(win.id)` |
| Traer al frente | `focusWindow(win.id)` |

Consumo desde cualquier componente:

```js
const { windows, openWindow, closeWindow } = useWindowStore()
```