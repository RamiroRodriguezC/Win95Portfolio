# 03 — APP_REGISTRY

Archivo: `src/apps/_registry.js`

Registro central de todas las apps y carpetas del sistema.
Agregar una app nueva = agregar una entrada acá. Nada más.

---

## Reglas del registry

### type: 'app'
- Requiere `component`: referencia directa a la función React (no un string)
- El Window Manager renderiza `component` dentro del frame
- Puede declarar `menuBar` (opcional)

### type: 'folder'
- No declara `component`; el Window Manager implícitamente usa `FolderWindow`
- Requiere `children`: array de ids de otras entradas del registry
- Las carpetas son anidables sin límite (una carpeta puede tener carpetas adentro)

### showOnDesktop
- `true` → el ícono aparece en el escritorio
- `false` → solo accesible desde una carpeta o el StartMenu
- Si `showOnDesktop: true`, requiere `desktop: { col, row }` para posición en grilla

### defaultSize y defaultPosition
- Solo aplican a `type: 'app'`
- Son los valores iniciales al abrir la ventana; el usuario puede moverla y redimensionarla

---

## Código

```js
import AboutMe from './AboutMe'
import Contact from './Contact'
import Experience from './Experience'
import Minesweeper from './Minesweeper'

export const APP_REGISTRY = {

  // Carpeta principal en el desktop
  me: {
    id: 'me',
    title: 'Me',
    icon: '/icons/folder.png',
    type: 'folder',
    showOnDesktop: true,
    desktop: { col: 1, row: 1 },
    children: ['about', 'experience', 'contact'],
  },

  // Apps dentro de la carpeta "Me"
  about: {
    id: 'about',
    title: 'Sobre Mí',
    icon: '/icons/user.png',
    type: 'app',
    component: AboutMe,
    showOnDesktop: false,
    defaultSize: { w: 580, h: 420 },
    defaultPosition: { x: 120, y: 80 },
    menuBar: [
      {
        label: 'File',
        items: [
          { label: 'Close', action: 'CLOSE_WINDOW' },
        ],
      },
    ],
  },

  experience: {
    id: 'experience',
    title: 'Experiencia.txt',
    icon: '/icons/text.png',
    type: 'app',
    component: Experience,
    showOnDesktop: false,
    defaultSize: { w: 600, h: 480 },
    defaultPosition: { x: 150, y: 100 },
  },

  contact: {
    id: 'contact',
    title: 'Mail Me',
    icon: '/icons/mail.png',
    type: 'app',
    component: Contact,
    showOnDesktop: false,
    defaultSize: { w: 420, h: 320 },
    defaultPosition: { x: 200, y: 120 },
  },

  // App suelta en el desktop
  minesweeper: {
    id: 'minesweeper',
    title: 'Buscaminas',
    icon: '/icons/minesweeper.png',
    type: 'app',
    component: Minesweeper,
    showOnDesktop: true,
    desktop: { col: 1, row: 3 },
    defaultSize: { w: 300, h: 360 },
    defaultPosition: { x: 300, y: 150 },
  },
}
```

---

## Apps placeholder

Durante Fase 1 cada app puede ser un componente mínimo.
El motor no depende del contenido.

```jsx
// src/apps/AboutMe/index.jsx
export default function AboutMe() {
  return <div style={{ padding: 16 }}>AboutMe — WIP</div>
}
```

Repetir el mismo patrón para Contact, Experience y Minesweeper.