# 01 — Overview

## Stack

- **React + Vite** — sin backend en Fase 1
- **Zustand** — estado global del Window Manager
- **react-rnd** — drag y resize de ventanas
- **CSS Modules** — estilos por componente

```bash
npm create vite@latest win95-portfolio -- --template react
npm install zustand react-rnd
```

---

## Estructura de carpetas

```
src/
├── apps/
│   ├── _registry.js         # Registro central de todas las apps
│   ├── ContactMe/
│   │   ├── index.jsx
│   │   └── meta.js
│   ├── Experience/
│   │   ├── index.jsx
│   │   └── meta.js
│   ├── Minesweeper/
│   │    ├── index.jsx
│   │    └── meta.js
│   ├── Skills/
│   │   ├── index.jsx
│   │   └── meta.js
│   ├── Proyects/
│   │   ├── index.jsx
│   │   └── meta.js
├── components/
│   ├── Desktop/
│   │   ├── Desktop.jsx
│   │   └── Desktop.module.css
│   ├── DesktopIcon/
│   │   ├── DesktopIcon.jsx
│   │   └── DesktopIcon.module.css
│   ├── Window/
│   │   ├── Window.jsx
│   │   ├── Window.module.css
│   │   ├── TitleBar.jsx
│   │   └── MenuBar.jsx
│   ├── FolderWindow/
│   │   ├── FolderWindow.jsx
│   │   └── FolderWindow.module.css
│   └── Taskbar/
│       ├── Taskbar.jsx
│       ├── Taskbar.module.css
│       ├── StartMenu.jsx
│       └── Clock.jsx
│
├── store/
│   └── windowStore.js
│
├── assets/
│   └── icons/               # PNGs 32x32 estilo Win95
│
├── App.jsx
└── main.jsx
```

---

## Decisiones de diseño

| Decisión | Elección | Razón |
|---|---|---|
| Estado global | Zustand | Sin boilerplate, lectura directa desde cualquier componente |
| Drag y resize | react-rnd | Evita semanas de trabajo, API limpia |
| Posición en desktop | CSS Grid con col/row | Simple y predecible; drag-to-reposition es Fase 2 |
| Carpetas | `type: 'folder'` implica `FolderWindow` | No repite el componente en cada entrada del registry |
| Menú de apps | Datos en `meta.js`, UI en el frame | Un solo lugar para cambiar el estilo del frame |
| Backend | Ninguno en Fase 1 | Portfolio estático; Node/Mongo se agrega para contact form |
| Routing | Ninguno | Todo es estado de ventanas abiertas y cerradas |

---

## App.jsx

Raíz de la aplicación. Solo compone Desktop y Taskbar.

```jsx
import Desktop from './components/Desktop/Desktop'
import Taskbar from './components/Taskbar/Taskbar'

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Desktop />
      <Taskbar />
    </div>
  )
}
```