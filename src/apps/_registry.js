import { lazy } from 'react'
import contactMeta from './ContactMe/meta'
import experienceMeta from './Experience/meta'
import minesweeperMeta from './Minesweeper/meta'
import skillsMeta from './Skills/meta'
import proyectsMeta from './Proyects/meta'
import curriculumMeta from './Curriculum/meta'

export const APP_REGISTRY = {
  contact: {
    ...contactMeta,
    component: lazy(() => import('./ContactMe')),
  },
  experience: {
    ...experienceMeta,
    component: lazy(() => import('./Experience')),
  },
  minesweeper: {
    ...minesweeperMeta,
    component: lazy(() => import('./Minesweeper')),
  },
  skills: {
    ...skillsMeta,
    component: lazy(() => import('./Skills')),
  },
  proyects: {
    ...proyectsMeta,
    component: lazy(() => import('./Proyects')),
  },
  curriculum: {
    ...curriculumMeta,
    component: lazy(() => import('./Curriculum')),
  }
}
