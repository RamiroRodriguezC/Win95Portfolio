# win95-portfolio

Portfolio personal con estética Windows 95.
Stack: React + Vite + Zustand + react-rnd. Sin backend en Fase 1.

## Dependencias instaladas

```
zustand
react-rnd
```

No instalar dependencias adicionales sin consultar.

---

## Documentación de arquitectura

Leer todos estos archivos antes de escribir cualquier código.
Están en orden de dependencia: cada uno asume que leíste el anterior.

1. `docs/01-overview.md` — estructura de carpetas y decisiones de diseño
2. `docs/02-store.md` — Window Manager con Zustand (windowStore)
3. `docs/03-registry.md` — APP_REGISTRY: registro central de apps y carpetas
4. `docs/04-components.md` — todos los componentes del sistema con su código
5. `docs/05-build-order.md` — orden de construcción y criterios de verificación por paso

---

## Reglas

- **No agregar estilos Win95 todavía.** CSS mínimo para que funcione visualmente, nada más.
- **No inventar estructura.** Seguir exactamente la estructura de carpetas de `docs/01-overview.md`.
- **No instalar dependencias no declaradas.**
- **Cada componente vive en su propia carpeta** con su CSS Module.
- **Las apps en `/apps/` son autocontenidas.** El frame, titlebar y menubar nunca viven dentro de una app.
- **Seguir el orden de `docs/05-build-order.md` estrictamente.** Verificar cada paso antes de continuar.
- **Los componentes de apps son placeholders en Fase 1.** Solo necesitan retornar un div con texto "WIP".

---

## Arquitectura en una línea

El usuario hace doble click en un DesktopIcon → llama a `openWindow(appId)` en el store → el store agrega la ventana → Desktop renderiza un `<Window>` → Window resuelve qué componente mostrar según el tipo en APP_REGISTRY.