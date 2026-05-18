# 04 — Componentes del Sistema

Estos son los componentes que pertenecen al SISTEMA, no a las apps.
Ninguna app renderiza su propio frame, titlebar ni menubar.

---

## Mapa de responsabilidades

```
react-rnd           — drag y resize (invisible, sin UI propia)
Window.jsx          — frame visual: borde, titlebar, menubar
  └── TitleBar.jsx  — título + botones minimizar/cerrar
  └── MenuBar.jsx   — barra de menús declarada por la app en meta.js
  └── [contenido]   — lo que resuelva resolveContent()
        ├── <AppComponent />   (si type: 'app')
        └── <FolderWindow />   (si type: 'folder')

Desktop.jsx         — fondo del escritorio + ventanas abiertas
  └── IconGrid.jsx  — grilla de íconos (compartido con FolderWindow)
        └── DesktopIcon.jsx

FolderWindow.jsx    — contenido de cualquier carpeta
  └── IconGrid.jsx  — mismo componente que usa Desktop

Taskbar.jsx         — barra inferior
  └── Clock.jsx     — reloj
```

---

## Cómo funciona el marco (Window + react-rnd)

Hay tres capas que trabajan juntas:

```
┌─ react-rnd ─────────────────────────────────────┐
│  Hace el drag y resize. Es invisible, sin UI.    │
│                                                  │
│  ┌─ Window.jsx (frame visual Win95) ───────────┐ │
│  │  TitleBar  [_] [X]                          │ │
│  │  MenuBar   File  Edit  View                 │ │
│  │  ┌─ contenido ───────────────────────────┐  │ │
│  │  │  <AboutMe /> o <FolderWindow />       │  │ │
│  │  └───────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

La app solo dibuja su contenido interior.
No sabe que existe un marco, un titlebar ni react-rnd.

---

## Window (`src/components/Window/Window.jsx`)

Responsabilidad: envolver cualquier app en el frame de Win95 con drag y resize.

Recibe: `win` (objeto del store con `id`, `appId`, `isMinimized`, `zIndex`)
Lee: `APP_REGISTRY[win.appId]` para saber qué renderizar y con qué configuración

Lógica de resolución de contenido:
- Si `app.type === 'folder'` → renderiza `<FolderWindow childIds={app.children} />`
- Si `app.type === 'app'` → renderiza `<app.component windowId={win.id} />`
- Si `win.isMinimized === true` → retorna `null`

```jsx
import { Rnd } from 'react-rnd'
import { useWindowStore } from '../../store/windowStore'
import { APP_REGISTRY } from '../../apps/_registry'
import FolderWindow from '../FolderWindow/FolderWindow'
import TitleBar from './TitleBar'
import MenuBar from './MenuBar'
import styles from './Window.module.css'

function resolveContent(app, windowId) {
  if (app.type === 'folder') {
    return <FolderWindow childIds={app.children} />
  }
  const AppComponent = app.component
  return <AppComponent windowId={windowId} />
}

export default function Window({ win }) {
  const { closeWindow, minimizeWindow, focusWindow } = useWindowStore()
  const app = APP_REGISTRY[win.appId]

  if (!app || win.isMinimized) return null

  return (
    <Rnd
      default={{
        x: app.defaultPosition?.x ?? 100,
        y: app.defaultPosition?.y ?? 100,
        width: app.defaultSize?.w ?? 400,
        height: app.defaultSize?.h ?? 300,
      }}
      minWidth={200}
      minHeight={150}
      dragHandleClassName={styles.titleBar}
      bounds="parent"
      style={{ zIndex: win.zIndex, position: 'absolute' }}
      onMouseDown={() => focusWindow(win.id)}
    >
      <div className={styles.windowFrame}>
        <TitleBar
          title={app.title}
          onClose={() => closeWindow(win.id)}
          onMinimize={() => minimizeWindow(win.id)}
          className={styles.titleBar}
        />
        {app.menuBar && <MenuBar items={app.menuBar} windowId={win.id} />}
        <div className={styles.content}>
          {resolveContent(app, win.id)}
        </div>
      </div>
    </Rnd>
  )
}
```

CSS mínimo:

```css
/* Window.module.css */
.windowFrame {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #c0c0c0;
  border: 2px solid #000;
  overflow: hidden;
}

.titleBar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 4px;
  background: navy;
  color: white;
  cursor: move;
  user-select: none;
}

.content {
  flex: 1;
  overflow: auto;
}
```

---

## TitleBar (`src/components/Window/TitleBar.jsx`)

Responsabilidad: título de la ventana y botones de control.

La prop `className` debe aplicarse al elemento raíz porque react-rnd
la usa como drag handle: solo ese elemento activa el drag.

```jsx
export default function TitleBar({ title, onClose, onMinimize, className }) {
  return (
    <div className={className}>
      <span>{title}</span>
      <div>
        <button onClick={onMinimize}>_</button>
        <button onClick={onClose}>X</button>
      </div>
    </div>
  )
}
```

---

## MenuBar (`src/components/Window/MenuBar.jsx`)

Responsabilidad: renderizar la barra de menú declarada en `meta.js` de cada app.
No sabe nada sobre las apps; solo recibe datos y renderiza.

`CLOSE_WINDOW` es manejado por el sistema directamente.
Otras acciones son Fase 2.

```jsx
import { useWindowStore } from '../../store/windowStore'

export default function MenuBar({ items, windowId }) {
  const { closeWindow } = useWindowStore()

  function handleAction(action) {
    if (action === 'CLOSE_WINDOW') closeWindow(windowId)
  }

  return (
    <div>
      {items.map(menu => (
        <div key={menu.label}>
          <span>{menu.label}</span>
          <ul>
            {menu.items.map(item => (
              <li key={item.label} onClick={() => handleAction(item.action)}>
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
```

---

## IconGrid (`src/components/IconGrid/IconGrid.jsx`)

Responsabilidad: renderizar una grilla de íconos dado un array de apps.
Componente compartido entre Desktop y FolderWindow.
No sabe de dónde vienen las apps ni qué son.

La prop `positioned` controla si cada ícono usa su `desktop.col` y `desktop.row`
del registry para ubicarse en celda fija (Desktop) o si fluye libremente (FolderWindow).

```jsx
import DesktopIcon from '../DesktopIcon/DesktopIcon'
import styles from './IconGrid.module.css'

export default function IconGrid({ apps, positioned = false }) {
  return (
    <div className={styles.grid}>
      {apps.map(app => (
        <DesktopIcon
          key={app.id}
          app={app}
          style={positioned ? {
            gridColumn: app.desktop?.col,
            gridRow: app.desktop?.row,
          } : undefined}
        />
      ))}
    </div>
  )
}
```

CSS:

```css
/* IconGrid.module.css */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 80px);
  grid-template-rows: repeat(auto-fill, 90px);
  gap: 8px;
  padding: 8px;
}
```

---

## DesktopIcon (`src/components/DesktopIcon/DesktopIcon.jsx`)

Responsabilidad: un ícono clickeable con imagen y label.
El mismo componente se usa en IconGrid, que lo usan tanto Desktop como FolderWindow.
Doble click llama a `openWindow(app.id)`.

```jsx
import { useWindowStore } from '../../store/windowStore'
import styles from './DesktopIcon.module.css'

export default function DesktopIcon({ app, style }) {
  const { openWindow } = useWindowStore()

  return (
    <div
      className={styles.icon}
      style={style}
      onDoubleClick={() => openWindow(app.id)}
    >
      <img src={app.icon} alt={app.title} width={32} height={32} />
      <span>{app.title}</span>
    </div>
  )
}
```

---

## Desktop (`src/components/Desktop/Desktop.jsx`)

Responsabilidad: fondo del escritorio, íconos y ventanas abiertas.
Delega el renderizado de íconos a IconGrid con `positioned={true}`.

```jsx
import { useWindowStore } from '../../store/windowStore'
import { APP_REGISTRY } from '../../apps/_registry'
import IconGrid from '../IconGrid/IconGrid'
import Window from '../Window/Window'
import styles from './Desktop.module.css'

const desktopApps = Object.values(APP_REGISTRY).filter(app => app.showOnDesktop)

export default function Desktop() {
  const { windows } = useWindowStore()

  return (
    <div className={styles.desktop}>
      <IconGrid apps={desktopApps} positioned={true} />

      {windows.map(win => (
        <Window key={win.id} win={win} />
      ))}
    </div>
  )
}
```

CSS mínimo:

```css
/* Desktop.module.css */
.desktop {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: teal;
}
```

---

## FolderWindow (`src/components/FolderWindow/FolderWindow.jsx`)

Responsabilidad: contenido genérico de cualquier carpeta.
Resuelve los ids en el registry y delega a IconGrid sin posición fija.
Es el componente que Window renderiza implícitamente cuando `type: 'folder'`.

```jsx
import { APP_REGISTRY } from '../../apps/_registry'
import IconGrid from '../IconGrid/IconGrid'

export default function FolderWindow({ childIds }) {
  const apps = childIds.map(id => APP_REGISTRY[id]).filter(Boolean)
  return <IconGrid apps={apps} />
}
```

Sin CSS propio: hereda el layout de IconGrid.

---

## Taskbar (`src/components/Taskbar/Taskbar.jsx`)

Responsabilidad: botón por cada ventana abierta (incluyendo minimizadas).
Click en ventana activa → minimiza. Click en minimizada → restaura.

```jsx
import { useWindowStore } from '../../store/windowStore'
import { APP_REGISTRY } from '../../apps/_registry'
import Clock from './Clock'
import styles from './Taskbar.module.css'

export default function Taskbar() {
  const { windows, restoreWindow, minimizeWindow } = useWindowStore()

  return (
    <div className={styles.taskbar}>
      <button className={styles.startButton}>Start</button>

      <div className={styles.windowButtons}>
        {windows.map(win => {
          const app = APP_REGISTRY[win.appId]
          return (
            <button
              key={win.id}
              className={`${styles.taskButton} ${!win.isMinimized ? styles.active : ''}`}
              onClick={() =>
                win.isMinimized ? restoreWindow(win.id) : minimizeWindow(win.id)
              }
            >
              <img src={app.icon} alt="" width={16} height={16} />
              {app.title}
            </button>
          )
        })}
      </div>

      <Clock />
    </div>
  )
}
```

CSS mínimo:

```css
/* Taskbar.module.css */
.taskbar {
  height: 40px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 4px;
  background: #c0c0c0;
  border-top: 2px solid #fff;
}

.windowButtons {
  display: flex;
  gap: 4px;
  flex: 1;
}
```

---

## Clock (`src/components/Taskbar/Clock.jsx`)

Responsabilidad: hora actual actualizada cada minuto.

```jsx
import { useState, useEffect } from 'react'

export default function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </div>
  )
}
```